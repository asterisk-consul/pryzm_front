// src/config/fields.js
import type { SignupField } from '@/interfaces'
import { nameRules, emailRules } from '@/utils/validationRules'

export const signupFields: SignupField[] = [
  { name: 'nombre', label: 'Nombre', icon: 'mdi-account', rules: nameRules },
  { name: 'email', label: 'E-mail', icon: 'mdi-email', rules: emailRules },
  { name: 'telefono', label: 'Telefono', icon: 'mdi-phone' },
  // { name: 'ciudad', label: 'Ciudad', icon: 'mdi-city' },
  // { name: 'direccion', label: 'Direccion', icon: 'mdi-city' },
  // { name: 'pais', label: 'Pais', icon: 'mdi-earth' },
  // {
  //   name: 'password',
  //   label: 'Password',
  //   icon: 'mdi-lock',
  //   rules: passwordRules,
  //   type: 'password',
  // },
]
