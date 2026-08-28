import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PriceTag from '../components/PriceTag';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/formatPrice';

function ProductThumb({ item }) {
  const initial = item.name?.charAt(0)?.toUpperCase() || '?';
  return item.imageUrl ? (
    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-walnut via-walnutLight to-walnut">
      <span className="font-display text-2xl italic text-paper/30">{initial}</span>
    </div>
  );
}

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Seu carrinho está vazio"
        description="Que tal dar uma olhada nas peças da oficina?"
        action={
          <Link to="/loja" className="btn-primary mt-2">
            Ir para a loja
          </Link>
        }
      />
    );
  }

  const shippingEstimate = 25;
  const total = subtotal + shippingEstimate;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow text-moss">Seu carrinho</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Revise suas peças</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="divide-y divide-walnut/10 border-y border-walnut/15">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 py-5">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-walnut/15">
                <ProductThumb item={item} />
              </div>

              <div className="flex-1">
                <p className="font-display text-lg text-ink">{item.name}</p>
                <p className="mt-1 font-mono text-xs text-walnutLight">{formatPrice(item.price)} / un.</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-sm border border-walnut/25">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="h-8 w-8 text-walnut hover:text-ember"
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="h-8 w-8 text-walnut hover:text-ember"
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="font-mono text-[11px] uppercase tracking-widest text-walnutLight hover:text-ember"
                  >
                    Remover
                  </button>
                </div>
              </div>

              <PriceTag value={item.price * item.quantity} size="sm" />
            </div>
          ))}
        </div>

        <div className="h-fit rounded-sm border border-walnut/15 bg-[#F7F2E6] p-6">
          <h2 className="font-display text-xl text-ink">Resumo</h2>
          <div className="mt-5 space-y-3 text-sm text-walnutLight">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete estimado</span>
              <span className="font-mono text-ink">{formatPrice(shippingEstimate)}</span>
            </div>
          </div>
          <div className="joinery-rule my-5" />
          <div className="flex justify-between font-display text-lg text-ink">
            <span>Total</span>
            <PriceTag value={total} size="md" />
          </div>

          <Link to="/checkout" className="btn-primary mt-6 w-full">
            Finalizar compra
          </Link>
          <Link to="/loja" className="btn-ghost mt-2 w-full">
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
