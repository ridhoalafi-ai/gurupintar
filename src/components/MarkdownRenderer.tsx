import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by lines
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let inList = false;
  let listItems: string[] = [];
  let listType: "bullet" | "ordered" = "bullet";

  const renderList = (items: string[], type: "bullet" | "ordered", key: string) => {
    if (type === "ordered") {
      return (
        <ol key={key} className="list-decimal pl-6 my-4 space-y-1.5 text-slate-700 leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
          ))}
        </ol>
      );
    }
    return (
      <ul key={key} className="list-disc pl-6 my-4 space-y-1.5 text-slate-700 leading-relaxed">
        {items.map((item, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
        ))}
      </ul>
    );
  };

  const renderTable = (headers: string[], rows: string[][], key: string) => {
    return (
      <div key={key} className="my-6 overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/70 font-display">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-teal-800 uppercase tracking-wider border-b border-slate-200"
                >
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-4 py-3 text-slate-700 align-top leading-relaxed border-r border-slate-100 last:border-r-0"
                    dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell.trim()) }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const parseInlineMarkdown = (text: string): string => {
    let html = text;
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-slate-900'>$1</strong>");
    // Italic: *text* or _text_
    html = html.replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>");
    // Underline or other simple formatting
    html = html.replace(/`(.*?)`/g, "<code class='bg-slate-100 text-teal-700 px-1.5 py-0.5 rounded font-mono text-xs'>$1</code>");
    return html;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table parsing
    if (line.trim().startsWith("|")) {
      if (inList) {
        elements.push(renderList(listItems, listType, `list-${elements.length}`));
        listItems = [];
        inList = false;
      }

      // Check if it's separator row like |---|---|
      if (line.includes("-") && !line.match(/[a-zA-Z0-9]/)) {
        continue;
      }

      const parts = line.split("|").map(p => p.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      if (!inTable) {
        inTable = true;
        tableHeaders = parts;
        tableRows = [];
      } else {
        tableRows.push(parts);
      }
      continue;
    } else if (inTable) {
      elements.push(renderTable(tableHeaders, tableRows, `table-${elements.length}`));
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    // List parsing
    const bulletMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    const orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (bulletMatch) {
      if (inList && listType !== "bullet") {
        elements.push(renderList(listItems, listType, `list-${elements.length}`));
        listItems = [];
      }
      inList = true;
      listType = "bullet";
      listItems.push(bulletMatch[2]);
      continue;
    } else if (orderedMatch) {
      if (inList && listType !== "ordered") {
        elements.push(renderList(listItems, listType, `list-${elements.length}`));
        listItems = [];
      }
      inList = true;
      listType = "ordered";
      listItems.push(orderedMatch[2]);
      continue;
    } else if (inList) {
      elements.push(renderList(listItems, listType, `list-${elements.length}`));
      listItems = [];
      inList = false;
    }

    // Headers
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-2xl sm:text-3xl font-bold font-display text-teal-900 border-b border-teal-100 pb-3 mt-8 mb-4 tracking-tight">
          {line.substring(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl sm:text-2xl font-bold font-display text-emerald-800 mt-6 mb-3 tracking-tight">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold font-display text-slate-800 mt-5 mb-2">
          {line.substring(4)}
        </h3>
      );
    } else if (line.trim() === "") {
      // Empty line / spacer
      elements.push(<div key={i} className="h-2" />);
    } else {
      // Regular paragraph
      elements.push(
        <p
          key={i}
          className="text-slate-700 leading-relaxed my-2.5 text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }}
        />
      );
    }
  }

  // Flush remaining elements
  if (inTable) {
    elements.push(renderTable(tableHeaders, tableRows, `table-${elements.length}`));
  }
  if (inList) {
    elements.push(renderList(listItems, listType, `list-${elements.length}`));
  }

  return <div className="markdown-body space-y-1">{elements}</div>;
}
