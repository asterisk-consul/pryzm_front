import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'

const vuetify = createVuetify({
  components: {
    ...components,
    ...labs, // Añade todos los componentes de labs
  },
  directives,
  locale: {
    locale: 'es',
    messages: { es },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#8c57ff',
          border: '#e6e5e7',
          'background-list': '#e3d7ff',
          'on-primary': '#ffffff',
          'primary-darken-1': '#7e4ee6',
          secondary: '#8a8d93',
          'secondary-darken-1': '#7c7f84',
          'on-secondary': '#ffffff',
          success: '#56ca00',
          'success-darken-1': '#4db600',
          'on-success': '#ffffff',
          info: '#16b1ff',
          'info-darken-1': '#149fe6',
          'on-info': '#ffffff',
          warning: '#ffb400',
          'warning-darken-1': '#e6a200',
          'on-warning': '#ffffff',
          error: '#ff4c51',
          'error-darken-1': '#e64449',
          'on-error': '#ffffff',
          background: '#f4f5fa',
          'on-background': '#2e263d',
          surface: '#ffffff',
          'on-surface': '#2e263d',
          'th-grey-50': '#fafafa',
          'th-grey-100': '#f5f5f5',
          'th-grey-200': '#eeeeee',
          'th-grey-300': '#e0e0e0',
          'th-grey-400': '#bdbdbd',
          'th-grey-500': '#9e9e9e',
          'th-grey-600': '#757575',
          'th-grey-700': '#616161',
          'th-grey-800': '#424242',
          'th-grey-900': '#212121',
          'tooltip-background': 'transparent',
        },
      },
      dark: {
        colors: {
          primary: '#7e4ee6',
          border: '#474461',
          'background-list': '#463776',
          'on-primary': '#ffffff',
          'primary-darken-1': '#7e4ee6',
          secondary: '#8a8d93',
          'secondary-darken-1': '#7c7f84',
          'on-secondary': '#ffffff',
          success: '#56ca00',
          'success-darken-1': '#4db600',
          'on-success': '#ffffff',
          info: '#16b1ff',
          'info-darken-1': '#149fe6',
          'on-info': '#ffffff',
          warning: '#ffb400',
          'warning-darken-1': '#e6a200',
          'on-warning': '#ffffff',
          error: '#ff4c51',
          'error-darken-1': '#e64449',
          'on-error': '#ffffff',
          background: '#312d4b',
          'on-background': '#e7e3fc',
          surface: '#312d4b',
          'on-surface': '#e7e3fc',
          'th-grey-50': '#2a2e42',
          'th-grey-100': '#2f3349',
          'th-grey-200': '#4a5072',
          'th-grey-300': '#5e6692',
          'th-grey-400': '#7983bb',
          'th-grey-500': '#8692d0',
          'th-grey-600': '#aab3de',
          'th-grey-700': '#b6bee3',
          'th-grey-800': '#cfd3ec',
          'th-grey-900': '#e7e9f6',
          'tooltip-background': 'transparent',
        },
      },
    },
  },
})

export default vuetify
