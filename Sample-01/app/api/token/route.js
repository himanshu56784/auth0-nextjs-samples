import { NextResponse } from "next/server"

export async function GET() {

    try {
        const tokenResponse = await fetch(`${process.env.AUTH0_DOMAIN}/oauth/token`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',          
            },
            body: JSON.stringify({
                client_id: process.env.AUTH0_M2M_CLIENT_ID,
                client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
                audience: process.env.AUTH0_M2M_AUDIENCE,
                grant_type: "client_credentials"
            }),
            cache: 'no-store'
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to fetch token');
        }

        const tokenData = await tokenResponse.json();

        return NextResponse.json(tokenData, { status: 200 });

    } catch (error) {        
        return NextResponse.json({ error }, { status: 500 });
    }
}