import { NextResponse } from "next/server";
import areasData from "@/data/areas.json";
import questionsData from "@/data/questions.json";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Data already embedded (JSON static). No DB needed.",
    areas: areasData.length,
    questions: questionsData.length,
  });
}
