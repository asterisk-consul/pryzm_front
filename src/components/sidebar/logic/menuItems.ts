export const menuItems = [
  {
    to: '/profile',
    icon: 'mdi-account',
    title: 'Profile',
  },
  {
    to: '/home',
    icon: 'mdi-home',
    title: 'Home',
  },
 {
  to: '/caja',
  icon: 'mdi-cash-register',
  title: 'Punto de Cobro',
},

  {
    to: '/turnos',
    icon: 'mdi-calendar-check',
    title: 'Turnos',
  },
  {
    to: '/pacientes',
    icon: 'mdi-account-group',
    title: 'Pacientes',
  },
  {
    to: '/consultorios',
    icon: 'mdi-account-group',
    title: 'Consultorios',
  },
  {
    to: '/notifi',
    icon: 'mdi-bell',
    title: 'Notificaciones',
  },
  {
    to: '/generate-qr',
    icon: 'mdi-qrcode',
    title: 'Conexion',
  },
  {
    to: '/config',
    icon: 'mdi-cog',
    title: 'Configuración',
  },
]

export function getMenuItems() {
  return menuItems.map((item) => ({
    ...item,
  }))
}
