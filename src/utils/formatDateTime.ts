export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
