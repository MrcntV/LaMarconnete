import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiGet, apiDelete } from '../api';
import { Product } from '../types';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    apiGet('/api/products')
      .then((data: unknown) => setProducts(Array.isArray(data) ? data as Product[] : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiDelete(`/api/products/${deleteId}`);
      setProducts(p => p.filter(p => p.id !== deleteId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const categories = Array.from(new Set(products.map(p => p.categorie).filter((c): c is string => Boolean(c))));

  const filtered = products.filter(p => {
    const matchSearch = !search || p.Titre.toLowerCase().includes(search.toLowerCase()) || (p.reference || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.categorie === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Produits</h2>
        <button className="btn btn-primary" onClick={() => navigate('/products/new')}>
          <FaPlus /> Ajouter un produit
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <input
          type="text"
          className="input"
          placeholder="Rechercher par nom ou référence..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Référence</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="table-loading">Chargement...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="table-empty">Aucun produit trouvé</td></tr>
              ) : (
                filtered.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.ImageProduit ? (
                        <img src={product.ImageProduit} alt={product.Titre} className="product-thumb" />
                      ) : (
                        <div className="product-thumb-placeholder">—</div>
                      )}
                    </td>
                    <td className="font-medium">{product.Titre}</td>
                    <td className="text-muted">{product.reference || '—'}</td>
                    <td>{product.Prix.toFixed(2)} €</td>
                    <td>
                      <span className={(product.stock || 0) < (product.stockAlert || 5) ? 'text-warning font-medium' : ''}>
                        {product.stock ?? '—'}
                      </span>
                    </td>
                    <td>{product.categorie || '—'}</td>
                    <td><Badge status={product.active ? 'active' : 'inactive'} /></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/products/${product.id}`)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(product.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
      />
    </div>
  );
};

export default Products;
