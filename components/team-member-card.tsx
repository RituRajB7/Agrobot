"use client"

interface TeamMemberProps {
  name: string
  role: string
  image: string
  bio: string
}

export function TeamMemberCard({ name, role, image, bio }: TeamMemberProps) {
  return (
    <div className="group flex flex-col items-center gap-4 p-6 rounded-lg bg-card border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 cursor-pointer">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        {/* Glow effect overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
      </div>

      {/* Team member info */}
      <div className="text-center">
        <h3 className="text-lg font-serif font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-primary font-medium">{role}</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{bio}</p>
      </div>
    </div>
  )
}
