import React, { useState } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  keyField?: string;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Rechercher...',
  pageSize = 15,
  onRowClick,
  emptyMessage = 'Aucune donnée',
  keyField = 'id'
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = searchable && search
    ? data.filter(row =>
        Object.values(row).some(v =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="data-table-wrapper">
      {searchable && (
        <div className="data-table-toolbar">
          <input
            type="text"
            className="input search-input"
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      )}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="table-loading">Chargement...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={columns.length} className="table-empty">{emptyMessage}</td></tr>
            ) : (
              paginated.map((row, idx) => (
                <tr
                  key={String(row[keyField]) || idx}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'row-clickable' : ''}
                >
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-sm btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            &larr; Préc.
          </button>
          <span className="pagination-info">Page {page} / {totalPages} ({filtered.length} résultats)</span>
          <button
            className="btn btn-sm btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Suiv. &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
