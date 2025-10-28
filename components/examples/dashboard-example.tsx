"use client"

import { useState } from "react"
import { useUserStore } from "@/store/user-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/validation"

export function DashboardExample() {
  const { user, setUser, isLoading, setLoading } = useUserStore()
  const [mockUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      created_at: "2024-01-20",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      created_at: "2024-02-01",
    },
  ])

  const handleSelectUser = (selectedUser: User) => {
    setLoading(true)
    setTimeout(() => {
      setUser(selectedUser)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Select a user to view details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockUsers.map((u) => (
            <Button
              key={u.id}
              variant={user?.id === u.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleSelectUser(u)}
            >
              {u.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : user ? "Selected user information" : "No user selected"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading user details...</div>
          ) : user ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-semibold">{user.created_at}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Select a user to view details</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
