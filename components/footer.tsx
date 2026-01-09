import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-serif font-bold text-xl text-foreground">AgriBot</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering farmers with AI-driven insights for sustainable and productive agriculture.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/agribot" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  AgriBot
                </Link>
              </li>
              <li>
                <Link href="/weather" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Weather Checker
                </Link>
              </li>
              <li>
                <Link href="/diseases" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Disease Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/library" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Library
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-foreground">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>support@agribot.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 AgriBot. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-muted-foreground text-sm mt-4 sm:mt-0">
            <span>Made with</span>
            <Leaf className="h-4 w-4 text-primary" />
            <span>for sustainable farming</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
