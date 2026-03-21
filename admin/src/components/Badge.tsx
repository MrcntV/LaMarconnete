import React from 'react';

type BadgeVariant = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'failed' | 'draft' | 'sent' | 'low' | 'out' | 'ok' | 'active' | 'inactive';

interface BadgeProps {
  status: BadgeVariant | string;
  label?: string;
}

const labelMap: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  paid: 'Payée',
  failed: 'Échec',
  draft: 'Brouillon',
  sent: 'Envoyée',
  low: 'Stock bas',
  out: 'Rupture',
  ok: 'OK',
  active: 'Actif',
  inactive: 'Inactif'
};

const colorMap: Record<string, string> = {
  pending: 'badge-yellow',
  confirmed: 'badge-blue',
  shipped: 'badge-purple',
  delivered: 'badge-green',
  cancelled: 'badge-red',
  paid: 'badge-green',
  failed: 'badge-red',
  draft: 'badge-gray',
  sent: 'badge-blue',
  low: 'badge-yellow',
  out: 'badge-red',
  ok: 'badge-green',
  active: 'badge-green',
  inactive: 'badge-gray'
};

const Badge: React.FC<BadgeProps> = ({ status, label }) => {
  const colorClass = colorMap[status] || 'badge-gray';
  const displayLabel = label || labelMap[status] || status;
  return <span className={`badge ${colorClass}`}>{displayLabel}</span>;
};

export default Badge;
