import React from 'react';

export interface SearchHighlightProps {
    text: string;
    query: string;
    className?: string;
}

/**
 * Safe, case-insensitive search highlighting.
 *
 * Splits the text on the first occurrence of the (case-insensitive) query,
 * wraps each match in a semantic `<mark>` using the Flex highlight token, and
 * preserves the original casing of the source text. Never uses
 * `dangerouslySetInnerHTML`; all output is plain React nodes.
 */
export function SearchHighlight({ text, query, className }: SearchHighlightProps) {
    if (!query) {
return <>{text}</>;
}

    const needle = query.toLocaleLowerCase();
    const parts: React.ReactNode[] = [];
    let index = 0;

    while (index < text.length) {
        const matchIndex = text.toLocaleLowerCase().indexOf(needle, index);

        if (matchIndex === -1) {
            parts.push(text.slice(index));
            break;
        }

        if (matchIndex > index) {
            parts.push(text.slice(index, matchIndex));
        }

        parts.push(
            <mark
                key={`${matchIndex}-${needle}`}
                className="bg-status-ringing-bg text-inherit rounded-[2px] px-0 py-0 font-semibold"
            >
                {text.slice(matchIndex, matchIndex + needle.length)}
            </mark>
        );
        index = matchIndex + needle.length;
    }

    return <span className={className}>{parts}</span>;
}
