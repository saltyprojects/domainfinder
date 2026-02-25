'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function SEOScore({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    if (score >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #e5e5e5 0deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'var(--background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: getScoreColor(score)
        }}>
          {score}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>SEO Score</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{getScoreLabel(score)}</div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon }) {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div style={{
      padding: '16px',
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ 
        fontSize: '1.2rem', 
        fontWeight: 600, 
        color: 'var(--text)',
        marginBottom: '4px' 
      }}>
        {typeof value === 'number' ? formatNumber(value) : value}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function TrendChart({ data, title }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.visitors || d.interest || 0));
  
  return (
    <div style={{
      padding: '16px',
      background: 'var(--surface)', 
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)'
    }}>
      <h4 style={{ 
        fontSize: '0.9rem', 
        fontWeight: 600, 
        marginBottom: '12px',
        color: 'var(--text)'
      }}>
        {title}
      </h4>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        gap: '2px', 
        height: '60px',
        marginBottom: '8px'
      }}>
        {data.slice(-6).map((point, index) => {
          const value = point.visitors || point.interest || 0;
          const height = maxValue > 0 ? (value / maxValue * 50) : 1;
          
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${height}px`,
                background: 'var(--green)',
                borderRadius: '2px 2px 0 0',
                minHeight: '2px',
                opacity: 0.7 + (index * 0.1)
              }}
              title={`${point.month}: ${value.toLocaleString()}`}
            />
          );
        })}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.7rem',
        color: 'var(--text-dim)'
      }}>
        <span>6 months ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}

function RecommendationsList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '💡';
      default: return '📋';
    }
  };

  return (
    <div style={{
      padding: '16px',
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)'
    }}>
      <h4 style={{ 
        fontSize: '0.9rem', 
        fontWeight: 600, 
        marginBottom: '12px',
        color: 'var(--text)'
      }}>
        SEO Recommendations
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {recommendations.slice(0, 3).map((rec, index) => (
          <div key={index} style={{
            padding: '8px 12px',
            background: 'var(--background)',
            borderRadius: '6px',
            border: `1px solid ${getPriorityColor(rec.priority)}20`
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              marginBottom: '4px'
            }}>
              <span>{getPriorityIcon(rec.priority)}</span>
              <span style={{ 
                fontSize: '0.8rem', 
                fontWeight: 600,
                color: getPriorityColor(rec.priority)
              }}>
                {rec.title}
              </span>
            </div>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)', 
              margin: 0,
              lineHeight: 1.3
            }}>
              {rec.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SEOAnalytics({ domain, keyword, compact = false }) {
  const [seoData, setSeoData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!domain || domain.length < 3) {
      setSeoData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const params = new URLSearchParams({ domain });
    if (keyword) params.append('keyword', keyword);

    fetch(`${API_BASE}/api/seo/analysis/?${params}`, {
      signal: controller.signal
    })
      .then(res => {
        if (!res.ok) throw new Error('SEO analysis failed');
        return res.json();
      })
      .then(data => {
        setSeoData(data.analysis);
        setRecommendations(data.recommendations || []);
        setLoading(false);
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError('Failed to load SEO data');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [domain, keyword]);

  if (loading) {
    return (
      <div style={{
        padding: compact ? '12px' : '20px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)'
      }}>
        <div className="skeleton" style={{ height: '20px', marginBottom: '12px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '80px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !seoData) {
    return (
      <div style={{
        padding: compact ? '12px' : '20px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          {error || 'SEO data unavailable'}
        </div>
        <div style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)',
          marginTop: '4px'
        }}>
          Upgrade to Pro for detailed SEO analytics
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        fontSize: '0.8rem'
      }}>
        <SEOScore score={seoData.seo_score} />
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          DA: {seoData.domain_authority} | 
          {' '}{(seoData.traffic?.monthly_visitors / 1000).toFixed(0)}K visitors |
          {' '}{(seoData.backlinks?.total_backlinks / 1000).toFixed(0)}K backlinks
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          marginBottom: '8px',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📊 SEO Analytics
          <div style={{
            padding: '2px 6px',
            background: 'rgba(168, 85, 247, 0.1)',
            color: 'var(--purple)',
            borderRadius: '10px',
            fontSize: '0.65rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Pro Feature
          </div>
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <SEOScore score={seoData.seo_score} />
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '12px',
        marginBottom: '20px' 
      }}>
        <MetricCard
          title="Domain Authority"
          value={seoData.domain_authority}
          subtitle="Moz DA Score"
          icon="🎯"
        />
        <MetricCard
          title="Monthly Visitors"
          value={seoData.traffic?.monthly_visitors || 0}
          subtitle="Estimated traffic"
          icon="👥"
        />
        <MetricCard
          title="Backlinks"
          value={seoData.backlinks?.total_backlinks || 0}
          subtitle={`${seoData.backlinks?.referring_domains || 0} domains`}
          icon="🔗"
        />
        <MetricCard
          title="Trends Interest"
          value={seoData.trends?.current_interest || 0}
          subtitle="Google Trends"
          icon="📈"
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '16px',
        marginBottom: '16px'
      }}>
        {seoData.traffic?.traffic_trend && (
          <TrendChart 
            data={seoData.traffic.traffic_trend} 
            title="Traffic Trend (6 months)" 
          />
        )}
        {seoData.trends?.trend_data && (
          <TrendChart 
            data={seoData.trends.trend_data} 
            title="Search Interest Trend" 
          />
        )}
      </div>

      <RecommendationsList recommendations={recommendations} />

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'var(--border)',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: 'var(--text-dim)',
        textAlign: 'center'
      }}>
        📊 Upgrade to Pro for real-time SEO data from leading providers like Ahrefs, SEMrush & Moz
      </div>
    </div>
  );
}

export default SEOAnalytics;