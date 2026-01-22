export * from './mockClients'
export * from './mockBuildings'
export * from './mockFloors'
export * from './mockAssets'
export * from './mockWorkOrders'
export * from './mockPMSchedules'
export * from './mockInventory'
export * from './mockTechnicians'
export * from './mockVendors'
export * from './mockRequests'

// Dashboard stats
import { mockWorkOrders } from './mockWorkOrders'
import { mockAssets } from './mockAssets'
import { mockPMSchedules } from './mockPMSchedules'
import { mockInventory } from './mockInventory'
import { mockTechnicians } from './mockTechnicians'
import { DashboardStats } from '../types'

export const getDashboardStats = (): DashboardStats => {
  const openWOs = mockWorkOrders.filter(wo =>
    ['Draft', 'Approved', 'Assigned', 'In Progress', 'On Hold'].includes(wo.status)
  ).length

  const overdueWOs = mockWorkOrders.filter(wo => {
    if (['Completed', 'Closed', 'Cancelled'].includes(wo.status)) return false
    const targetDate = new Date(wo.targetCompletionDate)
    return targetDate < new Date()
  }).length

  const totalPMScheduled = mockPMSchedules.reduce((sum, pm) => sum + (pm.totalScheduled || 0), 0)
  const totalPMCompleted = mockPMSchedules.reduce((sum, pm) => sum + (pm.totalCompleted || 0), 0)
  const pmComplianceRate = totalPMScheduled > 0 ? (totalPMCompleted / totalPMScheduled) * 100 : 0

  const assetsNeedingAttention = mockAssets.filter(asset =>
    asset.status === 'In Maintenance' || asset.criticality === 'Critical'
  ).length

  const lowStockItems = mockInventory.filter(item =>
    item.currentQuantity <= item.minimumLevel
  ).length

  const availableTechs = mockTechnicians.filter(t => t.currentStatus === 'Available').length
  const technicianUtilization = ((mockTechnicians.length - availableTechs) / mockTechnicians.length) * 100

  // Calculate average MTTR from completed work orders
  const completedWOs = mockWorkOrders.filter(wo => wo.actualCompletionDate && wo.actualStartDate)
  let avgMTTR = 0
  if (completedWOs.length > 0) {
    const totalHours = completedWOs.reduce((sum, wo) => {
      const start = new Date(wo.actualStartDate!)
      const end = new Date(wo.actualCompletionDate!)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)
    avgMTTR = totalHours / completedWOs.length
  }

  return {
    openWorkOrders: openWOs,
    overdueWorkOrders: overdueWOs,
    pmComplianceRate: Math.round(pmComplianceRate * 10) / 10,
    totalAssets: mockAssets.length,
    assetsNeedingAttention,
    lowStockItems,
    technicianUtilization: Math.round(technicianUtilization),
    mttr: Math.round(avgMTTR * 10) / 10,
  }
}
