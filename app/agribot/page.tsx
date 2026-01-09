"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@nextui-org/react"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Loader2, SendHorizonal, Plus, Search, Upload, X, FileText } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

type Msg = { role: "user" | "assistant"; content: string }
type ChatSession = { id: string; title: string; messages: Msg[]; uploadedFiles: string[] }

export default function AgriBotPage() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchHistory, setSearchHistory] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState("session-1")
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("agribot-history")
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        console.log("[v0] Failed to load history:", e)
      }
    }
  }, [])

  const saveCurrentSession = () => {
    if (messages.length > 0) {
      setSearchHistory((prev) => {
        const existing = prev.find((s) => s.id === currentSessionId)
        const title = messages[0]?.content?.substring(0, 30) || "Chat"
        const updated = existing
          ? prev.map((s) =>
              s.id === currentSessionId ? { ...s, messages, uploadedFiles: uploadedFiles.map((f) => f.name) } : s,
            )
          : [...prev, { id: currentSessionId, title, messages, uploadedFiles: uploadedFiles.map((f) => f.name) }]
        localStorage.setItem("agribot-history", JSON.stringify(updated))
        return updated
      })
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))

      const res = await fetch("/api/upload-rag", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setUploadedFiles((prev) => [...prev, ...files])
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `✅ Successfully uploaded ${files.length} file(s). I've indexed the content and can now provide insights based on your documents. Ask me questions about the uploaded information!`,
          },
        ])
      }
    } catch (err) {
      console.log("[v0] Upload error:", err)
      setMessages((m) => [...m, { role: "assistant", content: "❌ Failed to upload files. Please try again." }])
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Msg = { role: "user", content: input.trim() }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/py-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg.content,
          context: uploadedFiles.map((f) => f.name).join(", "),
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "Sorry, I had trouble processing your request. Please try again.",
          },
        ])
        console.log("[v0] Upstream error:", text)
      } else {
        const data = (await res.json()) as { response?: string }
        setMessages((m) => [...m, { role: "assistant", content: data.response || "No response." }])
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: "Unexpected error occurred. Please try again." }])
      console.log("[v0] Client error:", err?.message)
    } finally {
      setLoading(false)
    }
  }

  const newChat = () => {
    saveCurrentSession()
    const newId = `session-${Date.now()}`
    setCurrentSessionId(newId)
    setMessages([])
    setUploadedFiles([])
  }

  const loadSession = (session: ChatSession) => {
    saveCurrentSession()
    setCurrentSessionId(session.id)
    setMessages(session.messages)
  }

  return (
    <>
      <Navigation />
      <main className="flex h-[calc(100vh-120px)] bg-background">
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } border-r border-border bg-card transition-all duration-300 overflow-hidden flex flex-col`}
        >
          <div className="p-4 border-b border-border">
            <Button
              onClick={newChat}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Search className="h-4 w-4" />
                Search History
              </div>
              <div className="space-y-2">
                {searchHistory.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No chat history yet</p>
                ) : (
                  searchHistory.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-colors truncate ${
                        currentSessionId === session.id
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-muted text-foreground"
                      }`}
                      title={session.title}
                    >
                      {session.title}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden flex flex-col p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-foreground mb-2">AgriBot RAG Chat</h1>
              <p className="text-muted-foreground">Upload documents for context-aware agricultural insights</p>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 mb-6 space-y-4 scrollbar-thin shadow-lg"
            >
              <ScrollArea className="h-full w-full">
                <div className="flex flex-col gap-4 pr-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-2xl rounded-lg p-4 backdrop-blur-sm ${
                          m.role === "user"
                            ? "bg-emerald-600/80 text-white rounded-br-none shadow-lg border border-emerald-500/30"
                            : "bg-white/10 dark:bg-white/5 text-foreground border border-white/20 dark:border-white/10 rounded-bl-none shadow-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg p-4 rounded-bl-none backdrop-blur-sm">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-4">
              {uploadedFiles.length > 0 && (
                <div className="bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      Uploaded Documents ({uploadedFiles.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="bg-white/20 dark:bg-white/10 px-3 py-1 rounded-full text-xs text-foreground border border-white/30 dark:border-white/20 flex items-center gap-2 backdrop-blur-sm"
                      >
                        {file.name}
                        <button
                          onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    accept=".pdf,.txt,.doc,.docx,.csv"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Documents
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your crops, weather, diseases, soil management, or uploaded documents..."
                    className="min-h-[100px] resize-none bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 focus:border-emerald-500 backdrop-blur-sm"
                    aria-label="Type your message"
                  />
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-auto flex flex-col items-center justify-center gap-2 px-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-xs">Thinking...</span>
                      </>
                    ) : (
                      <>
                        <SendHorizonal className="h-5 w-5" />
                        <span className="text-xs">Send</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
