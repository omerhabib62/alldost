import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useSession } from '@/hooks/useSession';
import { useProfile, useSaveProfile, type ProfileInput } from '@/hooks/useProfile';
import { advisorCalculate } from '@/lib/goalAdvisor';

/**
 * Onboarding steps 1–3 — native port of the fitness web /onboarding page:
 * bio → goal & activity → calorie/macro targets, then one upsert into
 * profiles (clears needs_onboarding). Validation mirrors the web
 * ProfileInputSchema. Sports + Crew screens follow but save nothing yet.
 */

type Gender = ProfileInput['gender'];
type Goal = ProfileInput['goal'];
type Units = ProfileInput['units'];

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: 'fat_loss', label: '🔥 Fat Loss', desc: 'Focus on fat reduction & high protein.' },
  { value: 'recomp', label: '⚡ Body Recomp', desc: 'Lose fat & build muscle concurrently.' },
  { value: 'bulk', label: '💪 Muscle Bulk', desc: 'Maximize lean mass with caloric surplus.' },
];

const ACTIVITY_LEVELS = [
  { value: 1.2, label: '🛋️ Sedentary (no formal exercise / desk job)' },
  { value: 1.375, label: '🚶 Lightly Active (1-3 gym sessions / week)' },
  { value: 1.55, label: '🏃 Moderately Active (3-5 intense workouts / week)' },
  { value: 1.725, label: '🏋️ Very Active (6-7 heavy gym sessions / week)' },
  { value: 1.9, label: '⚡ Elite Athlete / Extreme Physical Labor' },
];

const SAVE_TIMEOUT_MS = 15_000;

