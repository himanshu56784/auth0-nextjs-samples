'use client';

import Highlight from 'react-highlight';
import '../../node_modules/highlight.js/styles/atom-one-dark.css';

export const JsonHighlighter = ({ payload }) => {
    return (
        <Highlight>{JSON.stringify(payload, null, 2)}</Highlight>
    );
}