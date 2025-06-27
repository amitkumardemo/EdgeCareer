// app/api/quote/route.js
export async function GET() {
  try {
    const res = await fetch('https://zenquotes.io/api/today', { cache: "no-store" });
    const data = await res.json();

    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch quote" }),
      { status: 500 }
    );
  }
}
