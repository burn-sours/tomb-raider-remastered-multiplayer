# AI / Reverse-Engineering Master Reference

> **Purpose:** the single reference for how our mod's *friendly names* connect to the
> reverse-engineered Tomb Raider Remastered binaries in Ghidra, and how we use Ghidra
> (via the Ghidra MCP) to add support for new game builds/patches.
>
> Read this first when picking the RE work back up. It documents the whole loop:
> **refactor binary in Ghidra → export names+addresses → drop them into a patch file →
> the mod resolves them at runtime with Frida.**

---

## 1. The big picture (two worlds, one contract)

There are two sides that must agree on a shared vocabulary of **friendly names**
(`RenderLara`, `MainPlayerEntity`, `LoadedLevel`, …):

```
   GHIDRA WORLD                                MOD CODEBASE WORLD
   (per binary, per build)                     (build-agnostic)

   tomb1.dll (refactored)                      patches/<patch>/tr1.js
   ┌───────────────────────────┐   names +     ┌──────────────────────────┐
   │ RenderLara   @ 18000fc10   │   addresses   │ hooks: { RenderLara: {   │
   │ LoadedLevel  @ 180016db0   │  ──────────▶  │   Address:"0xfc10", ...} │
   │ Lara (data)  @ 1803389f0   │               │ variables: { MainPlayer  │
   │ ...                        │               │   Entity:{Address:"0x338 │
   └───────────────────────────┘               │   9f0",Type:"Int64"} ... }│
                                                └──────────────────────────┘
                                                            │
                                                            ▼  (runtime)
                                                   Frida reads/writes/hooks
                                                   moduleBase + RVA
```

* **Ghidra** holds the *knowledge* (what each function/global is, discovered by RE).
* **The patch file** is the *portable export* of that knowledge: friendly name → RVA
  (+ type / params / return). The mod code only ever references friendly names, so the
  game logic stays clean and never hard-codes an address.
* Adding support for a new build = producing a new patch file with the **same friendly
  names** pointing at that build's addresses.

---

## 2. Games, modules, builds, patches (the four axes)

The mod supports several **game bundles**, each a launcher `.exe` hosting three per-game DLLs:

| Bundle id | Executable   | Modules (DLLs)                | Games                     |
|-----------|--------------|-------------------------------|---------------------------|
| `trr-123` | `tomb123.exe`| `tomb1.dll` `tomb2.dll` `tomb3.dll` | TR I, II, III (Remastered) |
| `trr-45`  | `tomb456.exe`| `tomb4.dll` `tomb5.dll` (+…)  | TR IV, V (Remastered)     |
| `trr-6`   | (AoD)        | `tomb6.dll`                   | TR VI: Angel of Darkness  |

Defined in `client/games/<bundle>/manifest.js`. The executable is the shared host/launcher;
**the per-game DLLs hold the actual game logic** — that's where nearly all RE work happens.

For each bundle there are multiple **patches** (game updates) and multiple **store builds**
(Steam / Epic / GOG). Every distinct binary = its own address map. In the manifest, each
patch entry carries:
* `name` — human label / release date
* `patch` — **sha256 of the executable** (the fingerprint used to auto-select the map at runtime)
* `memory` — the per-module address maps (`require()`d patch files)

We are **Steam-first**: Steam builds are fully mapped. The goal is to expand to *every*
build (Epic, GOG, …) by porting the Steam maps.

---

## 3. Anatomy of a patch file

Location: `client/games/<bundle>/patches/<patch-id>/{executable,tr1,tr2,tr3}.js`.
Each exports one object per module with two main sections plus optional module-specific data.

