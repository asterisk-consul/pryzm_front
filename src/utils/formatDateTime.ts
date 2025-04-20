export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const getWeekday = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date)
}
export const getYear = (dateStr: string) => {
  const [year] = dateStr.split('-')
  return parseInt(year, 10)
}

export const getDay = (dateStr: string) => {
  const [, , day] = dateStr.split('-')
  return parseInt(day, 10)
}

export const getMonthNumber = (dateStr: string) => {
  const [, month] = dateStr.split('-')
  return parseInt(month, 10)
}

export const getMonthName = (dateStr: string): string => {
  // Array con los nombres de los meses
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  // Extraer el número del mes (segunda parte de la fecha)
  const [, month] = dateStr.split('-')

  // Convertir el número del mes a un índice numérico (0-11)
  const monthIndex = parseInt(month, 10) - 1

  // Devolver el nombre del mes correspondiente
  return monthNames[monthIndex]
}

export const formatTime = (date: Date | string): string => {
  const parsedDate = new Date(date)
  const hours = String(parsedDate.getHours()).padStart(2, '0')
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date
    .toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-') // Formato DD-MM-YYYY
}

export const formatHeaderDate = (date: string | Date) => {
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = date.split('-')
    date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
  }

  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'FECHA INVÁLIDA'
  }

  const monthName = new Intl.DateTimeFormat('es', { month: 'long' }).format(date)
  const yearValue = date.getFullYear()
  return `${monthName.toUpperCase()} ${yearValue}`
}
