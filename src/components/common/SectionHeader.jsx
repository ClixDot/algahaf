import React from 'react';

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  theme = 'light',
  className = '',
  style = {}
}) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`section-header-reveal ${className}`.trim()}
      style={{
        textAlign: centered ? 'center' : 'left',
        maxWidth: centered ? '760px' : '680px',
        margin: centered ? '0 auto 3.5rem auto' : '0 0 3.5rem 0',
        ...style
      }}
    >
      {eyebrow && (
        <span
          className="eyebrow"
          style={{
            color: isDark ? 'var(--color-sand)' : 'var(--color-sand-dark)'
          }}
        >
          {eyebrow}
        </span>
      )}
      {title && (
        <h2
          className="section-title"
          style={{
            color: isDark ? '#FAF8F5' : 'var(--color-charcoal)',
            marginBottom: subtitle ? '1rem' : 0
          }}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className="lead-text"
          style={{
            color: isDark ? '#C5BCAC' : 'var(--color-charcoal-muted)'
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
