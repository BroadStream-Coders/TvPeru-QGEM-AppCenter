export async function POST(req) {
  try {
    const body = await req.json(); // recibe el JSON
    console.log("📩 JSON recibido:", body);

    return new Response(JSON.stringify({ ok: true, data: body }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en POST /api/test:", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
