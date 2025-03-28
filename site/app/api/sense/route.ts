export async function POST(request: any) {
    const requestContents = await request.json();

    return new Response(JSON.stringify({ message: "OK" }), { status: 200 });
}