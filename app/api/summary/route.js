import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function sumMetric(rows, key) {
  return rows.reduce((acc, row) => acc + Number(row[key] || 0), 0);
}

export async function GET() {
  try {
    const db = getDb();

    const [rows] = await db.query(
      `SELECT record_date, sessions, users, conversions, revenue
       FROM analytics_records
       ORDER BY record_date ASC`
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        current_period: {
          sessions: 0,
          users: 0,
          conversions: 0,
          conversion_rate: 0,
        },
        previous_period: {
          sessions: 0,
          users: 0,
          conversions: 0,
          conversion_rate: 0,
        },
        daily: [],
      });
    }

    // Son 14 günü al (daha az varsa, olanı kullan)
    const last14 = rows.slice(-14);
    const last7 = last14.slice(-7);
    const prev7 = last14.slice(-14, -7); // 7’den az da olsa sorun değil

    const currentSessions = sumMetric(last7, "sessions");
    const currentUsers = sumMetric(last7, "users");
    const currentConversions = sumMetric(last7, "conversions");

    const previousSessions = sumMetric(prev7, "sessions");
    const previousUsers = sumMetric(prev7, "users");
    const previousConversions = sumMetric(prev7, "conversions");

    const currentConversionRate =
      currentSessions > 0 ? currentConversions / currentSessions : 0;

    const previousConversionRate =
      previousSessions > 0 ? previousConversions / previousSessions : 0;

    const current_period = {
      sessions: currentSessions,
      users: currentUsers,
      conversions: currentConversions,
      conversion_rate: currentConversionRate,
    };

    const previous_period = {
      sessions: previousSessions,
      users: previousUsers,
      conversions: previousConversions,
      conversion_rate: previousConversionRate,
    };

    // daily: frontend tablo için
    const daily = rows.map((row) => ({
      date: row.record_date,
      sessions: Number(row.sessions),
      users: Number(row.users),
      conversions: Number(row.conversions),
      revenue: row.revenue !== null ? Number(row.revenue) : null,
    }));

    return NextResponse.json({
      current_period,
      previous_period,
      daily,
    });
  } catch (err) {
    console.error("Summary API error:", err);
    return NextResponse.json(
      { error: "Failed to calculate summary" },
      { status: 500 }
    );
  }
}
