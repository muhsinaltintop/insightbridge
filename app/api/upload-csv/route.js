import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }
    const text = await file.text();

    const lines = text.trim().split("\n");
    const headers = lines.shift(); // header satırını at

    const db = getDb();

    // Demo amaçlı tabloyu sıfırla
    await db.query("TRUNCATE TABLE analytics_records");

    for (const line of lines) {
      const [date, sessions, users, conversions, revenue] = line.split(",");

      await db.query(
        `INSERT INTO analytics_records 
         (record_date, sessions, users, conversions, revenue)
         VALUES (?, ?, ?, ?, ?)`,
        [date, sessions, users, conversions, revenue]
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
