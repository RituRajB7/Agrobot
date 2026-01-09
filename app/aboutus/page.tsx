"use client"

import { TeamMemberCard } from "@/components/team-member-card"
import Link from "next/link"
import { Leaf } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Cloud, Bug, BookOpen, HelpCircle, Users } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
export default function AboutPage() {
  const teamMembers = [
    {
      name: "Ritu Raj",
      role: "Team Leader",
      image: "/rituraj.png",
      bio: "Leading the way ahead. To get the Full Fledged Solution.",
    },
    {
      name: "Pranav Ratan",
      role: "Ui/Ux Designer",
      image: "/pranav.png",
      bio: "Life is full of creativity and I love to create.",
    },
    {
      name: "Amulya Dabas",
      role: "Data Specialist",
      image: "/amulya.png",
      bio: "Climate data expert with 10+ years experience.",
    },
    {
      name: "Lakshay Sharma",
      role: "LLM and ChatBot Integrator",
      image: "/lakshay.png",
      bio: "Passionate about farmer-centric technology solutions.",
    },
    {
      name: "Yashveer Singh",
      role: "Backend Expert",
      image: "/yashveer.png",
      bio: "Specializes in predictive analytics for agriculture.",
    },
    {
      name: "Prakhar Tyagi",
      role: "Block Chain Developer",
      image: "/prakhar.png",
      bio: "Over a decade of experience in blockchain.",
    },
  ]

  return (
    <>
      <Navigation />
    <main className="min-h-[calc(100vh-10rem)] bg-background">
      {/* === Spline 3D Model Section === */}
      <section className="w-full h-[500px] overflow-hidden">
        <iframe
          src="https://my.spline.design/hanastarterfilecopy-j2KTonRAbeigDgJ925vVLUCy-Ly4/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="rounded-none border-none"
        ></iframe>
      </section>

      {/* === About & Team Section === */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Mission, What We Do, Why It Matters */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-card rounded-lg p-6">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                AgriBot empowers farmers with AI-driven insights to increase yield, reduce waste, and make sustainable
                decisions. We combine agronomy best practices with weather awareness and disease guidance to support
                day-to-day farming.
              </p>
            </div>

            <div className="border border-border bg-card rounded-lg p-6">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">What We Do</h2>
              <ul className="text-muted-foreground leading-relaxed space-y-2">
                <li>• Real-time weather checks tailored for fields</li>
                <li>• Early disease detection tips from symptoms</li>
                <li>• Practical guidance for crops and soil health</li>
              </ul>
            </div>

            <div className="md:col-span-2 border border-border bg-card rounded-lg p-6">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Why It Matters</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reliable information at the right time protects harvests and saves resources. With AgriBot, small
                improvements add up across a season—boosting productivity and resilience in changing climates.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Meet Our Team</h2>
              <p className="text-muted-foreground">Dedicated experts committed to revolutionizing agriculture</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.name} {...member} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
     <Footer />
    </>
  )
}
