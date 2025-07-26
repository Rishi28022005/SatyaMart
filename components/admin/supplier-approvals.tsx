"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Eye, Check, X, FileText, Building } from "lucide-react"

type PendingSupplier = {
  id: string
  business_name: string
  address: string
  phone: string
  fssai_number: string
  fssai_doc_url: string | null
  logo_url: string | null
  is_verified: boolean
  created_at: string
  users: {
    name: string
    email: string
  }
}

export function SupplierApprovals() {
  const [suppliers, setSuppliers] = useState<PendingSupplier[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSupplier, setSelectedSupplier] = useState<PendingSupplier | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPendingSuppliers()
  }, [])

  const fetchPendingSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select(`
          *,
          users (
            name,
            email
          )
        `)
        .eq("is_verified", false)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSuppliers(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch pending suppliers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (supplierId: string, approved: boolean) => {
    try {
      const { error } = await supabase.from("suppliers").update({ is_verified: approved }).eq("id", supplierId)

      if (error) throw error

      toast({
        title: "Success",
        description: `Supplier ${approved ? "approved" : "rejected"} successfully!`,
      })

      fetchPendingSuppliers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

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

  if (suppliers.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending approvals</h3>
          <p className="text-gray-600">All supplier applications have been processed.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier Approvals</h2>
        <Badge variant="outline" className="text-sm">
          {suppliers.length} pending
        </Badge>
      </div>

      <div className="grid gap-6">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{supplier.business_name}</CardTitle>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Pending Review
                </Badge>
              </div>
              <div className="text-sm text-gray-600">Applied on {format(new Date(supplier.created_at), "PPP")}</div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Person</p>
                  <p>{supplier.users.name}</p>
                  <p className="text-sm text-gray-600">{supplier.users.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{supplier.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Business Address</p>
                  <p>{supplier.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">FSSAI License Number</p>
                  <p className="font-mono">{supplier.fssai_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Documents</p>
                  <div className="flex space-x-2 mt-1">
                    {supplier.fssai_doc_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(supplier.fssai_doc_url!, "_blank")}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        FSSAI License
                      </Button>
                    )}
                    {supplier.logo_url && (
                      <Button variant="outline" size="sm" onClick={() => window.open(supplier.logo_url!, "_blank")}>
                        <Eye className="h-3 w-3 mr-1" />
                        Logo
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedSupplier(supplier)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Review Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Supplier Application Review</DialogTitle>
                      <DialogDescription>
                        Review all details before approving or rejecting this supplier application.
                      </DialogDescription>
                    </DialogHeader>

                    {selectedSupplier && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Business Name</Label>
                            <p className="mt-1">{selectedSupplier.business_name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                            <p className="mt-1">{selectedSupplier.users.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Email</Label>
                            <p className="mt-1">{selectedSupplier.users.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Phone</Label>
                            <p className="mt-1">{selectedSupplier.phone}</p>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-sm font-medium text-gray-500">Address</Label>
                            <p className="mt-1">{selectedSupplier.address}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">FSSAI Number</Label>
                            <p className="mt-1 font-mono">{selectedSupplier.fssai_number}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Application Date</Label>
                            <p className="mt-1">{format(new Date(selectedSupplier.created_at), "PPP")}</p>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button variant="outline" onClick={() => handleApproval(selectedSupplier.id, false)}>
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button onClick={() => handleApproval(selectedSupplier.id, true)}>
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={() => handleApproval(supplier.id, false)}>
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApproval(supplier.id, true)}>
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
