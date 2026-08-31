import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PriceTag from "./PriceTag";

// Quando não há foto do produto, mostramos um "carimbo" com a inicial
function ProductStamp({ name }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-walnut via-walnutLight to-walnut">
      <span className="font-display text-6xl italic text-paper/25">
        {initial}
      </span>
    </div>
  );
}

export default function ProductCard({ product, className = "" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className={`hang-tag group relative flex flex-col justify-between overflow-hidden pt-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      <Link to={`/produtos/${product.id}`} className="block">
        <div className="relative mx-4 mb-4 aspect-square overflow-hidden rounded-sm border border-walnut/10">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ProductStamp name={product.name} />
          )}

          {outOfStock && (
            <span className="absolute right-2 top-2 rounded-sm bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-paper">
              Esgotado
            </span>
          )}
        </div>

        <div className="space-y-1.5 px-4">
          {product.category?.name && (
            <p className="eyebrow text-moss">{product.category.name}</p>
          )}
          <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-ember">
            {product.name}
          </h3>
          {product.material && (
            <p className="text-xs text-walnutLight">{product.material}</p>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-2.5 px-4 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <PriceTag value={product.price} size="sm" />
        <button
          type="button"
          onClick={handleBuy}
          disabled={outOfStock}
          className={`w-full sm:w-auto text-center shrink-0 rounded-sm px-3 py-1.5 font-body text-xs font-medium transition-all ${
            added
              ? "bg-moss text-paper"
              : outOfStock
                ? "cursor-not-allowed bg-walnut/10 text-walnutLight"
                : "bg-ember text-paper shadow-sm hover:bg-emberDark"
          }`}
        >
          {added ? "Adicionado ✓" : outOfStock ? "Esgotado" : "Comprar"}
        </button>
      </div>
    </div>
  );
}
