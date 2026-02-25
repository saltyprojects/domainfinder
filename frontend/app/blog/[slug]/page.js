import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts } from '../../../content/posts';

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — DomyDomains Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

function renderMarkdown(text) {
  // Simple markdown-to-JSX: headings, bold, links, paragraphs, lists, tables
  const lines = text.trim().split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '32px', marginBottom: '12px' }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(<li key={i} style={{ marginBottom: '4px' }}>{inlineFormat(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '16px' }}>{items}</ul>);
      continue;
    } else if (line.startsWith('|')) {
      // Skip table (simplified)
      while (i < lines.length && lines[i].startsWith('|')) i++;
      continue;
    } else if (line.trim() === '') {
      // skip
    } else {
      elements.push(
        <p key={i} style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '16px', fontSize: '1rem' }}>
          {inlineFormat(line)}
        </p>
      );
    }
    i++;
  }
  return elements;
}

function inlineFormat(text) {
  // Handle **bold** and [links](url)
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

    let firstMatch = null;
    let firstIdx = remaining.length;

    if (boldMatch && boldMatch.index < firstIdx) {
      firstMatch = 'bold';
      firstIdx = boldMatch.index;
    }
    if (linkMatch && linkMatch.index < firstIdx) {
      firstMatch = 'link';
      firstIdx = linkMatch.index;
    }

    if (!firstMatch) {
      parts.push(remaining);
      break;
    }

    if (firstIdx > 0) parts.push(remaining.slice(0, firstIdx));

    if (firstMatch === 'bold') {
      parts.push(<strong key={key++} style={{ color: 'var(--text)', fontWeight: 600 }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(firstIdx + boldMatch[0].length);
    } else {
      parts.push(
        <a key={key++} href={linkMatch[2]} style={{ color: 'var(--green)', textDecoration: 'underline' }}>
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(firstIdx + linkMatch[0].length);
    }
  }
  return parts;
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px' }}>
      <nav style={{ marginBottom: '32px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        <Link href="/" style={{ color: 'var(--green)' }}>🌐 DomyDomains</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link href="/blog" style={{ color: 'var(--green)' }}>Blog</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>{post.title}</span>
      </nav>

      <article>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '32px' }}>
          {post.title}
        </h1>
        <div>{renderMarkdown(post.body)}</div>
      </article>

      <div style={{ marginTop: '48px', padding: '24px', background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Ready to find your perfect domain?</p>
        <Link href="/" style={{
          display: 'inline-block', padding: '12px 24px', background: 'var(--green)', color: '#000',
          borderRadius: '12px', fontWeight: 700, fontSize: '1rem',
        }}>
          Search Now — Free →
        </Link>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link href="/blog" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Back to all posts</Link>
      </div>
    </div>
  );
}
