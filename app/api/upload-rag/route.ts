// app/api/upload-rag/route.ts
import { type NextRequest, NextResponse } from "next/server"
import * as mammoth from "mammoth"
import { read, utils } from "xlsx"
import { Buffer } from "buffer"

const fileStorage = new Map<
  string,
  { name: string; content: string; type: string; uploadedAt: string }
>()

/**
 * Extract text from PDF (ESM-safe, Vercel-safe)
 */
async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const buffer = Buffer.from(arrayBuffer)

    // ✅ dynamic import (fixes ESM issue)
    const pdfParseModule = await import("pdf-parse")
    const pdfParse =
      (pdfParseModule as any).default ?? (pdfParseModule as any)

    const data = await pdfParse(buffer)
    return data?.text?.trim() || "[PDF extraction produced no text]"
  } catch (err) {
    console.error("[PDF extraction error]", err)
    return "[PDF extraction failed]"
  }
}

async function extractDocxText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const buffer = Buffer.from(arrayBuffer)
    const result = await mammoth.extractRawText({ buffer })
    return result?.value || "[Word document extraction failed]"
  } catch (err) {
    console.error("[DOCX extraction error]", err)
    return "[Word document extraction failed]"
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const entries = formData.getAll("files")

    if (!entries.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const files = entries as File[]

    const fileMetadata = await Promise.all(
      files.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const lowerName = file.name.toLowerCase()
          const mime = file.type || ""
          let content = ""

          if (mime === "text/plain" || lowerName.endsWith(".txt")) {
            content = new TextDecoder().decode(arrayBuffer)
          } else if (mime === "text/csv" || lowerName.endsWith(".csv")) {
            content = new TextDecoder().decode(arrayBuffer)
          } else if (mime === "application/pdf" || lowerName.endsWith(".pdf")) {
            content = await extractPdfText(arrayBuffer)
          } else if (
            mime === "application/msword" ||
            mime ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            lowerName.endsWith(".doc") ||
            lowerName.endsWith(".docx")
          ) {
            content = await extractDocxText(arrayBuffer)
          } else if (
            mime ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            lowerName.endsWith(".xlsx")
          ) {
            const buffer = Buffer.from(arrayBuffer)
            const workbook = read(buffer, { type: "buffer" })
            let sheetContent = ""

            workbook.SheetNames.forEach((sheetName) => {
              sheetContent += `Sheet: ${sheetName}\n`
              const sheet = workbook.Sheets[sheetName]
              sheetContent += utils.sheet_to_csv(sheet) + "\n"
            })

            content = sheetContent || "[Empty spreadsheet]"
          } else {
            content = `[${mime || "unknown"}] File: ${file.name}`
          }

          const id = crypto.randomUUID()
          const uploadedAt = new Date().toISOString()

          fileStorage.set(id, {
            name: file.name,
            content,
            type: mime,
            uploadedAt,
          })

          return {
            id,
            name: file.name,
            size: file.size,
            type: mime,
            uploadedAt,
            preview: content.slice(0, 200),
            status: "success",
          }
        } catch (err) {
          console.error("File processing error:", err)
          return { name: file.name, status: "error" }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      files: fileMetadata,
      totalStored: fileStorage.size,
    })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    files: Array.from(fileStorage.entries()).map(([id, f]) => ({
      id,
      name: f.name,
      type: f.type,
      uploadedAt: f.uploadedAt,
      length: f.content.length,
    })),
  })
}

export async function PUT(request: NextRequest) {
  const { fileId } = await request.json()
  const file = fileStorage.get(fileId)

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, file })
}
