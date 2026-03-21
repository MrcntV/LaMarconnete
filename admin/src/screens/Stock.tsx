import React, { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { apiGet, apiPut } from '../api';
import { StockItem } from '../types';

type FilterType = 'all' | 'low' | 'out';

const Stock: React.FC = () => {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editValues, setEditValues] = useState<Record<string, { stock: string; stockAlert: string }>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = () => {
    setLoading(true);
    apiGet('/api/stock')
      .then((data: unknown) => {
        const stockData = Array.isArray(data) ? data as StockItem[] : [];
        setItems(stockData);
        const initial: Record<string, { stock: string; stockAlert: string }> = {};
        stockData.forEach(item => {
          initial[item.id] = { stock: String(item.stock), stockAlert: String(item.stockAlert || 5) };
        });
        setEditValues(initial);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const getStatus = (item: StockItem): 'out' | 'low' | 'ok' => {
    if (item.stock === 0) return 'out';
    if (item.stock < (item.stockAlert || 5)) return 'low';
    return 'ok';
  };

  const saveStock = async (productId: string) => {
    const vals = editValues[productId];
    if (!vals) return;
    setSaving(s => ({ ...s, [productId]: true }));
    try {
      await apiPut(`/api/stock/${productId}`, {
        stock: parseInt(vals.stock, 10),
        stockAlert: parseInt(vals.stockAlert, 10)
      });
      setItems(prev => prev.map(item =>
        item.id === productId
          ? { ...item, stock: parseInt(vals.stock, 10), stockAlert: parseInt(vals.stockAlert, 10) }
          : item
      ));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(s => ({ ...s, [productId]: false }));
    }
  };

  const filtered = items.filter(item => {
    if (filter === 'out') return item.stock === 0;
    if (filter === 'low') return item.stock > 0 && item.stock < (item.stockAlert || 5);
    return true;
  });

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Gestion du stock</h2>
        <div className="alert-summary">
          <span className="badge badge-red">{items.filter(i => i.stock === 0).length} en rupture</span>
          <span className="badge badge-yellow">{items.filter(i => i.stock > 0 && i.stock < (i.stockAlert || 5)).length} stock bas</span>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="status-tabs">
        {(['all', 'low', 'out'] as FilterType[]).map(f => (
          <button
            key={f}
            className={`tab-btn ${filter === f ? 'tab-btn-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Tous' : f === 'low' ? 'Stock bas' : 'Rupture'}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Produit</th>
                <th>Référence</th>
                <th>Stock actuel</th>
                <th>Seuil d'alerte</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="table-loading">Chargement...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="table-empty">Aucun produit</td></tr>
              ) : (
                filtered.map(item => {
                  const status = getStatus(item);
                  const vals = editValues[item.id] || { stock: String(item.stock), stockAlert: String(item.stockAlert || 5) };
                  return (
                    <tr key={item.id}>
                      <td>
                        {item.ImageProduit ? (
                          <img src={item.ImageProduit} alt={item.Titre} className="product-thumb" />
                        ) : <span>—</span>}
                      </td>
                      <td className="font-medium">{item.Titre}</td>
                      <td className="text-muted">{item.reference || '—'}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className={`input input-sm ${status !== 'ok' ? 'input-warning' : ''}`}
                          value={vals.stock}
                          onChange={e => setEditValues(prev => ({ ...prev, [item.id]: { ...vals, stock: e.target.value } }))}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="input input-sm"
                          value={vals.stockAlert}
                          onChange={e => setEditValues(prev => ({ ...prev, [item.id]: { ...vals, stockAlert: e.target.value } }))}
                        />
                      </td>
                      <td><Badge status={status} /></td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => saveStock(item.id)}
                          disabled={saving[item.id]}
                        >
                          {saving[item.id] ? '...' : 'Sauvegarder'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stock;
