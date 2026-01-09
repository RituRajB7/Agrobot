import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Cloud, Bug, BookOpen, HelpCircle, Users } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Bot,
    title: "AgriBot",
    description:
      "AI-powered farming assistant that provides personalized advice and answers to all your agricultural questions.",
    href: "/agribot",
    color: "text-primary",
  },
  {
    icon: Cloud,
    title: "Weather Checker",
    description: "Real-time weather monitoring and forecasting specifically tailored for agricultural planning.",
    href: "/weather",
    color: "text-blue-600",
  },
  {
    icon: Bug,
    title: "Disease Checker",
    description: "Advanced plant disease detection and treatment recommendations using AI image analysis.",
    href: "/diseases",
    color: "text-red-600",
  },
  {
    icon: BookOpen,
    title: "Library",
    description: "Comprehensive collection of agricultural resources, guides, and research materials.",
    href: "/library",
    color: "text-amber-600",
  },
  {
    icon: Users,
    title: "About Us",
    description: "Learn about our mission to revolutionize agriculture through innovative technology solutions.",
    href: "/about",
    color: "text-purple-600",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    description: "Find answers to commonly asked questions about our platform and agricultural practices.",
    href: "/faqs",
    color: "text-green-600",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground">
            Everything You Need for Smart Farming
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive suite of AI-powered tools designed to enhance your agricultural productivity and
            decision-making.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
              >
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-serif">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">{feature.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 bg-transparent"
                  >
                    <Link href={feature.href}>Explore {feature.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
