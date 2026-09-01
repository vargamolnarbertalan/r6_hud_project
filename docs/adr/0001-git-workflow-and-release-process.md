# ADR-0001: feat → develop → main with tagged all-in-one ZIP releases

- **Status:** Accepted
- **Date:** 2026-09-01
- **Deciders:** Bertalan Varga-Molnár, with analysis by Claude

## Context

The `2026_summer` branch was renamed to `main` and a `develop` branch was created from it,
adopting the same `feat → develop → main` model already in use on `chicken-dinner-feed`. Before
this, releases were built by hand: run `release.bat`, which zips a fixed file list including the
operator's live `.env` (real database credentials) into `_release/`, and copy that ZIP out
manually per season. This ADR replaces that with a tagged, CI-built release, and documents the
branching this repo now follows.

Two constraints make this different from a typical Node project and from `chicken-dinner-feed`
specifically:

- **`iohook` pins the Node version, both floor and ceiling.** Global hotkey capture uses a
  prebuilt native binary tied to one Node ABI. The one shipped with this dependency only has a
  build for Node 13.x (ABI 79) confirmed working; the README's documented range is Node 13–14.
  Node 15+ installs fine but the app crashes the instant `iohook` loads, because no prebuilt
  binary exists for a newer ABI. `chicken-dinner-feed`'s "at least this version" check does not
  apply here — this app needs a range, not a floor.
- **The app requires a live MySQL/MariaDB connection to be useful**, unlike `chicken-dinner-feed`
  which has no database. `misc/r6_hud.sql` is the schema an operator imports on first setup.
- **There is no build step.** Plain `server.js` + EJS views, no TypeScript, no bundler. "Assemble
  the bundle" means copying source files, not compiling them.

## Decision

### Branching

- `main` — release-ready only. Every commit on `main` is a tagged, releasable state. Protected.
- `develop` — integration branch. Feature work merges here first.
- `feat/*`, `fix/*`, `chore/*`, `docs/*` — short-lived, branched from `develop`, merged back by PR.
- `hotfix/*` — branched from `main` for urgent production fixes, merged to `main` **and** back into
  `develop`.

All merges go through pull requests. Direct pushes to `main` and `develop` are not used.

**The old season branches (`2025_autumn_season`, `master`, `mneb6_summer`, `mneb_S5_fall`,
`livebuild`, and the pre-rename `2026_summer`) are frozen historical snapshots, not part of this
workflow.** Each is strictly behind what became `main` — none has a commit `main` doesn't already
have — so none needs merging forward; they exist only as a record of what shipped for a given
event. New per-event work happens on `feat/*`/`chore/*` branches against `develop` instead of a
new long-lived season branch.

### Commits

**Conventional Commits.** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `build`,
with the workspace as an optional scope. Breaking changes use `!` and a `BREAKING CHANGE:`
footer.

### Versioning and releases

**Semantic versioning**, tagged `vMAJOR.MINOR.PATCH` on `main`. `package.json`'s `version` field
is the single source of truth. The app already has real broadcast history across several seasons,
so — following the same precedent `chicken-dinner-feed` set — versioning starts at **`v1.0.0`**
rather than `0.1.0`.

