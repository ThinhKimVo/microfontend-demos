import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

// Pages
import Dashboard from './pages/Dashboard'
import BuildingList from './pages/facilities/BuildingList'
import BuildingDetail from './pages/facilities/BuildingDetail'
import FloorDetail from './pages/facilities/FloorDetail'
import AssetList from './pages/assets/AssetList'
import AssetDetail from './pages/assets/AssetDetail'
import WorkOrderList from './pages/workorders/WorkOrderList'
import WorkOrderDetail from './pages/workorders/WorkOrderDetail'
import WorkOrderKanban from './pages/workorders/WorkOrderKanban'
import PMScheduleList from './pages/preventive/PMScheduleList'
import PMScheduleDetail from './pages/preventive/PMScheduleDetail'
import InventoryList from './pages/inventory/InventoryList'
import PartDetail from './pages/inventory/PartDetail'
import TechnicianList from './pages/resources/TechnicianList'
import TechnicianDetail from './pages/resources/TechnicianDetail'
import VendorList from './pages/vendors/VendorList'
import VendorDetail from './pages/vendors/VendorDetail'
import RequestList from './pages/requests/RequestList'
import RequestDetail from './pages/requests/RequestDetail'
import ReportsDashboard from './pages/reports/ReportsDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />

        {/* Facilities */}
        <Route path="facilities" element={<BuildingList />} />
        <Route path="facilities/:buildingId" element={<BuildingDetail />} />
        <Route path="facilities/:buildingId/floors/:floorId" element={<FloorDetail />} />

        {/* Assets */}
        <Route path="assets" element={<AssetList />} />
        <Route path="assets/:assetId" element={<AssetDetail />} />

        {/* Work Orders */}
        <Route path="work-orders" element={<WorkOrderList />} />
        <Route path="work-orders/kanban" element={<WorkOrderKanban />} />
        <Route path="work-orders/:workOrderId" element={<WorkOrderDetail />} />

        {/* Preventive Maintenance */}
        <Route path="preventive-maintenance" element={<PMScheduleList />} />
        <Route path="preventive-maintenance/:pmId" element={<PMScheduleDetail />} />

        {/* Inventory */}
        <Route path="inventory" element={<InventoryList />} />
        <Route path="inventory/:partId" element={<PartDetail />} />

        {/* Resources */}
        <Route path="technicians" element={<TechnicianList />} />
        <Route path="technicians/:techId" element={<TechnicianDetail />} />

        {/* Vendors */}
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/:vendorId" element={<VendorDetail />} />

        {/* Requests */}
        <Route path="requests" element={<RequestList />} />
        <Route path="requests/:requestId" element={<RequestDetail />} />

        {/* Reports */}
        <Route path="reports" element={<ReportsDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
