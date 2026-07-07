import { NextRequest, NextResponse } from "next/server";
import areasData from "@/data/areas.json";
import questionsData from "@/data/questions.json";

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("mode");

  if (mode === "exam") {
    return NextResponse.json({ areas: areasData, questions: questionsData });
  }

  return NextResponse.json(areasData);
}

// POST: accept quiz results (stateless — the client stores them locally)
export async function POST(req: NextRequest) {
  const body = await req.json();
  // In Vercel we don't have a DB; results are stored client-side via IndexedDB
  // This endpoint simply acknowledges receipt
  console.log("[Quiz Result]", { mode: body.mode, total: body.totalQuestions, correct: body.correctAnswers });
  return NextResponse.json({ success: true, sessionId: "local-" + Date.now() });
}
