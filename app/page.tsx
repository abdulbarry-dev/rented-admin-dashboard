import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Frontend Stack</h1>
            <p className="text-lg text-muted-foreground">
              Production-ready Next.js frontend with TypeScript, TailwindCSS, and shadcn/ui
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Next.js 15+</p>
                <p>✓ TypeScript</p>
                <p>✓ TailwindCSS</p>
                <p>✓ shadcn/ui</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ State Management (Zustand)</p>
                <p>✓ Data Fetching (React Query)</p>
                <p>✓ Validation (Zod)</p>
                <p>✓ Type-Safe API Client</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/examples/form">
              <Button>View Form Example</Button>
            </Link>
            <Link href="/examples/dashboard">
              <Button variant="outline">View Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
