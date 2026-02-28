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

export default function BlogArticle({ article }) {
  return (
    <article style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#888', marginBottom: '16px' }}>
        {article.published_date && <span>{new Date(article.published_date).toLocaleDateString()}</span>}
        {article.target_keywords && <><span>·</span><span>{article.target_keywords.split(',')[0]}</span></>}
      </div>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '32px' }}>
        {article.title}
      </h1>
      <div>{renderMarkdown(article.body || '')}</div>
    </article>
  );
}
