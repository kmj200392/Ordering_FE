export async function POST(request) {
    try {
        const body = await request.json();
        const upstream = await fetch('https://ilhop.kucisc.kr/send_order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
            body: JSON.stringify(body)
        });

        const text = await upstream.text();
        // Try to parse JSON; if fail, return as text
        try {
            const json = JSON.parse(text);
            return new Response(JSON.stringify(json), { status: upstream.status, headers: { 'Content-Type': 'application/json' } });
        } catch {
            return new Response(text, { status: upstream.status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: 'proxy_failed', message: e?.message || 'Unknown error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
} 