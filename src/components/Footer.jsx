import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-walnut/15 bg-walnut text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Blanger Arte Rústica" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-lg">Blanger Arte Rústica</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
              Móveis e objetos feitos à mão em madeira de demolição e ferro forjado.
              Cada marca no material é assinatura de quem fez.
            </p>
          </div>

          <div>
            <p className="eyebrow text-brassLight">Navegação</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li><Link to="/" className="hover:text-paper">Início</Link></li>
              <li><Link to="/loja" className="hover:text-paper">Loja</Link></li>
              <li><Link to="/carrinho" className="hover:text-paper">Carrinho</Link></li>
              <li><Link to="/conta" className="hover:text-paper">Minha conta</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-brassLight">Oficina</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li>Seg. a Sex. — 8h às 18h</li>
              <li>contato@blangerarterustica.com.br</li>
              <li>(54) 99999-0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-paper/15" />
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
          © {new Date().getFullYear()} Blanger Arte Rústica — Feito à mão, peça por peça.
        </p>
      </div>
    </footer>
  );
}
