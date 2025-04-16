/**
 * Utilidades para manipulación de colores hexadecimales
 *
 * Funciones:
 * - isValidHexColor: Valida un color hexadecimal
 * - darkenColor: Oscurece un color hexadecimal
 * - lightenColor: Aclara un color hexadecimal
 * - hexToRgb: Convierte hex a objeto RGB
 * - rgbToHex: Convierte RGB a hex
 */

/**
 * Valida si un string es un color hexadecimal válido
 * @param {string} hex - Color en formato hexadecimal (#RRGGBB o #RGB)
 * @returns {boolean} - True si es válido
 */
export const isValidHexColor = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(hex)
}

/**
 * Convierte un color hexadecimal a sus componentes RGB
 * @param {string} hex - Color hexadecimal
 * @returns {{r: number, g: number, b: number}} - Objeto con componentes RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  if (!isValidHexColor(hex)) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  let hexClean = hex.replace('#', '')

  // Expandir formato abreviado (#RGB → #RRGGBB)
  if (hexClean.length === 3 || hexClean.length === 4) {
    hexClean = hexClean
      .split('')
      .map((c) => c + c)
      .join('')
  }

  // Ignorar canal alpha si existe (#RRGGBBAA → #RRGGBB)
  if (hexClean.length === 8) {
    hexClean = hexClean.substring(0, 6)
  }

  const r = parseInt(hexClean.substring(0, 2), 16)
  const g = parseInt(hexClean.substring(2, 4), 16)
  const b = parseInt(hexClean.substring(4, 6), 16)

  return { r, g, b }
}

/**
 * Convierte componentes RGB a hexadecimal
 * @param {number} r - Componente rojo (0-255)
 * @param {number} g - Componente verde (0-255)
 * @param {number} b - Componente azul (0-255)
 * @returns {string} - Color en formato hexadecimal (#RRGGBB)
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const clamp = (value: number) => Math.min(255, Math.max(0, value))
  const toHex = (value: number) => clamp(value).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Oscurece un color hexadecimal
 * @param {string} hex - Color original en formato hexadecimal
 * @param {number} [factor=0.2] - Factor de oscurecimiento (0 a 1)
 * @returns {string} - Color oscurecido en formato hexadecimal
 */
export const darkenColor = (hex: string, factor: number = 0.2): string => {
  if (!isValidHexColor(hex)) {
    console.warn(`Invalid hex color: ${hex}`)
    return hex
  }

  const { r, g, b } = hexToRgb(hex)
  const darkerR = Math.floor(r * (1 - factor))
  const darkerG = Math.floor(g * (1 - factor))
  const darkerB = Math.floor(b * (1 - factor))

  return rgbToHex(darkerR, darkerG, darkerB)
}

/**
 * Aclara un color hexadecimal
 * @param {string} hex - Color original en formato hexadecimal
 * @param {number} [factor=0.2] - Factor de aclaramiento (0 a 1)
 * @returns {string} - Color aclarado en formato hexadecimal
 */
export const lightenColor = (hex: string, factor: number = 0.2): string => {
  if (!isValidHexColor(hex)) {
    console.warn(`Invalid hex color: ${hex}`)
    return hex
  }

  const { r, g, b } = hexToRgb(hex)
  const lighterR = Math.min(255, r + Math.floor((255 - r) * factor))
  const lighterG = Math.min(255, g + Math.floor((255 - g) * factor))
  const lighterB = Math.min(255, b + Math.floor((255 - b) * factor))

  return rgbToHex(lighterR, lighterG, lighterB)
}

// Opcional: Exportar todas las funciones como objeto
export const ColorUtils = {
  isValidHexColor,
  hexToRgb,
  rgbToHex,
  darkenColor,
  lightenColor,
}

/**
 * Asigna un color consistente de la paleta Vuetify a un valor de texto dado.
 *
 * Esta función utiliza un algoritmo hash para mapear cualquier string de entrada
 * a uno de los colores predefinidos en la paleta de Vuetify, garantizando que:
 * - El mismo valor de entrada siempre produce el mismo color de salida
 * - Los colores se distribuyen uniformemente entre las opciones disponibles
 *
 * @param {string} value - El valor de texto al que se le asignará un color
 * @returns {string} El nombre del color de la paleta Vuetify (ej: 'primary', 'success')
 *
 * @example
 * // Asigna colores consistentes para visualización
 * getColorForItem('Consultorio 1') // returns 'primary'
 * getColorForItem('Consultorio 2') // returns 'success'
 * getColorForItem('Consultorio 1') // siempre devuelve 'primary' para el mismo input
 */
export const getColorForItem = (value: string) => {
  // Paleta completa de colores Vuetify disponibles
  // Nota: Estos son los nombres de colores que Vuetify provee por defecto
  const FULL_COLOR_PALETTE = [
    'primary', // Azul principal (color primario de la aplicación)
    'secondary', // Color secundario (generalmente gris/menos prominente)
    'success', // Verde (indica operación exitosa)
    'info', // Azul claro (información neutral)
    'warning', // Amarillo/Naranja (advertencias)
    'error', // Rojo (errores o acciones peligrosas)
    'purple', // Morado
    'teal', // Verde azulado
    'orange', // Naranja
    'pink', // Rosado
    'indigo', // Índigo (azul oscuro)
    'deep-purple', // Morado oscuro
    'blue', // Azul estándar
    'light-blue', // Azul claro
    'cyan', // Cian
    'green', // Verde estándar
    'light-green', // Verde claro
    'lime', // Lima (verde amarillento)
    'yellow', // Amarillo
    'amber', // Ámbar (naranja amarillento)
    'deep-orange', // Naranja oscuro
    'brown', // Marrón
    'blue-grey', // Gris azulado
  ]

  /**
   * Genera un hash numérico estable para el string de entrada.
   * Este algoritmo garantiza que:
   * - Strings similares produzcan hashes diferentes
   * - El mismo string siempre produzca el mismo hash
   * - Los hashes se distribuyan uniformemente
   */
  const hash = Array.from(value).reduce(
    (hash, char) => char.charCodeAt(0) + ((hash << 5) - hash),
    0,
  )

  // Selecciona un índice de color basado en el hash
  const colorIndex = Math.abs(hash) % FULL_COLOR_PALETTE.length

  // Devuelve el nombre del color correspondiente
  return FULL_COLOR_PALETTE[colorIndex]
}
