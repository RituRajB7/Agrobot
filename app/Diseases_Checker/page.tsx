
"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
type Result = {
  disease: string
  confidence: number
  advice: string
}

export default function DiseasesPage() {
  const [crop, setCrop] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/diseases/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, symptoms }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as Result
      setResult(data)
    } catch (err) {
      setError("Unable to analyze symptoms. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-foreground">Disease Checker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="crop" className="text-sm text-muted-foreground">
                    Crop
                  </label>
                  <input
                    id="crop"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="e.g., wheat, rice, tomato"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="symptoms" className="text-sm text-muted-foreground">
                    Symptoms
                  </label>
                  <textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    placeholder="Describe visible symptoms, e.g., yellowing leaves, powdery white spots, leaf blight..."
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Analyzing..." : "Check Disease"}
                  </Button>
                </div>
              </form>

              <div aria-live="polite" className="rounded-md border border-border bg-card p-4">
                {!result && !error && (
                  <p className="text-muted-foreground text-sm">
                    Provide crop and symptom details to receive likely disease and recommendations.
                  </p>
                )}
                {error && <p className="text-destructive text-sm">{error}</p>}
                {result && (
                  <div className="grid gap-2">
                    <p className="text-foreground">
                      Likely Disease: <span className="font-medium">{result.disease}</span>
                    </p>
                    <p className="text-foreground">
                      Confidence: <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
                    </p>
                     <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                        {result.advice}
                      </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
    <Footer />
    </>
  )
}