A release is **triggered manually by pushing a tag**, not automatically on merge — releasing
(and picking when the next event's build is cut) stays a deliberate decision.

The release workflow (`.github/workflows/release.yml`) produces an **all-in-one ZIP**:

- `server.js`, `views/`, `public/`, `package.json`, `package-lock.json`;
- `install_dependencies.bat`, `run.bat`, `env.template` (never `.env` — see below), `README.md`,
  `LICENSE`;
- `misc/r6_hud.sql` — the schema an operator needs for first setup (README installation step 5).
- **excluded**: `demo_tools/` (dev reference images and the Node installer — an operator fetches
  Node themselves, same principle as `chicken-dinner-feed` shipping no copy of Node), `gfx/`
  (design source PSDs, not runtime assets — the actual runtime images live under `public/img/`),
  `misc/hud_demo.json` and `misc/vmix_test.vmix` (demo/test fixtures), `PROJECT_ANALYSIS.md` and
  `docs/adr/` (internal, like `chicken-dinner-feed` excluding its own `docs/adr/`),
  `camlink_generator.md` (a personal-workflow note, not something the app needs), `node_modules`,
  `_release/`, `.git`, and — the fix this ADR exists to make permanent — **`.env`**.

The ZIP is attached to the GitHub release along with generated release notes and a SHA-256
checksum.

### The `.env`-in-the-ZIP problem

`release.bat` zips the operator's actual `.env` — live database host, user, and password — into
every release archive it produces. Anyone who received or found a past ZIP had the real database
credentials. The CI release workflow ships `env.template` instead, exactly as
`chicken-dinner-feed` ships `.env.example`: an operator copies it to `.env` and fills in their own
values after unpacking. `run.bat` now refuses to start without a `.env` present, so this can't
silently regress into "the app just uses whatever's baked in."

## Consequences

### Positive

- Matches the model already adopted on `chicken-dinner-feed` — one mental model across both
  projects.
- A manual tag trigger means no accidental release mid-event.
- Conventional commits give a changelog for free later, if one is wanted.
- The ZIP can no longer contain live credentials by construction, not by remembering to check.

### Negative / costs accepted

- PRs on a single-developer project are ceremony, same trade-off `chicken-dinner-feed` already
  accepted — and the only place a diff actually gets reviewed, so they stay.
- The Node version range (13–14 only) is a real constraint on CI: the release workflow must pin an
  old Node version and run on Windows (native `iohook` binary), not the "any current LTS on Linux"
  setup a typical Node project's CI would use.
- No automated test suite exists, and the release workflow does **not** boot the app: `/readiness-scan`
  — the only route worth polling — queries the database itself, so without a live MySQL it can only
  time out, not prove anything, and Windows runners don't support service containers to fake one
  cheaply. "Does it actually start" stays a manual check against a real database as part of
  development (see README), not something CI pretends to verify with a throwaway DB.

## Hardened 2026-09-01 — the git history itself had a leaked database credential

Auditing history before writing this ADR found two things, both already remediated:

- **A live `.env` (real external database host, user, and password) was committed** — added
  2023-04-19, updated 2023-10-15 with a real external hostname, deleted 2024-06-26 — and, because
  git history keeps deleted blobs, was still fully retrievable from every branch that had ever
  contained those commits.
- **An earlier hardcoded database credential lived directly in `server.js`** (2022-03-21 to
  2023-04-19, replaced the same day `.env` was introduced).

The repository is private with no forks and no pull requests, so exposure was limited to
whoever had collaborator access, not the public internet — but both credentials were confirmed
different from the current live `.env` password, and history was rewritten regardless
(`git filter-repo`, stripping `.env` from every commit and redacting the old hardcoded string),
then force-pushed to `main` and `develop`. Rotating the live database password is a prerequisite
this ADR assumes was done alongside the purge, not a substitute for it — a purge without rotation
only hides an otherwise still-valid credential.

**Any local clone holding the old season branches (`2025_autumn_season`, `master`,
`mneb6_summer`, `mneb_S5_fall`, `livebuild`, pre-rename `2026_summer`) still has the pre-purge
history with the leaked credential in its own `.git` objects.** These are safe to keep locally for
reference, but must never be pushed to `origin` again — doing so would re-introduce the purged
commits. Delete them locally once confirmed unneeded, or at minimum treat them as read-only.

## Revisit when

- More than one developer works on this repo regularly, which may justify revisiting branch
  strategy.
- `iohook` is replaced or updated with a build that supports current Node — the version-range
  check in `install_dependencies.bat` and the pinned CI Node version would both need updating
  together.