```js
module.exports = {
    variables: {                         // === DATA / globals ===
        BinaryTick: { Address: "0x1211d8", Type: "Int8" },
        MainPlayerEntity: { Address: "0x3389f0", Type: "Int64" },
        LaraCircleShadow: {              // pointer-chased block:
            Address: "0x3389f0", Type: "Block",
            Pointer: "0xe20",            //   deref [base+Address], then + Pointer
            Size: "0x30",                //   read Size bytes
        },
        // shorthand form (bare string = raw RVA, no type):
        OgModelsFace: "0x338918",
    },
    hooks: {                             // === FUNCTIONS ===
        RenderLara: {
            Address: "0xfc10",           // RVA into the module
            Params: ['pointer','pointer','pointer','pointer'],
            Return: 'void',
            Disable: true                // true = full replace; false/absent = attach around
        },
        LoadedLevel: { Address:"0x16db0", Params:['int','pointer','pointer','pointer'], Return:'pointer' },
    },
    // optional per-module extras: uiLayer, ogGunMap, sounds, challengeOutfits, ...
};
```

### Address convention — **RVAs, not VAs**
* Addresses in the patch file are **RVAs** (offset from the module's image base).
* Ghidra shows **virtual addresses** = image base + RVA.
  * DLL image base = `0x180000000` → Ghidra `18000fc10` == patch RVA `0xfc10`.
  * EXE image base = `0x140000000` → subtract `0x140000000` to get the patch RVA.
* **Conversion:** `patch RVA = Ghidra address − image base`. Hex casing is irrelevant
  (`0x2C58A0` and `0x2c58a0` both parse).

### `Type` values (data)
`Int8/16/32/64`, `UInt8/16/32/64`, `Float`, `Double`, `Pointer`, and `Block`
(raw byte region; use with `Size`, optionally `Pointer` for one deref hop).

### `Params` / `Return` values (functions)
Frida NativeFunction type strings: `'void'`, `'int'`, `'uint'`, `'int64'`, `'uint64'`,
`'pointer'`, etc. `Disable:true` means we *replace* the function; otherwise we *attach*
(before/after) around the original.

---

## 4. Runtime resolution flow (how the mod uses a patch file)

`client/baseClient.js` → `client/games/game-core.js`:

1. **Fingerprint the build.** `crypto.createHash('sha256')` of the running executable
   (`baseClient.js:121`).
2. **Select the map.** `getPatchByHash(hash)` matches the sha against `manifest.patches[*].patch`.
   Falls back to `getPatchById(manualPatch)` if the hash is unknown
   (`baseClient.js:52,125`). Result's `.memory` becomes `this.memoryAddresses`.
3. **Inject into the game script.** `memoryAddresses` is `JSON.stringify`'d into the Frida
   script template (`trr-123/game.js:7`) and paired with the shared engine in
   `game-core.js`.
4. **Locate modules at runtime.** `setupGame()` waits for each module, records its live
   `moduleObj.base` into `moduleBaseAddresses[module]` (`game-core.js:419-428`).
5. **Resolve on demand.**
   * `resolveMemoryAddress(base, rva, pointer?)` = `base + rva`, with one optional
     pointer-deref hop (`game-core.js:224`).
   * `readMemoryVariable / writeMemoryVariable / getMemoryVariable` look the friendly name
     up in `variables{}` and resolve it (`game-core.js:283-330`).
   * `registerFunction` / `hookFunction` build `NativeFunction`s / `Interceptor` hooks from
     `hooks{}` at `moduleBase.add(fn.Address)` (`game-core.js:332-417`).

**Consequence for RE:** the only thing that changes between builds is the RVA (and
occasionally params/type). Friendly names and the entire mod logic stay identical — which
is exactly why porting is "just" re-finding addresses.

---

## 5. The Ghidra side — naming conventions & how names map back

Ghidra MCP is reached over TCP (`http://127.0.0.1:8089`). At time of writing **8 programs**
are open: the Steam set and the Epic set, each `tomb123.exe` + `tomb1/2/3.dll`.

> ⚠️ **Two programs share each name** (Steam & Epic both have `tomb1.dll`). Tool calls that
> omit `program` silently hit the *current* program. **Always pass `program` explicitly** —
> either the bare name for the current (Steam) set, or the full path for Epic
> (`/TRR Patch 5.2 Epic Games/tomb1.dll`). Use `list_open_programs` to see exact paths.

### Functions ↔ `hooks{}` — clean 1:1 **on the reference build only**
On the **fully-RE'd reference build** (Steam), refactored function names in Ghidra **equal**
the patch `hooks` keys, e.g. `get_function_by_address(0x18000fc10)` → `RenderLara` == patch
`RenderLara: 0xfc10`. That makes the reference side a name lookup.
**A fresh target build (Epic/GOG) has NO names — everything is `FUN_…`.** There you don't
look names up, you *match structure* Steam→target (see §7). Don't assume the reference build
you're pointed at is refactored; confirm with a name search first.

### Data/globals ↔ `variables{}` — **same-or-similar, NOT guaranteed identical**
Global labels in Ghidra are named but the label text can differ from the patch friendly name:

| Patch `variables` name | Ghidra label at that address |
|------------------------|------------------------------|
| `MainPlayerEntity` @ `0x3389f0` | `Lara` @ `1803389f0` |
| `LaraId` @ `0x338840`           | `laraEntityId` @ `180338840` |
| `LaraGunType` @ `0x338842`      | (near `laraGunEquipped` @ `180338844`) |

**Implication:** data cannot be ported by name alone. Anchor data by **address + xref +
struct-offset reasoning** (which function touches it, at what offset from a known base),
not by matching the label string.

---

## 6. Listing the refactored funcs/dats we actually use

There are two complementary "lists":

**A. The authoritative list of what the mod needs** = the keys in the Steam patch files.
This is small and finite (per `trr-123` patch5.2):

| Module        | `variables` + `hooks` entries (Typed) |
|---------------|----------------------------------------|
| `executable.js` (`tomb123.exe`) | 12 |
| `tr1.js` (`tomb1.dll`)          | 52 |
| `tr2.js` (`tomb2.dll`)          | 54 |
| `tr3.js` (`tomb3.dll`)          | 55 |

Regenerate the exact list any time with:
```bash
# every friendly name the mod references, per module
node -e "for (const m of ['executable','tr1','tr2','tr3']){const o=require('./client/games/trr-123/patches/patch5.2/'+m);console.log('==',m,'==');console.log('hooks:',Object.keys(o.hooks||{}).join(', '));console.log('vars :',Object.keys(o.variables||{}).join(', '));}"
```

**B. The refactored set in Ghidra** (superset — everything we've named while RE-ing).
* All functions: `list_functions_enhanced(program=...)` or `search_functions(program=..., name_pattern=...)`.
  The *refactored* ones are those **without** a default `FUN_xxxxxxxx` name.
  (Steam `tomb1.dll` = 1435 functions; the mod only hooks ~15 of them.)
* All named globals/data: `list_globals(program=..., filter=...)` or `list_data_items`.

The practical workflow is **B verifies A**: for each name in the patch file, confirm it
exists in Ghidra and grab its address. For the *export* step (adding a build) you invert it:
find each Steam friendly name's equivalent address in the target build, then write the RVA
into the (blank) target patch file.

---

## 7. Porting method — adding a new build (the proven recipe)

Porting = for every **named symbol** in the reference (Steam) build, find the **same**
function/global's address in the target build, verify it, and (a) write its RVA into the
target patch file *if the mod uses it* and (b) apply its name into the target Ghidra module.
The reference build is fully named; the target build is raw (`FUN_…`, unnamed data). Two
distinct techniques, both **verified per item** — never a guess.

### Scope: full parity, not just the patch subset
The patch file lists only the symbols the mod **currently** hooks/reads — a small subset.
The real goal is **map parity**: the target Ghidra module should end up with the *same set of
named functions and meaningful data globals* as the reference build, not just the patch ones.
Why: a future game update is ported by re-matching against the reference build; if a symbol
the next patch needs (e.g. `AimProjectileAtLara`) was never named in the target, it can't be
carried forward by name. So treat the work as **two tiers**:

| Tier | Source list | Goes in patch file? | Named in target Ghidra? |
|------|-------------|:-------------------:|:-----------------------:|
| 1 — mod symbols | keys in the reference patch file | ✅ yes (fill RVA) | ✅ yes |
| 2 — parity symbols | every *other* named func / main data global in the reference build | ❌ no (until the mod needs it) | ✅ yes |

Both tiers use the same match+verify techniques below. Tier 1 additionally fills the patch
scaffold; Tier 2 only refactors the target Ghidra DB so the two builds stay in parity.
Enumerate Tier 2 from the reference module: `list_functions_enhanced` (keep names not
matching `FUN_…`, drop thunks/externals) and `list_globals` / `list_data_items` (drop
default `DAT_/LAB_/…` names).

### Design principles (read these first)
* **Matching is read-only; refactoring the target is a separate serial pass.** The *match +
  verify* step only reads (fuzzy/diff/decompile/xref), so it's safe to run many matchers
  concurrently. But porting is not finished when the RVAs are found — **we also refactor the
  verified names back into the target Ghidra module** (see step "Refactor the target build"
  below) so the new build becomes a named reference for its *own* future patches, exactly
  like the reference build is today. Do those renames **serially** (one at a time, from the
  verified results) — concurrent renames race on Ghidra's shared "current program" state.
* **Verify every match; leave doubt blank.** A wrong address gets hooked into live game
  memory → crash/corruption. If a match isn't confirmed to the confidence bar below, write
  `"0x"` (the "not done" sentinel) and flag it for human review. A blank is safe; a wrong
  address is not.
* **No blanket offsets.** Shifts between builds are **non-uniform** — different functions and
  different data regions move by different amounts (observed: one function +0x40, one global
  region +0xf40, another +0x1000, `.rdata` +0x130, and even two different deltas *within one
  section* across a repack boundary). Resolve *each* entry independently.

### Technique A — functions (`hooks{}`): fuzzy-match → diff-confirm
1. `find_similar_functions_fuzzy(address=<reference VA>, source_program=<ref>,
   target_program=<target>, threshold=0.3, limit=8)`.
   **Use a LOW threshold (~0.3).** Builds genuinely differ — a real match often scores only
   ~0.7, so a high threshold (0.7+) returns *zero* and silently drops the correct answer.
2. Rank candidates by **score AND address proximity** (the true match usually has both the
   top score and an address near the reference — functions shift only slightly).
3. Confirm the top 1–3 with `diff_functions(program_a=<ref>, address_a=<ref VA>,
   program_b=<target>, address_b=<candidate VA>)`. A true match has:
   * `body_equal / instruction_count ≥ 0.9` (ideally ≥ 0.95),
   * `prologue_changed=false`, `epilogue_changed=false`,
   * only trivial diffs (e.g. a constant emitted as `LEA r,[x+0xf]` vs `MOV r,0xf`).
4. **Confidence:** high ≥ 0.95 · medium 0.85–0.95 · below 0.85 → blank + review.

### Technique B — data/globals (`variables{}`): anchor via a referencing function
Data can't be fuzzy-matched. Pin it through a function that touches it:
1. `get_xrefs_to(program=<ref>, address=<reference global VA>)` → referencing functions.
   Prefer one with a **real (non-`FUN_`) name** and few refs.
2. Match that referencing function to the target with Technique A (fuzzy + diff).
3. `decompile_function` **both** the reference and matched target function. They read
   line-for-line identical. Find where the reference decompile touches the target global
   (its Ghidra label, or `DAT_<refVA>` / a ref to the reference VA) and read the target
   global (`DAT_<targetVA>`) at the **same structural position** (same statement, same
   struct offset).
4. **Cross-check via a second referencing function.** Agree → high · single anchor → medium ·
   can't resolve → blank + review.
   > ⚠️ `get_xrefs_from` on a function *entry address* returns refs for that one instruction,
   > not the whole body. To see the globals a function reads, **decompile it** (or disassemble
   > the body) — don't rely on `get_xrefs_from` for body-level data references.

### Convert, fill, refactor, verify
5. `RVA = target VA − image base` (`0x180000000` DLLs, `0x140000000` exe); lowercase `0x…`.
6. Write RVAs into the target scaffold `patches/<patch-id>/<module>.js` (types/params are
   already copied from the reference — only `Address` changes). Blanks stay `"0x"`.
7. **Refactor the target build (serial pass).** Apply the verified friendly names back into
   the target Ghidra module so it becomes a named reference like the source:
   * functions → `rename_function` / `rename_function_by_address` (use the reference build's
     name, e.g. name the matched `FUN_…` as `RenderLara`),
   * globals → `create_label` / `rename_or_label` at the resolved address.
   Only write **verified** matches (skip blanks/low-confidence). Do this **one call at a
   time** (not concurrently), then `save_program` to persist. This is what lets the *next*
   patch on this store be ported against a named target instead of raw `FUN_`s.
8. **Final verification:** confirm the real target exe's sha256 matches the manifest
   fingerprint, then sanity-check a few reads/hooks in-game.

### Scaling it as a workflow — lessons from the first run
The recipe fans out, but a naïve "one agent per symbol" is wasteful at parity scale
(hundreds of functions). Measured on the first tomb1 run (85 symbols → 85 agents, ~3.8M
tokens, ~15 min): agents spent most tokens on overhead, not matching, because —

* **The Ghidra backend serializes heavy ops** (decompile/analysis go through one engine), so
  16-way agent concurrency does **not** give 16× throughput — matchers queue on the server.
  The win from more agents is capped; the cost of more agents (tool-loading, prompt
  boilerplate, re-deriving context per agent) is not. **Prefer fewer, batched agents.**
* **Data anchoring repeated the same decompiles.** Many globals share one referencing
  function; decompiling that pair once *per global* is pure waste. **Batch data by anchor
  function:** decompile each matched pair once and harvest *all* globals it touches.
* **Exact matches need no agent.** Identical functions hash-match (score 1.0, e.g. `Clone`,
  `AddText`). A bulk function-hash prepass auto-pairs them cheaply.

**Recommended pipeline for a full-parity module:**
1. **Bulk-hash prepass** (`get_bulk_function_hashes` on both builds, join on hash) → instantly
   pairs all *identical* functions. No agent per function.
2. **Batched fuzzy+diff** for the *remaining* (shifted) functions — ~10–20 functions per
   agent (Technique A), each returning `{name, target_rva, confidence, evidence}`.
3. **Batch-by-anchor data** — group globals by a shared referencing function; one agent per
   anchor decompiles the pair once and returns every global it resolves (Technique B).
4. Agents stay **read-only**; the **orchestrator** collects results, fills the patch file
   (Tier 1 only), then does the **serial refactor pass** (step 7) for *all* verified symbols
   (Tier 1 + Tier 2), then `save_program`.
* Low-confidence items come back blank; fill/repair by hand.
* Keep humans in the loop per module: run it, eyeball a confidence report + spot-check, then
  move on.

### Definition of done
Two conditions: **(1)** every symbol the mod uses has a **verified** target RVA in the patch
file — no `"0x"` blanks remain; **(2)** the target Ghidra module has **map parity** with the
reference — every named function + main data global from the reference is named in the target
and `save_program`'d. Then the build is supported *and* ready to port its next update by name.

---

## 8. Ghidra MCP quick reference (most-used calls)

| Need | Tool |
|------|------|
| Confirm connection / list open binaries | `list_instances`, `list_open_programs` |
| Program facts (base, counts, hash) | `get_metadata`, `get_current_program_info` |
| Find a function by name / list all | `search_functions`, `list_functions_enhanced` |
| Function at an address | `get_function_by_address` |
| Named globals / defined data | `list_globals`, `list_data_items` |
| Cross-references (anchor data) | `get_xrefs_to` (to a global) — *body* refs of a function come from `decompile_function`, **not** `get_xrefs_from` |
| Read decompiled/disassembled body | `decompile_function`, `disassemble_function` |
| **Cross-build matching (Technique A)** | `find_similar_functions_fuzzy` (**threshold ~0.3**), `diff_functions` (confirm); `get_function_hash` / `get_bulk_function_hashes` for exact dupes |
| Refactor names into target build *(required step 7 — do serially, verified only)* | `rename_function`, `rename_function_by_address`, `rename_or_label`, `create_label` |
| Persist the refactor | `save_program` (call after the serial rename pass) |

**Always pass `program`** (see the duplicate-name warning in §5). For porting, prefer the
**read-only** calls (match/diff/decompile/xref) and let the orchestrator do the file writes.

---

## 9. Gotchas / things that bite

* **Even the batches *inside one workflow* must run sequentially, not via `parallel()`.**
  The concurrency hazard is not only across separate workflows — two agent batches in the
  *same* globals workflow, both doing `get_xrefs_to(Steam,…)` then `get_xrefs_to(Target,…)`,
  race on the shared current-program: one batch's "Target" xref call silently returns **Steam**
  data. Observed live (GOG tomb456.exe): two parallel globals batches returned **contradictory
  deltas for globals 4 bytes apart** — batch 1 said `resWidth`/`ResolutionH`/`GameVersion`
  were `delta=0`, batch 2 said the same `.data` shifted `-0x21a0` (with `-0x2020` for the
  `0x17b` zone). Adjacent globals cannot have different deltas, so one batch was contaminated —
  batch 1, whose "target" evidence even cited a *Steam* address (`GetScreenHeight 14000a688`,
  the pre-shift VA). The tell is **internal contradiction**: sort results by address and any
  delta that breaks monotonicity against its neighbors is a wrong-program read. **Fix:** the
  workflow runs agents in a sequential `for … await agent()` loop (never `parallel()`); within
  a single agent, calls are already serialized so there is no race. Fuzzy-based *function*
  matching is program-explicit (source+target named per call) and tolerates parallelism, but
  xref/decompile-based *globals* resolution does not — keep globals sequential. Arbitrate any
  suspected contamination by decoding one anchor directly (e.g. read the getter's bytes and
  compute its rip-relative global) rather than trusting either batch.
* **NEVER run two Ghidra workflows/agents concurrently — serialize everything.** The MCP
  backend has a *single shared "current program"* state. Under concurrent requests, one
  agent's operation races against another's program switch and silently reads the **wrong
  module**. Observed live: parallel per-module workflows resolved tomb2 globals to *tomb1*
  addresses (both DLLs share image base `0x180000000`, so the bad data looks plausible and
  passes naive checks). It is **silent** for same-base modules (tomb1/2/3) and only *fails
  loudly* when bases differ (the exe at `0x140000000` — a misdirected write errors instead
  of mislabeling). Mitigations: (1) run exactly one Ghidra workflow at a time; (2) pass
  `program=` on every call; (3) **sanity-gate results** — a real cross-build shift is small
  (well under `0x8000`); a huge delta or a different-module-looking address means a wrong-
  program read, so reject and redo. Fuzzy matching is naturally robust (it names *both*
  source and target program per call); `get_xrefs_to`/`decompile`-based data anchoring is the
  vulnerable step.
* **Duplicate program names** across Steam/Epic → always specify `program` explicitly.
* **RVA vs VA** → the #1 arithmetic mistake. Patch files store RVAs; Ghidra shows VAs.
  Exe base `0x140000000`, DLL base `0x180000000`.
* **Data names diverge** from patch names — port data by address/xref, not label text.
* **Builds are near-identical but not byte-identical** (function counts differ slightly
  between stores). Never assume an address carries over; always re-match.
* **Fuzzy threshold is a trap.** A real cross-build match often scores only ~0.7; a high
  threshold returns *zero matches* and hides the answer. Search at ~0.3 and rank by
  score + address proximity, then confirm with `diff_functions`.
* **Verify a fuzzy match actually exists in the TARGET.** Observed live (GOG exe): an agent
  "confirmed" 7 functions at the *same rva as Steam* with score 1.0 — but the target had no
  function at those addresses; it had silently diffed Steam-to-Steam. Always `diff_functions`
  with `program_b` = the **target**, and `get_function_by_address(target, candidate)` to
  confirm a function starts there. A function match with `delta=0` (target rva == steam rva)
  in a build you *know* differs is a red flag — the real match is usually a small offset
  (e.g. `-0x10`).
* **Tiny functions are not fuzzy-matchable — anchor them via a caller.** A 5-instruction
  getter (`GetScreenWidth`, `return resWidth;`) fuzzy-matches *hundreds* of equally-scored
  candidates (observed: 296 hits all ~0.85), so the agent defaults to the same-address
  Steam-to-Steam self-match and reports a bogus `delta=0`. Resolve these structurally instead:
  `get_xrefs_to(Steam, getter)` → a caller that stores it in a **function-pointer table**;
  map that caller to the target; the target table lists the getters **in the same order**,
  bracketed by siblings you *can* verify (hash-matched neighbours). Observed live (GOG exe):
  the caller's table had `DAT…468=TickFunction(9f70)` and `DAT…4a0=UpdateTickRef(a0b0)` — both
  hash-verified at `-0x260` — bracketing `DAT…478=&LAB_a400`/`DAT…480=&LAB_a420`, giving
  `GetScreenWidth=0xa400`, `GetScreenHeight=0xa420` (both `-0x260`), not the workflow's `0x…660`.
* **Non-uniform shifts, and they track PE sections.** No single offset maps one build to
  another — code and each data region move by different amounts. `list_segments` on both
  builds shows *why*: e.g. if the target's `.rdata` grew, `.data`'s base slides by that much,
  so globals shift by the section delta — **plus** any internal repacking, which can create
  more than one shift zone *within* a single section (observed: `.data` globals near its start
  at one delta, later globals at a smaller delta after an internal size change). So per-section
  is a starting hypothesis, not a guarantee — still verify each global (xref-set correspondence
  is a cheap check: same referencing functions, matched, at the candidate address).
* **`get_xrefs_from(function entry)` ≠ the function's data refs.** It only covers one
  instruction. Decompile the function to see the globals it touches.
* **"Byte-identical at the same address" does NOT mean a global is unshifted.** A tempting
  shortcut — read the bytes at `steam_va` and `epic_va==steam_va`, see they match, conclude
  `delta=0` — is a **fallacy**: uninitialized `.data`/`.bss` is zero *everywhere* in *both*
  builds, so equal bytes prove nothing. Observed live: an agent mislabeled 14 tr3 globals as
  `delta=0` while their decompile-anchored neighbors clearly shifted `+0x1f40`. A `delta=0`
  result is almost always wrong — only accept it when a decompile/xref *explicitly* shows the
  same address referenced in the target. The monotonicity + per-region-uniform-shift gate
  catches this (a `delta=0` entry collides/reorders against its shifted siblings).
  A second way the same false-`delta=0` appears: an agent **decompiles the reference (Steam)
  program by mistake** and, because Steam *is* labelled, the decompile prints the global **by
  name** (`ogModelsOffset`) — the agent takes Steam's address as the answer. Tell: the target
  build isn't labelled yet, so *any* global shown by name in a "target" decompile means it's
  actually reading the reference. Guard the globals prompt: "the target has no labels; a
  named global in a target decompile means you queried the wrong program." Same gate catches
  it (collision/reorder vs shifted siblings).
* **The sha256 in the manifest is of the *executable***, but per-module RVAs come from the
  DLLs — a matching exe hash still requires each DLL mapped independently.
* **Blank `"0x"` is the "not done" sentinel** — grep for it to measure remaining work:
  `grep -rc 'Address: "0x"' client/games/<bundle>/patches/<patch-id>/`.

---

## Appendix — worked example (the reference pattern)

A concrete instance of each technique, to anchor the method (values are illustrative of the
*shape* of a good result, not a live inventory):

**Function (Technique A).** Reference `RenderLara` (VA `…fc10`):
`find_similar_functions_fuzzy(threshold=0.3)` → top hit `FUN_…fc50`, score ~0.69, adjacent
address. `diff_functions` → 191/193 body-equal, prologue/epilogue unchanged, sole diff a
constant emitted two ways ⇒ **confirmed same function**, target RVA `0xfc50`. Note it scored
only 0.69 and sat +0x40 away — exactly why you search low and confirm with a diff.

**Data (Technique B).** Reference global `MainPlayerEntity` (VA `…3389f0`, Ghidra label
`Lara`): `get_xrefs_to` → referenced by named `SenseLara`. Match `SenseLara` to the target
(fuzzy+diff), decompile both — identical line-for-line — and where the reference reads `Lara`
the target reads `DAT_…339930` at the same statement ⇒ target RVA `0x339930`. That global
shifted +0xf40 while `RenderLara` shifted +0x40: proof there is no blanket offset.
