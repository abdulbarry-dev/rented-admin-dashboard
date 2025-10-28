import { FormExample } from "@/components/examples/form-example"

export default function FormPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Form Example</h1>
          <p className="text-muted-foreground mb-8">Type-safe form with Zod validation</p>
          <FormExample />
        </div>
      </div>
    </main>
  )
}
