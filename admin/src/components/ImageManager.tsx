import React, { useEffect, useRef, useState } from 'react';

const BASE = process.env.REACT_APP_API_URL || '';

interface Props {
  productId: string;           // identifiant du dossier produit (ex: "12345614")
  selected: string[];          // chemins actuellement sélectionnés (ImagesSupplementaires)
  featured: string;            // image principale (ImageProduit)
  featuredHover: string;       // image survol (ImageProduitSup)
  onChangeSelected: (paths: string[]) => void;
  onChangeFeatured: (path: string) => void;
  onChangeFeaturedHover: (path: string) => void;
}

const ImageManager: React.FC<Props> = ({
  productId, selected, featured, featuredHover,
  onChangeSelected, onChangeFeatured, onChangeFeaturedHover,
}) => {
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem('admin_token');

  const allPaths = Array.from(new Set([
    ...gallery,
    ...selected,
    ...(featured ? [featured] : []),
    ...(featuredHover ? [featuredHover] : []),
  ]));

  const load = () => {
    if (!productId) return;
    fetch(`${BASE}/api/media/product/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setGallery)
      .catch(() => {});
  };

  useEffect(() => { load(); }, [productId]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !productId) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('image', file);
      try {
        const res = await fetch(`${BASE}/api/media/product/${productId}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const data = await res.json();
        if (res.ok) setGallery(prev => [...prev, data.path]);
      } catch {}
    }
    setUploading(false);
  };

  const handleDelete = async (imgPath: string) => {
    if (!window.confirm('Supprimer cette image ?')) return;
    setDeleting(imgPath);
    try {
      await fetch(`${BASE}/api/media`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: imgPath }),
      });
      setGallery(prev => prev.filter(p => p !== imgPath));
      if (featured === imgPath) onChangeFeatured('');
      if (featuredHover === imgPath) onChangeFeaturedHover('');
      onChangeSelected(selected.filter(p => p !== imgPath));
    } catch {}
    setDeleting(null);
  };

  const toggleSelected = (imgPath: string) => {
    if (selected.includes(imgPath)) {
      onChangeSelected(selected.filter(p => p !== imgPath));
    } else {
      onChangeSelected([...selected, imgPath]);
    }
  };

  const imageUrl = (p: string) => p.startsWith('http') ? p : `${BASE}${p}`;

  return (
    <div>
      {/* Bouton upload */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <label
          htmlFor="img-mgr-upload"
          className="btn btn-primary"
          style={{ cursor: 'pointer' }}
        >
          {uploading ? 'Upload en cours...' : '+ Ajouter des images'}
        </label>
        <input
          id="img-mgr-upload"
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleUpload(e.target.files)}
          disabled={uploading || !productId}
        />
        {!productId && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Enregistrez d'abord le produit pour uploader des images.
          </span>
        )}
      </div>

      {/* Légende */}
      {allPaths.length > 0 && (
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
          <span><span style={{ background: '#fbbf24', borderRadius: 3, padding: '1px 5px' }}>★</span> Image principale</span>
          <span><span style={{ background: '#a78bfa', borderRadius: 3, padding: '1px 5px' }}>◈</span> Image survol</span>
          <span><span style={{ background: '#34d399', borderRadius: 3, padding: '1px 5px' }}>✓</span> Galerie (fiche produit)</span>
        </div>
      )}

      {/* Grille images */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
        {allPaths.map(imgPath => {
          const isFeatured = featured === imgPath;
          const isHover = featuredHover === imgPath;
          const isSelected = selected.includes(imgPath);
          const isDeleting = deleting === imgPath;

          let borderColor = 'var(--border)';
          if (isFeatured) borderColor = '#fbbf24';
          else if (isHover) borderColor = '#a78bfa';
          else if (isSelected) borderColor = '#34d399';

          return (
            <div
              key={imgPath}
              style={{
                border: `2px solid ${borderColor}`,
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
                background: '#f8fafc',
                opacity: isDeleting ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <img
                src={imageUrl(imgPath)}
                alt=""
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
              />

              {/* Badges actifs */}
              <div style={{ position: 'absolute', top: 4, left: 4, display: 'flex', gap: 3 }}>
                {isFeatured && <span style={{ background: '#fbbf24', borderRadius: 3, padding: '1px 4px', fontSize: 10, fontWeight: 700 }}>★</span>}
                {isHover && <span style={{ background: '#a78bfa', borderRadius: 3, padding: '1px 4px', fontSize: 10, fontWeight: 700 }}>◈</span>}
                {isSelected && <span style={{ background: '#34d399', borderRadius: 3, padding: '1px 4px', fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>

              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={() => handleDelete(imgPath)}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 'none', borderRadius: '50%', width: 20, height: 20,
                  cursor: 'pointer', fontSize: 12, lineHeight: '20px', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>

              {/* Actions */}
              <div style={{ padding: '4px 4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <button
                  type="button"
                  onClick={() => onChangeFeatured(isFeatured ? '' : imgPath)}
                  style={{
                    fontSize: 10, padding: '3px 6px', borderRadius: 4, border: 'none',
                    cursor: 'pointer', fontWeight: 600,
                    background: isFeatured ? '#fbbf24' : '#f1f5f9',
                    color: isFeatured ? '#92400e' : 'var(--text)',
                  }}
                >★ Principale</button>
                <button
                  type="button"
                  onClick={() => onChangeFeaturedHover(isHover ? '' : imgPath)}
                  style={{
                    fontSize: 10, padding: '3px 6px', borderRadius: 4, border: 'none',
                    cursor: 'pointer', fontWeight: 600,
                    background: isHover ? '#a78bfa' : '#f1f5f9',
                    color: isHover ? '#4c1d95' : 'var(--text)',
                  }}
                >◈ Survol</button>
                <button
                  type="button"
                  onClick={() => toggleSelected(imgPath)}
                  style={{
                    fontSize: 10, padding: '3px 6px', borderRadius: 4, border: 'none',
                    cursor: 'pointer', fontWeight: 600,
                    background: isSelected ? '#34d399' : '#f1f5f9',
                    color: isSelected ? '#064e3b' : 'var(--text)',
                  }}
                >✓ Galerie</button>
              </div>
            </div>
          );
        })}
      </div>

      {allPaths.length === 0 && !uploading && (
        <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          Aucune image. Cliquez sur "+ Ajouter des images" pour commencer.
        </p>
      )}
    </div>
  );
};

export default ImageManager;
