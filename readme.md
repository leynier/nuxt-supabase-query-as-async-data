# Nuxt Supabase Query As AsyncData

A Nuxt module that enhances developer experience when using Supabase by enabling fluent queries (e.g., `supabase.from(...).select(...)`) to integrate directly with `useAsyncData()` via a convenient `.asAsyncData()` method—no manual wrapping required.

[![CI](https://github.com/leynier/nuxt-supabase-query-as-async-data/actions/workflows/ci.yml/badge.svg)](https://github.com/leynier/nuxt-supabase-query-as-async-data/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/nuxt-supabase-query-as-async-data.svg)](https://www.npmjs.com/package/nuxt-supabase-query-as-async-data)
[![license](https://img.shields.io/npm/l/nuxt-supabase-query-as-async-data.svg)](https://github.com/leynier/nuxt-supabase-query-as-async-data/blob/main/license)

---

## 🧭 Introduction

`nuxt-supabase-query-as-async-data` lets you fluently convert Supabase query chains into Nuxt's `useAsyncData()` calls by appending `.asAsyncData(key)`. This simplifies server-side rendering and data fetching with minimal boilerplate.

## 🚀 Features

- Adds `.asAsyncData()` to every Supabase query builder (`select`, filters, transforms, `single()`, `maybeSingle()`, `rpc()`, ...)
- Wraps seamlessly with `useAsyncData()`
- Zero-config plugin—no imports needed
- Full TypeScript support and IntelliSense

## 📦 Installation

```bash
# Using npm
npm install nuxt-supabase-query-as-async-data

# Using yarn
yarn add nuxt-supabase-query-as-async-data

# Using pnpm
pnpm add nuxt-supabase-query-as-async-data
```

### 📦 Peer Dependency

This module requires `@supabase/postgrest-js` `^2.0.0`. If you're already using:

- `@supabase/supabase-js` v2+, or
- the `@nuxtjs/supabase` module,

...you're good to go. Otherwise, install it manually:

```bash
npm install @supabase/postgrest-js
```

## 🧩 Usage

Register the module in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-supabase-query-as-async-data'
  ]
})
```

Once installed, Supabase queries gain the `.asAsyncData()` method automatically:

```ts
const { data, status, error, refresh } = await supabase
  .from('users')
  .select('*')
  .asAsyncData('users-query')
```

### API

```ts
builder.asAsyncData(key: string, options?: AsyncDataOptions)
```

- `key` — unique key passed to `useAsyncData(key, ...)`.
- `options` — standard [`useAsyncData` options](https://nuxt.com/docs/api/composables/use-async-data#options) (`server`, `lazy`, `default`, `watch`, `transform`, `pick`, `dedupe`, `timeout`, ...).

Returns the same [`AsyncData`](https://nuxt.com/docs/api/composables/use-async-data#return-values) object as `useAsyncData()` (`data`, `error`, `status`, `pending`, `refresh`, `execute`, `clear`).

The response shape matches what `await`ing the builder returns: `data` is `PostgrestSingleResponse<Result>` (or `PostgrestResponseSuccess<Result>` when using `.throwOnError()`), i.e. `{ data, error, count, status, statusText, success }`. PostgREST errors are returned in-band in `data.value.error`; `error` only captures unexpected runtime failures as a `NuxtError`.

### With filters

```ts
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', 1)
  .asAsyncData('user-query')
```

### With `single()` / `maybeSingle()`

```ts
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', 1)
  .single()
  .asAsyncData('user')

const { data: maybeUser } = await supabase
  .from('users')
  .select('*')
  .eq('id', 1)
  .maybeSingle()
  .asAsyncData('maybe-user', { lazy: true })
```

### Equivalent form

```ts
const { data, status, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', 1)
  .asAsyncData('user-query')
```

is equivalent to:

```ts
const { data, status, error } = await useAsyncData(
  'user-query',
  () => supabase.from('users').select('*').eq('id', 1)
)
```

## 📘 TypeScript Support

This module uses declaration merging to provide type safety and auto-completion for `.asAsyncData()` on all Supabase query builders, with the response types of `@supabase/postgrest-js` v2.

## 🔄 Migration from v1

- `@supabase/postgrest-js` peer dependency is now `^2.0.0` (v1 is no longer supported).
- `.asAsyncData()` is now declared and implemented on query builders only. The undocumented patch that added `asAsyncData` to `Function.prototype` (any function returning a builder) was removed—call it directly on the query builder instead:

  ```ts
  // v1 (undocumented, removed)
  const query = () => supabase.from('users').select('*')
  query.asAsyncData('users')

  // v2
  supabase.from('users').select('*').asAsyncData('users')
  ```

- Types now reflect the v2 builder signature: `data` is the awaited response (`PostgrestSingleResponse<Result>`) and `error` is a `NuxtError | undefined` instead of `Error`.

## ⚠️ Limitations

- Types are written for `@supabase/postgrest-js` v2. Consumers on v1 keep the runtime behavior but get mismatched types.
- The `default` option of `useAsyncData` is typed to return the same response shape as the query.
- `asAsyncData()` relies on the Nuxt instance (like `useAsyncData`), so call it inside `setup()`, plugins or lifecycle-aware contexts.

## 🛠 Requirements

- Node.js >= 18
- Nuxt 3 or 4
- `@supabase/postgrest-js` ^2.0.0

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Install dependencies and prepare: `pnpm install && pnpm dev:prepare`
4. Make your changes and test them: `pnpm test`
5. Commit: `git commit -am 'Add my feature'`
6. Push to your fork: `git push origin feature/my-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](license).

---

Made with ❤️ by Leynier Gutiérrez González
