import React from 'react';
import '../../styles/Badge.css';

export default function Badge({ type, variant = 'default', children }) {
  const className = [
    'badge',
    type ? `badge-${type}` : '',
    variant ? `badge-${variant}` : '',
  ].filter(Boolean).join(' ');

  return <span className={className}>{children}</span>;
}
