import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { pusher } from "~/lib/pusher";
import { auth } from "~/server/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as { channel: string; event: string; data: unknown };

    await pusher.trigger(body.channel, body.event, body.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pusher error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}