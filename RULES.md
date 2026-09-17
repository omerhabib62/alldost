# Project rules

1. **NEVER add Claude attribution.** No `Co-Authored-By: Claude` trailer on any commit, and no "Generated with Claude Code" footer or other Claude attribution in PR titles or descriptions. Hard rule.
2. Never commit directly to `master`. Branch, then open a PR.
3. No invented numbers. Every figure in a commit message, report or document comes from a command that actually ran.
4. No secrets in code, logs or transcripts. `EXPO_PUBLIC_*` values ship to the client.
5. Schema truth is `../fitness/supabase/migrations`. Where the live database differs, say so explicitly — never silently trust one over the other.
6. Reproduce before fixing. Show the failing case first.
7. Run `graphify update .` after code changes. The graph has no edges for cache invalidation, so do not use it to reason about data flow.
8. Stay in the scope you were given. Do not scaffold or refactor beyond the ticket.
