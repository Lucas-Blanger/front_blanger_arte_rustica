import React from "react";

export default function ReviewSummaryCard({
  summary,
  updatedAt,
  totalReviews,
}) {
  if (!summary) {
    return (
      <div className="my-6 rounded-lg border border-walnut/15 bg-amber-50/50 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-walnut">
          <span className="text-xl">✨</span>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-walnut">
            Resumo Inteligente das Avaliações
          </h3>
        </div>
        <p className="mt-2 text-xs italic text-walnutLight">
          O resumo gerado por IA será atualizado no próximo ciclo de
          processamento em segundo plano assim que novas avaliações forem
          analisadas.
        </p>
      </div>
    );
  }

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative my-8 overflow-hidden rounded-xl border border-amber-900/20 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/40 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-800/10 text-amber-900 shadow-inner">
            ✨
          </span>
          <h3 className="font-display text-base font-semibold text-walnut">
            Resumo com Inteligência Artificial
          </h3>
        </div>
        {formattedDate && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-walnutLight/80">
            Atualizado em {formattedDate}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-walnut font-serif italic">
        "{summary}"
      </p>
    </div>
  );
}
