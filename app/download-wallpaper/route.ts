import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return new Response("Missing file parameter", { status: 400 });
    }

    const fileUrl = `https://ufcwallpaper.my.id/android/conormcgregor/upload/${fileName}`;

    const externalRes = await fetch(fileUrl, {
      signal: AbortSignal.timeout(15000), // 15 detik timeout untuk download
    });

    if (!externalRes.ok) {
      console.error(`Failed to fetch file: ${externalRes.status}`);
      return new Response("File not found", { status: 404 });
    }

    const fileBuffer = await externalRes.arrayBuffer();

    const headers = new Headers();
    headers.set("Content-Type", externalRes.headers.get("Content-Type") || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

    return new Response(fileBuffer, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
