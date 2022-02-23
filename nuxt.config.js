import colors from 'vuetify/es5/util/colors'
import fa from 'vuetify/es5/locale/fa'
// const env = process.env.NODE_ENV || 'dev'
// const URL = env== 'dev' ? 'http://localhost:8111' : 'https://b612theory.ir'
const URL = 'http://localhost:9905'
export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    // titleTemplate: '%s - B-612',
    title: 'B612 Theory | تئوری بی‌ششصدودوازده',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'google-site-verification', content: '5Te0JCs2f01GsIj-bVeFAU8ZN8BPsOU-DKYUIBQDZ4k' },
      { hid: 'description', name: 'description', content: 'کبریت رنگی B612 | خرید حس خوب برای دیگران' },
      { name: 'keywords', content: 'کبریت رنگی , b612 , B612 , هنری,هنر,رومنس,هدیه , کادو' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/fonts/iransans/css/fontiran.css',
    '~/assets/variables.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/persistedState.js', ssr: false },
    { src: '~/plugins/axios', ssr: false },
    { src: '~plugins/components', ssr: false },
    { src: '~plugins/moment' },
    { src: '~plugins/try', ssr: false },
    { src: '~plugins/persianNumber' },
    { src: '~plugins/vueClipboard', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  // components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast'
    // '@tui-nuxt/editor'
  ],

  toast: {
    position: 'top-left',
    duration: 5000,
    // theme: 'outline',
    className: 'text-text',
    register: [ // Register custom toasts
      {
        name: 'default-error',
        message: 'مشکلی به وجود آمده است',
        options: {
          type: 'error',
          icon: 'close'
        }
      }
    ]
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true
  },

  proxy: {
    '/api': URL
  },

  // pwa: {
  //   manifest: {
  //     lang: 'fa'
  //   }
  // },
  pwa: {
    icon: {
      source: '~/static/logo-b612.png',
      fileName: 'logo-b612.png'
    },
    manifest: {
      short_name: 'B612',
      name: 'B612',
      lang: 'fa',
      start_url: '/',
      theme_color: '#1e76a6',
      display: 'minimal-ui',
      icons: [
        {
          source: '~/static/logo-b612.png',
          fileName: 'logo-b612.png',
          purpose: 'manifest'
        }
      ]
    }
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    rtl: true,
    lang: {
      locales: { fa },
      current: 'fa'
    },
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3,
          error: '#FF5252',
          success: '#4CAF50'
        }
      }
    }
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  // build: {
  // extend(config, {isDev, isClient}) {
  //   if(isClient) {
  //     config.module.rules.push({
  //       test: /froala_editor\.pkgd\.min\.css$/,
  //       loader: 'string-replace-loader',
  //       exclude: /(node_modules)/,
  //       options: {
  //         search: /fill-available/g,
  //         replace: 'stretch'
  //       }
  //     })
  //   }
  // }
  // },

  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  },

  auth: {

    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
        }
      }
    },
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/'
    }
  }
}
