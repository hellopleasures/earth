import { NextResponse } from "next/server";

const AGENT_ID = "6fc6383d-c10e-07ff-99bc-88bf0873de28"; // Your agent ID

export async function POST(req: Request) {
  try {
    const { input } = await req.json();
    const response = await fetch(`http://localhost:3000/${AGENT_ID}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: input,
        userId: "user", // Static user ID for now
        userName: "User", // Static user name for now
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in message API route:", error);
    return NextResponse.json(
      { error: "Failed to communicate with agent" },
      { status: 500 }
    );
  }
}
