import { NextResponse } from "next/server"

type Payload = { crop?: string; symptoms?: string }

function analyze({ crop = "", symptoms = "" }: Payload) {
  const s = symptoms.toLowerCase()

  // Simple keyword heuristics; replace with your model or API later.
  if (s.includes("powdery") || s.includes("white spots")) {
    return {
      disease: "Powdery Mildew",
      confidence: 0.78,
      advice:
        "Improve air circulation, avoid overhead watering, and consider sulfur-based fungicides. Remove heavily infected leaves.",
    }
  }
  if (s.includes("rust") || s.includes("orange") || s.includes("pustules")) {
    return {
      disease: `${crop ? `${crop} ` : ""}Rust`,
      confidence: 0.72,
      advice:
        "Use resistant varieties where possible. Apply appropriate fungicides early and remove volunteer host plants.",
    }
  }
  if (s.includes("blight") || s.includes("brown spots")) {
    return {
      disease: "Leaf Blight",
      confidence: 0.69,
      advice:
        "Ensure proper spacing for airflow, rotate crops, and remove infected debris. Fungicide may help if applied early.",
    }
  }
  if (s.includes("yellow") || s.includes("yellowing")) {
    return {
      disease: "Nutrient Deficiency (Possible Nitrogen)",
      confidence: 0.55,
      advice:
        "Soil test recommended. Consider balanced fertilization and check irrigation schedule to prevent leaching.",
    }
  }

  return {
    disease: "Unknown / Needs Expert Review",
    confidence: 0.3,
    advice:
      "Provide clearer photos and details (leaf surface, stems, soil). Consider consulting a local agronomist for precise diagnosis.",
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Payload
  const result = analyze(payload)
  return NextResponse.json(result)
}
