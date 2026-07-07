import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

// Áreas temáticas del examen UAG
export const areas = pgTable("areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  questionCount: integer("question_count").notNull(), // preguntas en el examen real
  color: text("color").notNull(), // tailwind color class for UI
  section: integer("section").notNull().default(1), // 1 = primera sección, 2 = segunda sección (por área de carrera)
});

// Preguntas del banco
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  areaId: integer("area_id").references(() => areas.id, { onDelete: "cascade" }).notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options").notNull().$type<string[]>(), // array de 4 opciones
  correctIndex: integer("correct_index").notNull(), // índice 0-3
  explanation: text("explanation").notNull().default(""),
  difficulty: text("difficulty").notNull().default("media"), // fácil, media, difícil
  createdAt: timestamp("created_at").defaultNow(),
});

// Sesiones de estudio / quizzes
export const quizSessions = pgTable("quiz_sessions", {
  id: serial("id").primaryKey(),
  areaId: integer("area_id").references(() => areas.id, { onDelete: "cascade" }),
  mode: text("mode").notNull().default("practice"), // practice, exam, flashcard
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  startedAt: timestamp("started_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
});

// Respuestas individuales
export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => quizSessions.id, { onDelete: "cascade" }).notNull(),
  questionId: integer("question_id").references(() => questions.id, { onDelete: "cascade" }).notNull(),
  selectedIndex: integer("selected_index").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  answeredAt: timestamp("answered_at").defaultNow(),
});
