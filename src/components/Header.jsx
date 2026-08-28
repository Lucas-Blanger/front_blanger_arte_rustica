import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/loja', label: 'Loja' },
];

export default function Header() {
  const { totalQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-walnut/15 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <img
            src={logo}
            alt="Blanger Arte Rústica"
            className="h-12 w-12 rounded-full object-cover animate-swing origin-top"
          />
          <div className="hidden leading-none sm:block">
            <span className="block font-display text-lg tracking-wide text-ink">Blanger</span>
            <span className="eyebrow">Arte Rústica</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-body text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-ember' : 'text-walnut hover:text-ember'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={isAuthenticated ? '/conta' : '/entrar'}
            className="hidden font-body text-sm font-medium text-walnut hover:text-ember sm:block"
          >
            {isAuthenticated ? `Olá, ${user?.name?.split(' ')[0]}` : 'Entrar'}
          </Link>

          <Link
            to="/carrinho"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-walnut/25 text-walnut transition-colors hover:border-ember hover:text-ember"
            aria-label="Carrinho"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.5 6h11" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="17" cy="21" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ember font-mono text-[10px] font-semibold text-paper">
                {totalQuantity}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-walnut/25 text-walnut md:hidden"
            aria-label="Abrir menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-walnut/15 bg-paper md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-sm px-2 py-2.5 font-body text-sm font-medium text-walnut hover:bg-walnut/5"
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={isAuthenticated ? '/conta' : '/entrar'}
              onClick={() => setMenuOpen(false)}
              className="rounded-sm px-2 py-2.5 font-body text-sm font-medium text-walnut hover:bg-walnut/5"
            >
              {isAuthenticated ? 'Minha conta' : 'Entrar'}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
