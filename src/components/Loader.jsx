export default function Loader({ label = 'Carregando' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-walnutLight">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-walnut/20 border-t-ember" />
      <span className="eyebrow">{label}...</span>
    </div>
  );
}
