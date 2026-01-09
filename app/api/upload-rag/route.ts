// app/api/upload-rag/route.ts
import { type NextRequest, NextResponse } from "next/server"
import pdfParse from "pdf-parse"            // server-safe PDF parsing (no DOM required)
import * as mammoth from "mammoth"             // DOCX extraction
import { read, utils } from "xlsx"             // read - for Buffer input
import { Buffer } from "buffer"

const fileStorage = new Map<
  string,
  { name: string; content: string; type: string; uploadedAt: string }
>()

/**
 * Extract text from PDF using pdf-parse (Node-safe; avoids pdfjs DOM issues)
 */
async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const buffer = Buffer.from(arrayBuffer)
    const data = await pdfParse(buffer)
    return data?.text?.trim() || "[PDF extraction produced no text]"
  } catch (err) {
    console.error("[v0] PDF extraction error:", err)
    return "[PDF extraction failed]"
  }
}

/**
 * Extract text from DOCX using mammoth
 */
async function extractDocxText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const buffer = Buffer.from(arrayBuffer)
    // mammoth.extractRawText accepts { buffer: Buffer } in Node
    const result = await mammoth.extractRawText({ buffer })
    return (result && result.value) ? result.value : "[Word document extraction failed]"
  } catch (err) {
    console.error("[v0] DOCX extraction error:", err)
    return "[Word document extraction failed]"
  }
}

/**
 * Handle POST (file upload)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    // formData.getAll("files") might return File objects in the runtime.
    const entries = formData.getAll("files")
    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const files = entries as File[] // keep as File[] for usage below

    const fileMetadata = await Promise.all(
      files.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer()
          let content = ""

          const lowerName = file.name.toLowerCase()
          const mime = file.type || ""

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
            // Use read(buffer, { type: 'buffer' }) when passing Node Buffer
            const buffer = Buffer.from(arrayBuffer)
            const workbook = read(buffer, { type: "buffer" })
            let sheetContent = ""
            workbook.SheetNames.forEach((sheetName) => {
              sheetContent += `Sheet: ${sheetName}\n`
              const sheet = workbook.Sheets[sheetName]
              const csvContent = utils.sheet_to_csv(sheet)
              sheetContent += csvContent + "\n"
            })
            content = sheetContent || "[Empty spreadsheet]"
          } else {
            content = `[${mime || "unknown"}] File: ${file.name}`
          }

          const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const now = new Date().toISOString()
          fileStorage.set(fileId, {
            name: file.name,
            content,
            type: mime,
            uploadedAt: now,
          })

          return {
            id: fileId,
            name: file.name,
            size: file.size,
            type: mime,
            uploadedAt: now,
            preview: content.substring(0, 200),
            status: "success",
          }
        } catch (err) {
          console.error(`[v0] Error processing file ${file.name}:`, err)
          return {
            name: file.name,
            status: "error",
            error: "Failed to process file",
          }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${files.length} file(s)`,
      files: fileMetadata,
      storageInfo: {
        totalFiles: fileStorage.size,
        availableForRetrieval: fileMetadata.filter((f) => f.status === "success").length,
      },
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * GET - list stored files (basic info)
 */
export async function GET(request: NextRequest) {
  try {
    const files = Array.from(fileStorage.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      type: data.type,
      uploadedAt: data.uploadedAt,
      contentLength: data.content.length,
    }))

    return NextResponse.json({
      success: true,
      files,
      totalStored: fileStorage.size,
    })
  } catch (error) {
    console.error("[v0] Retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve files" }, { status: 500 })
  }
}

/**
 * PUT - return file content by id ( expects { fileId } in JSON body )
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const fileId = body?.fileId

    if (!fileId) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 })
    }

    const file = fileStorage.get(fileId)
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        type: file.type,
        content: file.content,
        uploadedAt: file.uploadedAt,
      },
    })
  } catch (error) {
    console.error("[v0] File retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 })
  }
}
