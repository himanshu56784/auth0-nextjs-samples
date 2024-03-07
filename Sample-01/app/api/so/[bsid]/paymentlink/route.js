import { NextResponse } from "next/server";

export async function GET(request, { params }) {

    try {

        const searchParams = request.nextUrl.searchParams;
        const returnUrlString = searchParams.get('returnUrl')
        
        const m2mTokenResponse = await fetch(`${process.env.ECOMMERCE_WEB_URL}/api/token`,  { cache: 'no-store' });
        if (!m2mTokenResponse.ok) return NextResponse.json({ error: 'Failed to fetch m2m token' }, { status: 401 });
        
        const tokenData = await m2mTokenResponse.json();
            
        const piblResponse = await fetch(`${process.env.SPENDA_DEV_API_URL}/salesorder/${params.bsid}/paymentlink?returnUrl=${returnUrlString}`, 
            { headers: { 'Authorization': 'Bearer ' + tokenData.access_token }});

        const piblData = await piblResponse.json();
        if (!piblData.url) return NextResponse.json({ error: 'Failed to build payment link.' }, { status: 400 });        
    
        return NextResponse.json({url: piblData.url}, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}