import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProductsRequest, listCategoriesRequest } from '../api/products.api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria') || '';
  const busca = searchParams.get('busca') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(busca);

  // Sincroniza busca externa (URL) se mudou
  useEffect(() => {
    setSearchInput(busca);
  }, [busca]);

  // Atualiza automaticamente a busca na URL enquanto o usuário digita (debounce de 250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== busca) {
        const next = new URLSearchParams(searchParams);
        if (searchInput.trim()) {
          next.set('busca', searchInput.trim());
        } else {
          next.delete('busca');
        }
        setSearchParams(next, { replace: true });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput, busca, searchParams, setSearchParams]);

  useEffect(() => {
    listCategoriesRequest()
      .then((cats) => setCategories(cats || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    listProductsRequest({
      categoryId: categoria || undefined,
      search: busca || undefined,
      limit: 100, // Puxa todos os produtos da API
    })
      .then((res) => {
        setProducts(res.data || []);
        setPagination(res.pagination || null);
      })
      .catch(() => {
        setProducts([]);
        setPagination(null);
      })
      .finally(() => setLoading(false));
  }, [categoria, busca]);

  const activeCategoryName = useMemo(
    () => categories.find((c) => c.id === categoria)?.name,
    [categories, categoria]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set('busca', searchInput.trim());
    else next.delete('busca');
    setSearchParams(next);
  };

  const setCategory = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id) next.set('categoria', id);
    else next.delete('categoria');
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-2 flex flex-col gap-1">
        <p className="eyebrow text-moss">Catálogo completo</p>
        <h1 className="font-display text-4xl text-ink">
          {activeCategoryName ? activeCategoryName : 'A loja'}
        </h1>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-walnut/15 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
              !categoria
                ? 'border-ember bg-ember text-paper'
                : 'border-walnut/25 text-walnut hover:border-ember hover:text-ember'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
                categoria === cat.id
                  ? 'border-ember bg-ember text-paper'
                  : 'border-walnut/25 text-walnut hover:border-ember hover:text-ember'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xs gap-2 sm:w-64">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar peça..."
            className="field-input"
          />
          <button type="submit" className="btn-secondary px-4 py-2.5">
            Buscar
          </button>
        </form>
      </div>

      <div className="mt-10">
        {loading ? (
          <Loader label="Buscando peças" />
        ) : products.length === 0 ? (
          <EmptyState
            title="Nenhuma peça encontrada"
            description="Tente outra categoria ou termo de busca."
          />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <p className="mt-8 text-center font-mono text-xs uppercase tracking-widest text-walnutLight">
          Página {pagination.page} de {pagination.pages} — {pagination.total} peças
        </p>
      )}
    </div>
  );
}
