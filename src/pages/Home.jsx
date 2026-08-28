import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listProductsRequest,
  listCategoriesRequest,
} from "../api/products.api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import logo from "../assets/logo.jpeg";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listProductsRequest({ limit: 100 }).then((r) => r.data || []),
      listCategoriesRequest().then((cats) => cats || []),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-riseIn">
            <p className="eyebrow text-moss">
              Madeira de demolição &amp; ferro forjado
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
              Peças que carregam
              <br />
              <span className="italic text-ember">a marca do martelo.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-walnutLight">
              Cada móvel da Blanger nasce de madeira resgatada e ferro
              trabalhado à mão. Nada sai igual, as marcas e as imperfeições são
              a assinatura de quem fez.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/loja" className="btn-primary">
                Ver a coleção
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center md:max-w-md">
            <div className="absolute inset-0 rounded-full border border-walnut/20" />
            <div className="absolute inset-6 rounded-full border border-dashed border-brass/50 animate-swing" />
            <img
              src={logo}
              alt="Selo Blanger Arte Rústica"
              className="relative h-4/5 w-4/5 rounded-full object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="joinery-rule mb-8" />
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/loja?categoria=${cat.id}`}
              className="rounded-full border border-walnut/25 bg-transparent px-5 py-2 font-body text-sm font-medium text-walnut transition-colors hover:border-ember hover:text-ember"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow text-moss">Recém-forjados</p>
            <h2 className="mt-2 font-display text-3xl text-ink">
              Destaques da oficina
            </h2>
          </div>
          <Link
            to="/loja"
            className="hidden font-body text-sm font-semibold text-ember hover:text-emberDark sm:block"
          >
            Ver tudo →
          </Link>
        </div>

        {loading ? (
          <Loader label="Preparando a vitrine" />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* FAIXA DE MANIFESTO */}
      <section className="border-y border-walnut/15 bg-walnut/5">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
          {[
            {
              title: "Origem rastreada",
              text: "Madeira resgatada de demolições cadastradas — nada de desmatamento novo.",
            },
            {
              title: "Ferro forjado à mão",
              text: "Ferragens martelam-se uma a uma na bigorna, sem produção em série.",
            },
            {
              title: "Peça única",
              text: "Duas peças nunca saem exatamente iguais — e é assim que deve ser.",
            },
          ].map((item) => (
            <div key={item.title}>
              <p className="font-display text-xl italic text-ember">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-walnutLight">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
