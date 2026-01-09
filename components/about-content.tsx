import { TeamMemberCard } from "./team-member-card"

export function AboutContent() {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "/farmer-ceo.jpg",
      bio: "Agricultural expert with 15+ years in sustainable farming",
    },
    {
      name: "Priya Singh",
      role: "Lead AI Engineer",
      image: "/ai-engineer-woman.jpg",
      bio: "ML specialist focused on crop disease detection",
    },
    {
      name: "Amit Patel",
      role: "Weather Specialist",
      image: "/meteorologist-man.jpg",
      bio: "Climate data expert with 10+ years experience",
    },
    {
      name: "Neha Sharma",
      role: "Product Manager",
      image: "/product-manager-woman.jpg",
      bio: "Passionate about farmer-centric technology solutions",
    },
    {
      name: "Vikram Desai",
      role: "Data Scientist",
      image: "/data-scientist-man.jpg",
      bio: "Specializes in predictive analytics for agriculture",
    },
    {
      name: "Anjali Verma",
      role: "Community Lead",
      image: "/community-lead-woman.jpg",
      bio: "Connects farmers with AgriBot resources and support",
    },
  ]

  return (
    <div className="space-y-12">
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

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Meet Our Team</h2>
          <p className="text-muted-foreground">Dedicated experts committed to revolutionizing agriculture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>
    </div>
  )
}
