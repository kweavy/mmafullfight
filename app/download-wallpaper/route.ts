import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return new Response("Missing file parameter", { status: 400 });
  }

  const fileUrl = `https://templatecreative.com/android/conormcgregor/upload/${fileName}`;

  const externalRes = await fetch(fileUrl);
  const fileBuffer = await externalRes.arrayBuffer();

  const headers = new Headers();
  headers.set("Content-Type", externalRes.headers.get("Content-Type") || "application/octet-stream");
  headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

  return new Response(fileBuffer, {
    headers,
    status: 200,
  });
}
