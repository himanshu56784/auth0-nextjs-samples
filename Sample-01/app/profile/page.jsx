'use client';

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { JsonHighlighter } from '@/components/JsonHighlighter';

const ProfilePage = () => {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    if (!user) return <div>Not logged in</div>

    return (
    user && (
        <div>        
            <JsonHighlighter payload={user} />
        </div>)
    )
}

export default ProfilePage
