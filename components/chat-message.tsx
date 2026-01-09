"use client"

import Image from "next/image"
// Utility function to concatenate class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type ChatMessageProps = {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user"
  return (
    <div className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Image
          src="/placeholder-logo.png"
          alt="AgriBot"
          width={32}
          height={32}
          className="rounded-md border border-border"
        />
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
        aria-live="polite"
      >
        {content}
      </div>
      {isUser && (
        <Image
          src="/placeholder-user.png"
          alt="You"
          width={32}
          height={32}
          className="rounded-full border border-border object-cover"
        />
      )}
    </div>
  )
}
