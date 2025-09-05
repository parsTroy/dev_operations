import { NextRequest, NextResponse } from "next/server";
import { pusher } from "~/lib/pusher";
import { auth } from "~/server/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { channel, event, data } = await req.json();

    await pusher.trigger(channel, event, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pusher error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
