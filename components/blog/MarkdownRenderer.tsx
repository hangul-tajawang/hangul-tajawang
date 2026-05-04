import React from "react";

export function MarkdownRenderer({ content }: { content: string }) {
  // A very basic Markdown to React element renderer for standard simple markdown
  
  const parseMarkdown = (text: string) => {
    const cleanText = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
    const lines = cleanText.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Headers
        if (line.startsWith('# ')) {
            elements.push(<h1 key={i} className="text-3xl sm:text-4xl font-black text-zinc-900 mt-12 mb-6 leading-tight break-keep">{parseInline(line.slice(2))}</h1>);
            continue;
        }
        if (line.startsWith('## ')) {
            elements.push(<h2 key={i} className="text-2xl sm:text-3xl font-bold text-zinc-800 mt-10 mb-5 leading-snug break-keep">{parseInline(line.slice(3))}</h2>);
            continue;
        }
        if (line.startsWith('### ')) {
            elements.push(<h3 key={i} className="text-xl sm:text-2xl font-bold text-zinc-800 mt-8 mb-4">{parseInline(line.slice(4))}</h3>);
            continue;
        }
        
        // Lists
        if (line.trim().startsWith('- ')) {
            listItems.push(<li key={i} className="mb-2 text-zinc-600 leading-relaxed text-lg">{parseInline(line.trim().substring(2))}</li>);
            // If next line is not a list item, flush list
            if (i === lines.length - 1 || !lines[i+1].trim().startsWith('- ')) {
                elements.push(<ul key={'ul-'+i} className="list-disc pl-6 mb-6 space-y-2">{listItems}</ul>);
                listItems = [];
            }
            continue;
        }
        
        // Paragraphs
        if (line.trim() === '') {
            continue;
        }
        
        elements.push(<p key={i} className="mb-6 text-zinc-600 leading-loose text-lg font-medium break-keep">{parseInline(line)}</p>);
    }
    return elements;
  };

  const parseInline = (text: string) => {
    // Bold: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-extrabold text-zinc-900">{part.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <article className="prose prose-zinc max-w-none">
      {parseMarkdown(content)}
    </article>
  );
}
