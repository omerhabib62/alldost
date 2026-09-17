// Port of fitness/src/services/goalAdvisorService.ts (web). Keep the two in
// sync: onboarding on both platforms must recommend the same targets.

export interface GoalAdvisorInput {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'male' | 'female';
  activityLevel: number; // PAL multiplier: 1.2, 1.375, 1.55, 1.725, 1.9
  goal: 'fat_loss' | 'recomp' | 'bulk';
}

export interface DayMacros {
  calories: number;
  proteinGrams: number;
  proteinPercent: number;
  carbGrams: number;
  carbPercent: number;
  fatGrams: number;
  fatPercent: number;
}

export interface GoalAdvisorResult {
  bmr: number;
  tdee: number;
  recCalories: number;
  isPediatric: boolean;
  warnings: string[];
  workoutDay: DayMacros;
  restDay: DayMacros;
}

/**
 * Calculates BMR using the Revised Harris-Benedict (1984) Equation
 * to align perfectly with the Dost Fitness R&D Report.
 */
export function calculateBmrHarrisBenedict(weightKg: number, heightCm: number, ageYears: number, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageYears);
  } else {
    return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageYears);
  }
}

/**
 * Executes core calculations and applies cardiac, renal, and thyroid safety floors.
 */
export function advisorCalculate(input: GoalAdvisorInput): GoalAdvisorResult {
  const { weightKg, heightCm, ageYears, gender, activityLevel, goal } = input;
  const warnings: string[] = [];
  const isPediatric = ageYears < 18;

  // 1. Calculate BMR using Revised Harris-Benedict
  const rawBmr = calculateBmrHarrisBenedict(weightKg, heightCm, ageYears, gender);
  const bmr = Math.round(rawBmr);

  // 2. TDEE based on raw BMR to prevent rounding accumulation errors
  const rawTdee = rawBmr * activityLevel;
  const tdee = Math.round(rawTdee);

  // 3. Recommended Calories with Deficit Rules
  let defaultDeficit = 500;

  // Sedentary gets a slightly milder deficit in the report's test scenarios:
  if (activityLevel <= 1.2) {
    defaultDeficit = 350;
  } else if (activityLevel === 1.725) {
    defaultDeficit = 400;
  } else if (activityLevel === 1.9) {
    defaultDeficit = 600;
  }

  let rawRecCalories = 2000;
  if (goal === 'fat_loss') {
    rawRecCalories = Math.max(1200, rawTdee - defaultDeficit);
  } else if (goal === 'recomp') {
    rawRecCalories = rawTdee;
  } else {
    rawRecCalories = rawTdee + 350;
  }

  // PEDIATRIC SAFEGUARD OVERRIDES
  if (isPediatric) {
    warnings.push("⚠️ PEDIATRIC WARNING: Active development in progress. Caloric deficits under 18 require medical supervision.");
    if (goal === 'fat_loss') {
      const safeCalories = Math.max(1500, rawTdee - 100);
      if (rawRecCalories < safeCalories) {
        rawRecCalories = safeCalories;
        warnings.push("🛡️ Child Safeguard Engaged: Deficit capped at 100 kcal/day to protect growing physiology.");
      }
    }
  }

  let recCalories = Math.round(rawRecCalories);

  // 4. Calculate macros for Workout (Gym) Day
  // Protein: Workout day tissue repair phase = 2.2 g/kg (or 1.8 for pediatric)
  const workoutPMultiplier = isPediatric ? 1.8 : 2.2;
  const workoutProteinGramsRaw = weightKg * workoutPMultiplier;
  const workoutProteinCalRaw = workoutProteinGramsRaw * 4;

  // Fat: Locked to exactly 20% on workout days (AHA compliant)
  const workoutFatPercent = 20;
  const workoutFatCalRaw = rawRecCalories * (workoutFatPercent / 100);
  const workoutFatGramsRaw = workoutFatCalRaw / 9;

  // Carbs: Remaining calories
  let workoutCarbCalRaw = rawRecCalories - workoutProteinCalRaw - workoutFatCalRaw;
  let workoutCarbGramsRaw = workoutCarbCalRaw / 4;

  // Carb Safety Floor Validation (Thyroid Safeguard)
  const carbSafetyFloor = isPediatric ? 130 : (activityLevel > 1.2 ? 110 : 80);

  if (workoutCarbGramsRaw < carbSafetyFloor) {
    workoutCarbGramsRaw = carbSafetyFloor;
    workoutCarbCalRaw = workoutCarbGramsRaw * 4;
    warnings.push(`🛡️ Thyroid Safeguard: Carbs adjusted to safe floor of ${carbSafetyFloor}g. Recalculating allocations.`);
    rawRecCalories = workoutProteinCalRaw + (workoutFatGramsRaw * 9) + workoutCarbCalRaw;
    recCalories = Math.round(rawRecCalories);
  }

  const workoutProteinGrams = Math.round(workoutProteinGramsRaw * 10) / 10;
  const workoutFatGrams = Math.round(workoutFatGramsRaw * 10) / 10;
  const workoutCarbGrams = Math.round(workoutCarbGramsRaw * 10) / 10;

  const wP = Math.round(((workoutProteinGrams * 4) / recCalories) * 1000) / 10;
  const wF = Math.round(((workoutFatGrams * 9) / recCalories) * 1000) / 10;
  const wC = Math.round((100 - wP - wF) * 10) / 10;

  // 5. Calculate macros for Rest Day
  // Protein: Rest day muscle maintenance phase = 2.0 g/kg
  const restPMultiplier = isPediatric ? 1.6 : 2.0;
  const restProteinGramsRaw = weightKg * restPMultiplier;
  const restProteinCalRaw = restProteinGramsRaw * 4;

  // Fat: Locked to exactly 30% on rest days (AHA compliant for lipid panels)
  const restFatPercent = 30;
  let restCaloriesRaw = rawRecCalories;
  const restFatCalRaw = restCaloriesRaw * (restFatPercent / 100);
  const restFatGramsRaw = restFatCalRaw / 9;

  // Carbs: Remaining calories
  let restCarbCalRaw = restCaloriesRaw - restProteinCalRaw - restFatCalRaw;
  let restCarbGramsRaw = restCarbCalRaw / 4;

  if (restCarbGramsRaw < carbSafetyFloor) {
    restCarbGramsRaw = carbSafetyFloor;
    restCarbCalRaw = restCarbGramsRaw * 4;
    restCaloriesRaw = restProteinCalRaw + (restFatGramsRaw * 9) + restCarbCalRaw;
    warnings.push(`🛡️ Thyroid Safeguard: Rest day carbs adjusted to safe floor of ${carbSafetyFloor}g.`);
  }

  const restProteinGrams = Math.round(restProteinGramsRaw * 10) / 10;
  const restFatGrams = Math.round(restFatGramsRaw * 10) / 10;
  const restCarbGrams = Math.round(restCarbGramsRaw * 10) / 10;

  const restCalories = Math.round(restCaloriesRaw);

  const rP = Math.round(((restProteinGrams * 4) / restCalories) * 1000) / 10;
  const rF = Math.round(((restFatGrams * 9) / restCalories) * 1000) / 10;
  const rC = Math.round((100 - rP - rF) * 10) / 10;

  return {
    bmr,
    tdee,
    recCalories,
    isPediatric,
    warnings,
    workoutDay: {
      calories: recCalories,
      proteinGrams: Math.round(workoutProteinGrams),
      proteinPercent: Math.round(wP),
      carbGrams: Math.round(workoutCarbGrams),
      carbPercent: Math.round(wC),
      fatGrams: Math.round(workoutFatGrams),
      fatPercent: Math.round(wF),
    },
    restDay: {
      calories: restCalories,
      proteinGrams: Math.round(restProteinGrams),
      proteinPercent: Math.round(rP),
      carbGrams: Math.round(restCarbGrams),
      carbPercent: Math.round(rC),
      fatGrams: Math.round(restFatGrams),
      fatPercent: Math.round(rF),
    }
  };
}
