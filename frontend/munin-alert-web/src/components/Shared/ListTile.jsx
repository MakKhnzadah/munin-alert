import React from 'react';
import './ListTile.css';

/**
 * ListTile - rounded gray tile with icon + label
 * Props:
 * - icon: ReactNode (emoji or icon component)
 * - label: string
 * - onClick: function
 */
export default function ListTile({ icon, label, onClick }) {
  return (
    <div className="listTile" role="button" tabIndex={0} onClick={onClick}>
      <span className="listTile-icon" aria-hidden>{icon}</span>
      <span className="listTile-label">{label}</span>
    </div>
  );
}
