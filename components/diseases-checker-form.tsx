import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AboutContent() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-foreground">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed">
          AgriBot empowers farmers with AI-driven insights to increase yield, reduce waste, and make sustainable
          decisions. We combine agronomy best practices with weather awareness and disease guidance to support
          day-to-day farming.
        </CardContent>
      </Card>

      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-foreground">What We Do</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed">
          • Real-time weather checks tailored for fields
          <br />• Early disease detection tips from symptoms
          <br />• Practical guidance for crops and soil health
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-foreground">Why It Matters</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed">
          Reliable information at the right time protects harvests and saves resources. With AgriBot, small improvements
          add up across a season—boosting productivity and resilience in changing climates.
        </CardContent>
      </Card>
    </div>
  )
}
