# Nuxt Supabase Query As AsyncData

A Nuxt module that enhances developer experience when using Supabase by enabling fluent queries (e.g., `supabase.from(...).select(...)`) to integrate directly with `useAsyncData()` via a convenient `.asAsyncData()` method—no manual wrapping required.

[![npm version](https://img.shields.io/npm/v/nuxt-supabase-query-as-async-data.svg)](https://www.npmjs.com/package/nuxt-supabase-query-as-async-data)
[![license](https://img.shields.io/npm/l/nuxt-supabase-query-as-async-data.svg)](https://github.com/leynier/nuxt-supabase-query-as-async-data/blob/main/LICENSE)

---

## 🧭 Introduction

`nuxt-supabase-query-as-async-data` lets you fluently convert Supabase query chains into Nuxt's `useAsyncData()` calls by appending `.asAsyncData(key)`. This simplifies server-side rendering and data fetching with minimal boilerplate.

## 🚀 Features

- Adds `.asAsyncData()` to Supabase query builders
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

This module depends on `@supabase/postgrest-js`. If you're already using:

- `@supabase/supabase-js`, or
- the `@nuxtjs/supabase` module,

...you’re good to go. Otherwise, install it manually:

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
const { data, status, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', 1)
  .asAsyncData('user-query');
```

Equivalent to:

```ts
const { data, status, error } = await useAsyncData(
  'user-query',
  () => supabase.from('users').select('*').eq('id', 1)
);
```

## 📘 TypeScript Support

This module uses declaration merging to provide type safety and auto-completion for `.asAsyncData()` on all compatible Supabase query builders.

## 🛠 Requirements

- Nuxt 3
- Supabase client v2+
- `@supabase/postgrest-js`

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -am 'Add my feature'`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by Leynier Gutiérrez González
