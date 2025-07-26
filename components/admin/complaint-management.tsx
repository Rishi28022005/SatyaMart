"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { MessageSquare, User, Building } from "lucide-react"

type Complaint = {
  id: string
  vendor_id: string
  supplier_id: string
  message: string
  status: "pending" | "resolved" | "dismissed"
  created_at: string
  vendor: {
    name: string
    email: string
  }
  supplier: {
    business_name: string
    users: {
      name: string
      email: string
    }
  }
}

export function ComplaintManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          vendor:users!complaints_vendor_id_fkey (
            name,
            email
          ),
          supplier:suppliers!complaints_supplier_id_fkey (
            business_name,
            users (
              name,
              email
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setComplaints(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch complaints",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateComplaintStatus = async (complaintId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("complaints").update({ status: newStatus }).eq("id", complaintId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Complaint status updated successfully!",
      })

      fetchComplaints()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredComplaints =
    statusFilter === "all" ? complaints : complaints.filter((complaint) => complaint.status === statusFilter)

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Complaint Management</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Complaints</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredComplaints.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {statusFilter === "all" ? "No complaints" : `No ${statusFilter} complaints`}
            </h3>
            <p className="text-gray-600">
              {statusFilter === "all"
                ? "No complaints have been filed yet."
                : `No complaints with ${statusFilter} status found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Complaint #{complaint.id.slice(0, 8)}</CardTitle>
                  <Badge className={getStatusColor(complaint.status)}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">Filed on {format(new Date(complaint.created_at), "PPP")}</div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Complainant (Vendor)</p>
                        <p className="font-medium">{complaint.vendor.name}</p>
                        <p className="text-sm text-gray-600">{complaint.vendor.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Against Supplier</p>
                        <p className="font-medium">{complaint.supplier.business_name}</p>
                        <p className="text-sm text-gray-600">{complaint.supplier.users.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Complaint Details</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">{complaint.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Update Status:</span>
                      <Select
                        value={complaint.status}
                        onValueChange={(value) => updateComplaintStatus(complaint.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="dismissed">Dismissed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
