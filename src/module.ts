import { addPlugin, createResolver, defineNuxtModule, extendViteConfig } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-supabase-query-as-async-data',
    configKey: 'supabaseQueryAsAsyncData',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false
    }
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add plugin that extends PostgrestBuilder and Function prototypes
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Add types
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolver.resolve('./runtime/types.d.ts') })
    })
    
    // Transpile runtime
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('@supabase/postgrest-js')
    })
  }
})