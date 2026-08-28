import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-7xl italic text-ember">404</p>
      <h1 className="mt-4 font-display text-2xl text-ink">Essa trilha não leva a lugar nenhum</h1>
      <p className="mt-2 text-sm text-walnutLight">
        A página que você procura foi removida ou nunca existiu na oficina.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Voltar para o início
      </Link>
    </div>
  );
}
