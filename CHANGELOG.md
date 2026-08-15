# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-08-14

### Fixed

- Invalid type augmentation for `@supabase/postgrest-js` v2 (`TS2428: All declarations of 'PostgrestBuilder' must have identical type parameters`). The module augmentation now matches the real v2 class signature (`PostgrestBuilder<ClientOptions, Result, ThrowOnError>`), returns the awaited response type (`PostgrestSingleResponse` / `PostgrestResponseSuccess` with `throwOnError`) and types `error` as `NuxtError`.
- Removed the undocumented global patch of `Function.prototype` (prototype pollution affecting every function in the app).
- The runtime patch now covers **every** PostgREST builder (query, filter, transform, `single()`/`maybeSingle()`, `rpc()`, ...) by patching `PostgrestBuilder.prototype` with a non-enumerable, writable and configurable property, matching what the types declare.

### Changed

- **Breaking:** peer dependency `@supabase/postgrest-js` is now `^2.0.0` (v2 is what `@supabase/supabase-js` ships today). v1 is no longer supported.
- **Breaking:** `.asAsyncData()` is no longer available on bare functions; call it directly on query builders (`supabase.from('t').select().asAsyncData('key')`).
- Complete package metadata (license, author, repository, bugs, homepage, engines, `types`/`exports` map, `packageManager`).

### Added

- Test suite (Vitest) covering the prototype patch, all builder kinds, `useAsyncData` delegation and module metadata.
- CI workflow (Node 20/22) and release workflow (npm publish with provenance + GitHub release).
- TypeScript project config (`tsconfig.json`) for strict typechecking of `src` and `tests`.

## [1.0.0]

- Initial release.
