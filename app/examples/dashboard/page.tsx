import { DashboardExample } from "@/components/examples/dashboard-example"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Dashboard Example</h1>
        <p className="text-muted-foreground mb-8">State management with Zustand and data fetching with React Query</p>
        <DashboardExample />
      </div>
    </main>
  )
}
