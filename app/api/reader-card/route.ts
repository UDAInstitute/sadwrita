import { NextResponse } from "next/server";

const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const maxRequestSize = 4096;

type IssuedCardRow = {
  reader_name: string;
  reader_email: string;
  reader_id: string;
  issued_at: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isIssuedCardRow(value: unknown): value is IssuedCardRow {
  return (
    isRecord(value) &&
    typeof value.reader_name === "string" &&
    typeof value.reader_email === "string" &&
    typeof value.reader_id === "string" &&
    typeof value.issued_at === "string" &&
    !Number.isNaN(Date.parse(value.issued_at))
  );
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin !== new URL(request.url).origin) {
    return jsonResponse({ error: "This request could not be verified." }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "A JSON request is required." }, 415);
  }

  const rawBody = await request.text();
  if (rawBody.length > maxRequestSize) {
    return jsonResponse({ error: "The request is too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "The request could not be read." }, 400);
  }

  if (
    !isRecord(body) ||
    (body.name !== undefined &&
      body.name !== null &&
      typeof body.name !== "string") ||
    typeof body.email !== "string"
  ) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = body.email.trim().toLowerCase();
  if (
    name.length > 100 ||
    email.length > 254 ||
    !emailPattern.test(email)
  ) {
    return jsonResponse({ error: "Enter a valid name and email address." }, 400);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Reader Card storage is missing Supabase server configuration.");
    return jsonResponse(
      { error: "Reader Card issuance is not configured yet. Please try again later." },
      503,
    );
  }

  let projectOrigin: string;
  try {
    projectOrigin = new URL(supabaseUrl).origin;
  } catch (error) {
    console.error("The configured Supabase URL is invalid.", error);
    return jsonResponse(
      { error: "Reader Card issuance is temporarily unavailable." },
      503,
    );
  }

  let supabaseResponse: Response;
  try {
    supabaseResponse = await fetch(
      `${projectOrigin}/rest/v1/rpc/issue_reader_card`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_name: name, p_email: email }),
      },
    );
  } catch (error) {
    console.error("Supabase could not be reached for Reader Card issuance.", error);
    return jsonResponse(
      { error: "Reader Card issuance is temporarily unavailable." },
      503,
    );
  }

  if (!supabaseResponse.ok) {
    console.error(
      "Supabase rejected Reader Card issuance.",
      supabaseResponse.status,
    );
    return jsonResponse(
      { error: "Your Reader's Card could not be issued. Please try again." },
      502,
    );
  }

  let rows: unknown;
  try {
    rows = await supabaseResponse.json();
  } catch (error) {
    console.error("Supabase returned an unreadable Reader Card response.", error);
    return jsonResponse(
      { error: "Reader Card issuance is temporarily unavailable." },
      502,
    );
  }

  if (!Array.isArray(rows) || !isIssuedCardRow(rows[0])) {
    console.error("Supabase returned no valid Reader Card record.");
    return jsonResponse(
      { error: "Reader Card issuance is temporarily unavailable." },
      502,
    );
  }

  const card = rows[0];
  return jsonResponse(
    {
      readerName: card.reader_name,
readerEmail: card.reader_email,
readerId: card.reader_id,
readerSince: card.issued_at,
    },
    200,
  );
}
