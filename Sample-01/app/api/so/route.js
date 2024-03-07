import { NextResponse } from "next/server";

export async function POST(request) {

    try {
        const body = await request.json();

        const m2mTokenResponse = await fetch(`${process.env.ECOMMERCE_WEB_URL}/api/token`);
        
        if (!m2mTokenResponse.ok) return NextResponse.json({ error: 'Failed to fetch m2m token' }, { status: 401 });
        const tokenData = await m2mTokenResponse.json();

        console.log('M2M Token:', tokenData);

        const soResponse = await fetch(`${process.env.SPENDA_DEV_API_URL}/salesorder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokenData.access_token,
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        console.log('SO Response ok?:', soResponse.ok);

        if (!soResponse.ok) {

            // Determine the HTTP status code and return the appropriate response
            if (soResponse.status === 401) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            if (soResponse.status === 403) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            if (soResponse.status === 404) {
                return NextResponse.json({ error: 'Not Found' }, { status: 404 });
            }

            if (soResponse.status === 500) {
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
            }
            
            const payload = await soResponse.json();
            console.log('SO Response Payload:', payload);
            
            if (payload.messages && payload.messages.length > 0) {
                return NextResponse.json(payload.messages.join(' | '), { status: 400 });
            } else {
                return NextResponse.json({ error: soResponse.statusText }, { status: 400});
            }
        }

        const so = await soResponse.json();
        if(!so.bsid) return NextResponse.json({ error: 'Failed to create sales order. Missing BSID' }, { status: 400 });

        return NextResponse.json(so, { status: 200 });

    } catch (error) {
        console.error('Error creating sales order:', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}