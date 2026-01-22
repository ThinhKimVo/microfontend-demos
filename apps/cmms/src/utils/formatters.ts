import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { vi } from 'date-fns/locale'

export const formatDate = (dateString: string, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return '-'
    return format(date, formatStr)
  } catch {
    return '-'
  }
}

export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, 'dd/MM/yyyy HH:mm')
}

export const formatDateRelative = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return '-'
    return formatDistanceToNow(date, { addSuffix: true, locale: vi })
  } catch {
    return '-'
  }
}

export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num)
}

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} phút`
  }
  if (hours < 24) {
    return `${hours.toFixed(1)} giờ`
  }
  return `${(hours / 24).toFixed(1)} ngày`
}

export const formatArea = (sqm: number): string => {
  return `${formatNumber(sqm)} m²`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11)
}
