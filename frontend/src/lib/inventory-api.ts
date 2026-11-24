const API_BASE_URL = (process.env.API_BASE_URL ?? "http://localhost:4001").replace(/\/+$/, "");

export async function proxyInventory(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store"
    });
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json"
      }
    });
  } catch (error) {
    return Response.json(
      {
        error: "Inventory API is unavailable",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 502 }
    );
  }
}
