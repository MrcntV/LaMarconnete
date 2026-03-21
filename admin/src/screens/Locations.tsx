import React, { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import { Location } from '../types';

const emptyLocation: Partial<Location> = {
  name: '', address: '', city: '', postalCode: '', département: '',
  phone: '', email: '', schedule: '', image: '', lat: undefined, lng: undefined, active: true
};

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Partial<Location> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    setLoading(true);
    apiGet('/api/locations/all')
      .then((data: unknown) => setLocations(Array.isArray(data) ? data as Location[] : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleNew = () => {
    setSelected({ ...emptyLocation });
    setIsNew(true);
  };

  const handleEdit = (loc: Location) => {
    setSelected({ ...loc });
    setIsNew(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      if (isNew) {
        const created = await apiPost('/api/locations', selected) as Location;
        setLocations(l => [...l, created]);
      } else {
        const updated = await apiPut(`/api/locations/${selected.id}`, selected) as Location;
        setLocations(l => l.map(loc => loc.id === updated.id ? updated : loc));
      }
      setSelected(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiDelete(`/api/locations/${deleteId}`);
      setLocations(l => l.map(loc => loc.id === deleteId ? { ...loc, active: false } : loc));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const set = (field: keyof Location, value: unknown) => {
    setSelected(s => s ? { ...s, [field]: value } : s);
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Points de vente</h2>
        <button className="btn btn-primary" onClick={handleNew}>+ Ajouter un point de vente</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="locations-layout">
        <div className="locations-list card">
          {loading ? (
            <p className="loading-text">Chargement...</p>
          ) : locations.length === 0 ? (
            <p className="empty-text">Aucun point de vente</p>
          ) : (
            locations.map(loc => (
              <div key={loc.id} className={`location-item ${!loc.active ? 'location-inactive' : ''}`}>
                <div className="location-info">
                  <p className="font-medium">{loc.name}</p>
                  <p className="text-muted text-sm">{loc.address}, {loc.postalCode} {loc.city}</p>
                  {loc.phone && <p className="text-sm">{loc.phone}</p>}
                  <Badge status={loc.active ? 'active' : 'inactive'} />
                </div>
                <div className="location-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(loc)}>Modifier</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(loc.id)}>Désactiver</button>
                </div>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="card">
            <h3 className="card-section-title">{isNew ? 'Nouveau point de vente' : 'Modifier'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input className="input" value={selected.name || ''} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Adresse *</label>
                <input className="input" value={selected.address || ''} onChange={e => set('address', e.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ville *</label>
                  <input className="input" value={selected.city || ''} onChange={e => set('city', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Code postal *</label>
                  <input className="input" value={selected.postalCode || ''} onChange={e => set('postalCode', e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Département (ex: 42, 06, 69)</label>
                <input className="input" value={selected.département || ''} onChange={e => set('département', e.target.value)} placeholder="42" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input className="input" value={selected.phone || ''} onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="input" value={selected.email || ''} onChange={e => set('email', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Horaires</label>
                <input className="input" value={selected.schedule || ''} onChange={e => set('schedule', e.target.value)} placeholder="Lun-Ven 9h-19h" />
              </div>
              <div className="form-group">
                <label className="form-label">Image (chemin relatif)</label>
                <input className="input" value={selected.image || ''} onChange={e => set('image', e.target.value)} placeholder="./images/PointsDeVentes/photo.jpg" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input type="number" step="any" className="input" value={selected.lat || ''} onChange={e => set('lat', parseFloat(e.target.value) || undefined)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input type="number" step="any" className="input" value={selected.lng || ''} onChange={e => set('lng', parseFloat(e.target.value) || undefined)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-check">
                  <input type="checkbox" checked={selected.active !== false} onChange={e => set('active', e.target.checked)} />
                  <span>Point de vente actif</span>
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Désactiver le point de vente"
        message="Ce point de vente sera désactivé et ne s'affichera plus sur le site."
        confirmLabel="Désactiver"
        danger
      />
    </div>
  );
};

export default Locations;
