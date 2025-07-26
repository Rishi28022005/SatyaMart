"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupplierApprovals } from "./supplier-approvals"
import { ComplaintManagement } from "./complaint-management"
import { UserCheck, MessageSquare, BarChart3 } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage suppliers, complaints, and platform oversight</p>
      </div>

      <Tabs defaultValue="suppliers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suppliers" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Supplier Approvals</span>
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Complaints</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="mt-6">
          <SupplierApprovals />
        </TabsContent>

        <TabsContent value="complaints" className="mt-6">
          <ComplaintManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Analytics dashboard coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
