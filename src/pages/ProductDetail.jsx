import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductRequest } from '../api/products.api';
import { useCart } from '../context/CartContext';
import PriceTag from '../components/PriceTag';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

function ProductStamp({ name }) {
  const initial = name?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-walnut via-walnutLight to-walnut">
      <span className="font-display text-8xl italic text-paper/25">{initial}</span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setAdded(false);
    setQuantity(1);

    getProductRequest(id)
      .then((p) => setProduct(p))
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Buscando a peça" />;

  if (notFound || !product) {
    return (
      <EmptyState
        title="Peça não encontrada"
        description="Ela pode ter sido vendida ou removida do catálogo."
        action={
          <Link to="/loja" className="btn-primary mt-2">
            Voltar para a loja
          </Link>
        }
      />
    );
  }

  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-walnutLight hover:text-ember"
      >
        ← Voltar
      </button>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="hang-tag overflow-hidden pt-6">
          <div className="mx-4 mb-4 aspect-square overflow-hidden rounded-sm border border-walnut/10">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <ProductStamp name={product.name} />
            )}
          </div>
        </div>

        <div>
          {product.category?.name && <p className="eyebrow text-moss">{product.category.name}</p>}
          <h1 className="mt-2 font-display text-4xl leading-tight text-ink">{product.name}</h1>

          {product.material && (
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-brass">
              {product.material}
            </p>
          )}

          <div className="mt-6">
            <PriceTag value={product.price} size="lg" />
          </div>

          <div className="joinery-rule my-6" />

          <p className="text-sm leading-relaxed text-walnutLight">{product.description}</p>

          <div className="mt-8">
            {outOfStock ? (
              <p className="rounded-sm border border-ink/20 bg-ink/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink">
                Peça esgotada no momento
              </p>
            ) : (
              <>
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-walnutLight">
                  {product.stock} em estoque
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-sm border border-walnut/25">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-11 w-11 font-display text-lg text-walnut hover:text-ember"
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-mono text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="h-11 w-11 font-display text-lg text-walnut hover:text-ember"
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>

                  <button onClick={handleAddToCart} className="btn-primary">
                    {added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
