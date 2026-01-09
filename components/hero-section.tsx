import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Cloud, Bug, BookOpen } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-muted/30 to-accent/10 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
                Your Smart
                <span className="text-primary block">Farming Companion</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Harness the power of AI to revolutionize your farming experience. Get instant weather updates, disease
                diagnostics, and expert agricultural guidance all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/agribot">
                  Start with AgriBot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Weather</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bug className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Diseases</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Library</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">AI Guidance</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src="/modern-tech-farm.webp"
                alt="Modern agriculture with technology integration"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
