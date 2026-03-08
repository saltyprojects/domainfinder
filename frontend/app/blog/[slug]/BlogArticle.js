'use client';

function renderMarkdown(text) {
  const lines = text.trim().split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '32px', marginBottom: '12px', color: '#fff' }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: '1.15rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px', color: '#ddd' }}>{line.slice(4)}</h3>);
    } else if (line.startsWith('# ')) {
      // skip title
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(<li key={i} style={{ marginBottom: '4px' }}>{inlineFormat(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '20px', color: '#aaa', lineHeight: 1.8, marginBottom: '16px' }}>{items}</ul>);
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(<li key={i} style={{ marginBottom: '4px' }}>{inlineFormat(lines[i].replace(/^\d+\.\s/, ''))}</li>);
        i++;
      }
      elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: '20px', color: '#aaa', lineHeight: 1.8, marginBottom: '16px' }}>{items}</ol>);
      continue;
    } else if (line.startsWith('|')) {
      while (i < lines.length && lines[i].startsWith('|')) i++;
      continue;
    } else if (line.trim() === '') {
      // skip
    } else {
      elements.push(<p key={i} style={{ color: '#aaa', lineHeight: 1.8, marginBottom: '16px', fontSize: '1rem' }}>{inlineFormat(line)}</p>);
    }
    i++;
  }
  return elements;
}

function inlineFormat(text) {
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
    let firstMatch = null;
    let firstIdx = remaining.length;
    if (boldMatch && boldMatch.index < firstIdx) { firstMatch = 'bold'; firstIdx = boldMatch.index; }
    if (linkMatch && linkMatch.index < firstIdx) { firstMatch = 'link'; firstIdx = linkMatch.index; }
    if (!firstMatch) { parts.push(remaining); break; }
    if (firstIdx > 0) parts.push(remaining.slice(0, firstIdx));
    if (firstMatch === 'bold') {
      parts.push(<strong key={key++} style={{ color: '#fff', fontWeight: 600 }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(firstIdx + boldMatch[0].length);
    } else {
      parts.push(<a key={key++} href={linkMatch[2]} style={{ color: '#8b5cf6', textDecoration: 'underline' }}>{linkMatch[1]}</a>);
      remaining = remaining.slice(firstIdx + linkMatch[0].length);
    }
  }
  return parts;
}

function isHtmlContent(text) {
  return /<(h[1-6]|p|ul|ol|li|strong|em|a |div|table|blockquote)[>\s]/i.test(text);
}

const htmlStyles = `
  .blog-html h1 { font-size: 1.6rem; font-weight: 800; margin-top: 32px; margin-bottom: 16px; color: #fff; }
  .blog-html h2 { font-size: 1.4rem; font-weight: 700; margin-top: 32px; margin-bottom: 12px; color: #fff; }
  .blog-html h3 { font-size: 1.15rem; font-weight: 600; margin-top: 24px; margin-bottom: 8px; color: #ddd; }
  .blog-html p { color: #aaa; line-height: 1.8; margin-bottom: 16px; font-size: 1rem; }
  .blog-html ul, .blog-html ol { padding-left: 20px; color: #aaa; line-height: 1.8; margin-bottom: 16px; }
  .blog-html li { margin-bottom: 4px; }
  .blog-html strong { color: #fff; font-weight: 600; }
  .blog-html a { color: #8b5cf6; text-decoration: underline; }
  .blog-html code { background: #1e1e2e; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  .blog-html table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  .blog-html th, .blog-html td { border: 1px solid #333; padding: 8px; color: #aaa; }
  .blog-html th { background: #1e1e2e; color: #fff; }
`;

export default function BlogArticle({ article }) {
  const body = article.body || '';
  const useHtml = isHtmlContent(body);

  return (
    <article style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#888', marginBottom: '16px' }}>
        {article.published_date && <span>{new Date(article.published_date).toLocaleDateString()}</span>}
        {article.target_keywords && <><span>·</span><span>{article.target_keywords.split(',')[0]}</span></>}
      </div>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '32px' }}>
        {article.title}
      </h1>
      {useHtml ? (
        <>
          <style>{htmlStyles}</style>
          <div className="blog-html" dangerouslySetInnerHTML={{ __html: body }} />
        </>
      ) : (
        <div>{renderMarkdown(body)}</div>
      )}
    </article>
  );
}
