import { NextRequest, NextResponse } from "next/server";

const N8N_URL    = process.env.N8N_CHATBOT_WEBHOOK_URL ?? "";
const SECRET     = process.env.CHATBOT_SECRET ?? "avenly-chatbot-2026";
const SUPA_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPA_KEY   = process.env.SUPABASE_SERVICE_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    const { message, history, sessionId } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    if (!N8N_URL) {
      return NextResponse.json({
        response: "Serwis chwilowo niedostępny. Napisz do nas bezpośrednio na kontakt@avenly.pl.",
      });
    }

    const n8nRes = await fetch(N8N_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-chatbot-secret": SECRET,
      },
      body: JSON.stringify({
        message: String(message).slice(0, 1000),
        history: Array.isArray(history) ? history : [],
      }),
      signal: AbortSignal.timeout(22000),
    });

    const data = await n8nRes.json();
    const response: string =
      data.response ?? "Przepraszam, coś poszło nie tak. Spróbuj ponownie.";

    if (SUPA_URL && SUPA_KEY && sessionId) {
      const sid = String(sessionId).slice(0, 100);
      const headers = {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
      };
      const save = (role: string, content: string) =>
        fetch(`${SUPA_URL}/rest/v1/chat_messages`, {
          method: "POST",
          headers,
          body: JSON.stringify({ session_id: sid, role, content }),
        });
      Promise.all([save("user", message), save("assistant", response)]).catch(() => {});
    }

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({
      response:
        "Przepraszam, wystąpił błąd. Skontaktuj się z nami przez formularz kontaktowy.",
    });
  }
}
