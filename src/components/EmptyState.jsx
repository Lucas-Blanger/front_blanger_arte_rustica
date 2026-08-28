export default function EmptyState({ title, description, action }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      <div className="joinery-rule w-16" />
      <h3 className="mt-2 font-display text-2xl text-walnut">{title}</h3>
      {description && <p className="text-sm text-walnutLight">{description}</p>}
      {action}
    </div>
  );
}
