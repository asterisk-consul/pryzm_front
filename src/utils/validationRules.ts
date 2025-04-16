/**
 * REGLAS DE VALIDACIÓN PARA FORMULARIOS
 *
 * Este archivo exporta conjuntos de reglas predefinidas para validar:
 * - Nombres (nameRules)
 * - Emails (emailRules)
 * - Contraseñas (passwordRules)
 *
 * Cada conjunto de reglas sigue el formato de validación de Vuetify:
 * Array de funciones que reciben un valor y devuelven true|string
 * (true si es válido, string con mensaje de error si no es válido)
 */

/**
 * REGLAS PARA NOMBRES (nameRules)
 * Valida que un campo de nombre cumpla con requisitos básicos
 */
export const nameRules = [
  // Validación: Campo requerido
  (value) => !!value || 'Debe colocar el nombre',

  // Validación: Longitud mínima de 5 caracteres
  (value) => (value && value.length >= 5) || 'El nombre debe contener más de 5 caracteres',
]

/**
 * REGLAS PARA EMAIL (emailRules)
 * Valida que un campo de email tenga formato correcto
 */
export const emailRules = [
  // Validación: Campo requerido
  (value) => !!value || 'Ingrese su E-mail',

  // Validación: Formato básico de email (texto@texto.texto)
  (value) => /.+@.+\..+/.test(value) || 'El E-mail ingresado no es correcto',
]

/**
 * REGLAS PARA CONTRASEÑA (passwordRules)
 * Valida requisitos básicos de contraseñas
 */
export const passwordRules = [
  // Validación: Campo requerido
  (value) => !!value || 'Debe ingresar su contraseña',

  // Validación: Longitud mínima de 5 caracteres
  (value) => (value && value.length >= 5) || 'La contraseña debe contener más de 5 caracteres',
]
