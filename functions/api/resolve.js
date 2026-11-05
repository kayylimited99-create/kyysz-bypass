export async function onRequest({ request }) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("url");

  let target;

  try {
    target = new URL(raw);
  } catch {
    return Response.json({ error: "URL tidak valid" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return Response.json({ error: "URL tidak diizinkan" }, { status: 400 });
  }

  const host = target.hostname.toLowerCase();

  if (
    host !== "safelinku.com" &&
    !host.endsWith(".safelinku.com")
  ) {
    return Response.json({ error: "Domain tidak diizinkan" }, { status: 403 });
  }

  try {
    const response = await fetch(target.toString(), {
      redirect: "follow",
      signal: AbortSignal.timeout(10000)
    });

    const destination = response.url;
    await response.body?.cancel();

    return Response.json({ destination });
  } catch {
    return Response.json(
      { error: "Gagal mengikuti redirect" },
      { status: 400 }
    );
  }
}