function isoFromParts(day: string, month: string, year: string): string | null {
  const d = Number(day), m = Number(month), y = Number(year);
  if (!d || !m || !y || year.length !== 4) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function ageFromIso(iso: string | null): number {
  if (!iso) return 25;
  const [y, m, d] = iso.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
  return age;
}

export default function OnboardingProfileScreen() {
  const router = useRouter();
  const { session } = useSession();
  const { data: existing } = useProfile();
  const saveProfile = useSaveProfile();
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [units, setUnits] = useState<Units>('metric');
  const [heightCmInput, setHeightCmInput] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [targetWeightInput, setTargetWeightInput] = useState('');

  // Step 2
  const [goal, setGoal] = useState<Goal>('fat_loss');
  const [activityLevel, setActivityLevel] = useState(1.375);

  // Step 3
  const [dailyCalTarget, setDailyCalTarget] = useState('1700');
  const [macroP, setMacroP] = useState(30);
  const [macroC, setMacroC] = useState(35);
  const [macroF, setMacroF] = useState(35);
  const [proteinActive, setProteinActive] = useState('120');
  const [proteinRest, setProteinRest] = useState('90');

  // Prefill once: existing profile (admin reset → redo) or the auth email.
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || !session) return;
    if (existing === undefined) return; // still loading
    prefilled.current = true;
    if (!existing) {
      setName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '');
      return;
    }
    setName(existing.name ?? '');
    if (existing.gender) setGender(existing.gender as Gender);
    if (existing.dob) {
      const [y, m, d] = existing.dob.split('-');
      setDobYear(y); setDobMonth(String(Number(m))); setDobDay(String(Number(d)));
    }
    if (existing.height_cm) setHeightCmInput(String(existing.height_cm));
    if (existing.start_weight) setWeightInput(String(existing.start_weight));
    if (existing.target_weight) setTargetWeightInput(String(existing.target_weight));
    if (existing.goal) setGoal(existing.goal);
    if (existing.activity_level) setActivityLevel(Number(existing.activity_level));
  }, [existing, session]);

  const dobIso = isoFromParts(dobDay, dobMonth, dobYear);
  const age = ageFromIso(dobIso);

  const heightCm = units === 'metric'
    ? Number(heightCmInput) || 170
    : Math.round(((Number(heightFt) || 5) * 12 + (Number(heightIn) || 0)) * 2.54);
  const weightKg = units === 'metric'
    ? Number(weightInput) || 75
    : Math.round((Number(weightInput) || 165) * 0.45359237);
  const targetWeightKg = units === 'metric'
    ? Number(targetWeightInput) || 70
    : Math.round((Number(targetWeightInput) || 154) * 0.45359237);

  const { bmr, tdee, recCalories } = advisorCalculate({
    weightKg,
    heightCm,
    ageYears: Math.max(12, age),
    gender: gender === 'female' ? 'female' : 'male', // Harris-Benedict is binary
    activityLevel,
    goal,
  });

  const applyRecommendedDefaults = () => {
    setDailyCalTarget(String(recCalories));
    if (goal === 'fat_loss') { setMacroP(30); setMacroC(35); setMacroF(35); }
    else if (goal === 'recomp') { setMacroP(30); setMacroC(40); setMacroF(30); }
    else { setMacroP(25); setMacroC(50); setMacroF(25); }
    setProteinActive(String(Math.round(weightKg * 1.6)));
    setProteinRest(String(Math.round(weightKg * 1.2)));
  };

  // Recommended defaults only on the first entry to step 3, so Back →
  // Continue doesn't clobber manual edits (same guard as web).
  const step3Initialized = useRef(false);
  useEffect(() => {
    if (step === 3 && !step3Initialized.current) {
      step3Initialized.current = true;
      applyRecommendedDefaults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Keep P + C + F at exactly 100: moving one rebalances the other two
  // proportionally, each clamped to [5, 80]. Same algorithm as web.
  const setMacroBalanced = (which: 'p' | 'c' | 'f', rawValue: number) => {
    const newVal = Math.max(5, Math.min(80, Math.round(rawValue)));
    const current = { p: macroP, c: macroC, f: macroF };
    const target = 100 - newVal;
    const [k1, k2] = (['p', 'c', 'f'] as const).filter((k) => k !== which);
    const otherSum = current[k1] + current[k2];
    let v1 = otherSum > 0 ? Math.round(target * (current[k1] / otherSum)) : Math.round(target / 2);
    let v2 = target - v1;
    if (v1 < 5) { v1 = 5; v2 = target - v1; }
    if (v2 < 5) { v2 = 5; v1 = target - v2; }
    if (v1 > 80) { v1 = 80; v2 = target - v1; }
    if (v2 > 80) { v2 = 80; v1 = target - v2; }
    const setters = { p: setMacroP, c: setMacroC, f: setMacroF };
    setters[which](newVal);
    setters[k1](v1);
    setters[k2](v2);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const goToStep = (next: number) => {
    setErrorMsg(null);
    setStep(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const validateStep1 = (): string | null => {
    if (!name.trim()) return 'Please enter your profile name.';
    if (name.trim().length > 80) return 'Name must be 80 characters or fewer.';
    if (!dobIso) return 'Please enter a valid date of birth (day, month, 4-digit year).';
    if (age < 12 || age > 120) return 'Age must be between 12 and 120 years.';
    if (units === 'metric' ? !heightCmInput : !heightFt) return 'Please enter your height.';
    if (!weightInput || !targetWeightInput) return 'Please enter your start and target weight.';
    if (heightCm < 50 || heightCm > 250) return 'Height must be between 50 and 250 cm.';
    if (weightKg < 20 || weightKg > 300 || targetWeightKg < 20 || targetWeightKg > 300) {
      return 'Weights must be between 20 and 300 kg.';
    }
    return null;
  };

  const onNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) return showError(err);
    }
    goToStep(step + 1);
  };

  const onSave = async () => {
    setErrorMsg(null);
    const cal = Number(dailyCalTarget);
    const pActive = Number(proteinActive);
    const pRest = Number(proteinRest);
    if (macroP + macroC + macroF !== 100) return showError(`Macro split must add up to 100% (currently ${macroP + macroC + macroF}%).`);
    if (!cal || cal < 800 || cal > 6000) return showError('Daily calories must be between 800 and 6000 kcal.');
    if (!pActive || pActive < 20 || pActive > 400 || !pRest || pRest < 20 || pRest > 400) {
      return showError('Protein targets must be between 20 and 400 g.');
    }
    if (submitting) return;

    const payload: ProfileInput = {
      name: name.trim(),
      dob: dobIso!,
      gender,
      height_cm: heightCm,
      start_weight: weightKg,
      target_weight: targetWeightKg,
      daily_cal_target: cal,
      protein_active: pActive,
      protein_rest: pRest,
      macro_p_pct: macroP,
      macro_c_pct: macroC,
      macro_f_pct: macroF,
      goal,
      activity_level: activityLevel,
      units,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi',
    };

    setSubmitting(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        saveProfile.mutateAsync(payload),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('Saving timed out. Check your internet and try again.')),
            SAVE_TIMEOUT_MS,
          );
        }),
      ]);
      router.replace('/(onboarding)/sports');
    } catch (err: any) {
      showError(err?.message || 'Failed to save your profile. Please try again.');
    } finally {
      clearTimeout(timer);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="px-6 pt-10 pb-8 gap-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-muted-foreground uppercase tracking-[2px]">Step {step} of 3</Text>
              <View className="flex-row gap-1.5">
                {[1, 2, 3].map((s) => (
                  <View key={s} className={`w-8 h-1.5 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </View>
            </View>
            <Text className="text-[28px] leading-[36px] font-black text-foreground">
              {step === 1 ? 'Tell us about you' : step === 2 ? 'Goal & activity' : 'Your daily targets'}
            </Text>
          </View>

          {errorMsg && (
            <View className="bg-red-50 border border-red-200 rounded-xl p-4">
              <Text className="text-sm font-semibold text-red-800">{errorMsg}</Text>
            </View>
          )}

          {step === 1 && (
            <View className="gap-4">
              <Segmented
                options={[{ value: 'metric', label: 'Metric (cm / kg)' }, { value: 'imperial', label: 'Imperial (ft-in / lbs)' }]}
                value={units}
                onChange={(u) => {
                  setUnits(u as Units);
                  setHeightCmInput(''); setHeightFt(''); setHeightIn('');
                  setWeightInput(''); setTargetWeightInput('');
                }}
              />

              <Field label="Full name">
                <Input value={name} onChangeText={setName} placeholder="e.g. Omer Bin Habib" maxLength={80} />
              </Field>

              <Field label="Gender">
                <View className="flex-row flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <Chip key={g.value} label={g.label} active={gender === g.value} onPress={() => setGender(g.value)} />
                  ))}
                </View>
              </Field>

              <Field label="Date of birth">
                <View className="flex-row gap-2">
                  <Input className="flex-1" value={dobDay} onChangeText={setDobDay} placeholder="DD" keyboardType="number-pad" maxLength={2} />
                  <Input className="flex-1" value={dobMonth} onChangeText={setDobMonth} placeholder="MM" keyboardType="number-pad" maxLength={2} />
                  <Input className="flex-[2]" value={dobYear} onChangeText={setDobYear} placeholder="YYYY" keyboardType="number-pad" maxLength={4} />
                </View>
              </Field>

              {units === 'metric' ? (
                <Field label="Height (cm)">
                  <Input value={heightCmInput} onChangeText={setHeightCmInput} placeholder="e.g. 175" keyboardType="decimal-pad" />
                </Field>
              ) : (
                <Field label="Height (ft / in)">
                  <View className="flex-row gap-2">
                    <Input className="flex-1" value={heightFt} onChangeText={setHeightFt} placeholder="ft" keyboardType="number-pad" maxLength={1} />
                    <Input className="flex-1" value={heightIn} onChangeText={setHeightIn} placeholder="in" keyboardType="number-pad" maxLength={2} />
                  </View>
                </Field>
              )}

              <View className="flex-row gap-3">
                <Field label={`Start weight (${units === 'metric' ? 'kg' : 'lbs'})`} className="flex-1">
                  <Input value={weightInput} onChangeText={setWeightInput} placeholder={units === 'metric' ? '80.0' : '176.0'} keyboardType="decimal-pad" />
                </Field>
                <Field label={`Target weight (${units === 'metric' ? 'kg' : 'lbs'})`} className="flex-1">
                  <Input value={targetWeightInput} onChangeText={setTargetWeightInput} placeholder={units === 'metric' ? '75.0' : '165.0'} keyboardType="decimal-pad" />
                </Field>
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="gap-5">
              <Field label="Primary objective">
                <View className="gap-2">
                  {GOALS.map((g) => (
                    <Pressable
                      key={g.value}
                      onPress={() => setGoal(g.value)}
                      className={`p-4 rounded-2xl border-[1.5px] ${goal === g.value ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
                    >
                      <Text className={`text-sm font-black ${goal === g.value ? 'text-primary' : 'text-foreground'}`}>{g.label}</Text>
                      <Text className="text-xs text-muted-foreground mt-1">{g.desc}</Text>
                    </Pressable>
                  ))}
                </View>
              </Field>

              <Field label="Current activity level">
                <View className="gap-2">
                  {ACTIVITY_LEVELS.map((a) => (
                    <Pressable
                      key={a.value}
                      onPress={() => setActivityLevel(a.value)}
                      className={`p-3.5 rounded-2xl border-[1.5px] flex-row items-center justify-between gap-2 ${
                        activityLevel === a.value ? 'border-primary bg-primary/5' : 'border-border bg-card'
                      }`}
                    >
                      <Text className={`flex-1 text-xs font-bold ${activityLevel === a.value ? 'text-primary' : 'text-foreground'}`}>{a.label}</Text>
                      <Text className="text-[10px] font-black text-muted-foreground">x{a.value}</Text>
                    </Pressable>
                  ))}
                </View>
              </Field>
            </View>
          )}

          {step === 3 && (
            <View className="gap-5">
              <View className="flex-row gap-3">
                <StatBox label="🔥 BMR" value={`${bmr} kcal`} />
                <StatBox label="⚡ TDEE" value={`${tdee} kcal`} />
              </View>

              <Pressable onPress={applyRecommendedDefaults} className="self-end">
                <Text className="text-[11px] font-black uppercase tracking-wide text-primary underline">Reset to recommended</Text>
              </Pressable>

              <Field label="Daily calorie target (kcal)">
                <Input value={dailyCalTarget} onChangeText={setDailyCalTarget} keyboardType="number-pad" maxLength={4} />
              </Field>

              <View className="bg-card border border-border rounded-2xl p-4 gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] font-black uppercase text-foreground">Macro split</Text>
                  <Text className="text-[11px] font-black text-primary">{macroP + macroC + macroF}%</Text>
                </View>
                <MacroStepper label="🥩 Protein" value={macroP} onChange={(v) => setMacroBalanced('p', v)} />
                <MacroStepper label="🌾 Carbs" value={macroC} onChange={(v) => setMacroBalanced('c', v)} />
                <MacroStepper label="🥑 Fats" value={macroF} onChange={(v) => setMacroBalanced('f', v)} />
              </View>

              <View className="flex-row gap-3">
                <Field label="Gym day protein (g)" className="flex-1">
                  <Input value={proteinActive} onChangeText={setProteinActive} keyboardType="number-pad" maxLength={3} />
                </Field>
                <Field label="Rest day protein (g)" className="flex-1">
                  <Input value={proteinRest} onChangeText={setProteinRest} keyboardType="number-pad" maxLength={3} />
                </Field>
              </View>
            </View>
          )}

          <View className="flex-row gap-3 mt-2">
            {step > 1 && (
              <Pressable onPress={() => goToStep(step - 1)} className="flex-1 border border-border bg-card rounded-xl py-4 items-center">
                <Text className="text-sm font-extrabold text-foreground">Back</Text>
              </Pressable>
            )}
            {step < 3 ? (
              <Pressable onPress={onNext} className="flex-[2] bg-slate-900 rounded-xl py-4 items-center">
                <Text className="text-sm font-extrabold text-white">Continue</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={onSave}
                disabled={submitting}
                className={`flex-[2] bg-slate-900 rounded-xl py-4 items-center ${submitting ? 'opacity-50' : ''}`}
              >
                <Text className="text-sm font-extrabold text-white">{submitting ? 'Saving…' : 'Save & continue'}</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <View className={`gap-1.5 ${className ?? ''}`}>
      <Text className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">{label}</Text>
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput> & { className?: string }) {
  const { className, ...rest } = props;
  return (
    <TextInput
      placeholderTextColor="#9ca3af"
      className={`border border-gray-200 rounded-xl px-4 py-2.5 text-[15px] text-gray-900 bg-gray-50 ${className ?? ''}`}
      {...rest}
    />
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3.5 py-2 rounded-full border-[1.5px] ${active ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
    >
      <Text className={`text-xs font-bold ${active ? 'text-primary' : 'text-foreground'}`}>{label}</Text>
    </Pressable>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="flex-row bg-muted p-1 rounded-2xl border border-border">
      {options.map((o) => (
        <Pressable
          key={o.value}
          onPress={() => onChange(o.value)}
          className={`flex-1 py-2.5 rounded-xl items-center ${value === o.value ? 'bg-card' : ''}`}
        >
          <Text className={`text-xs font-black ${value === o.value ? 'text-primary' : 'text-muted-foreground'}`}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 bg-card border border-border rounded-2xl p-3 items-center">
      <Text className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">{label}</Text>
      <Text className="text-base font-black text-foreground mt-1">{value}</Text>
    </View>
  );
}

function MacroStepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm font-bold text-foreground">{label}</Text>
      <View className="flex-row items-center gap-3">
        <Pressable onPress={() => onChange(value - 5)} hitSlop={8} className="w-9 h-9 rounded-full bg-muted items-center justify-center">
          <Text className="text-lg font-black text-foreground">−</Text>
        </Pressable>
        <Text className="w-12 text-center text-sm font-black text-foreground">{value}%</Text>
        <Pressable onPress={() => onChange(value + 5)} hitSlop={8} className="w-9 h-9 rounded-full bg-muted items-center justify-center">
          <Text className="text-lg font-black text-foreground">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
