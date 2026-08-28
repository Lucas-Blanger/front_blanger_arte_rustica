import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProductReviewsRequest, createReviewRequest } from "../api/reviews.api";
import ReviewSummaryCard from "./ReviewSummaryCard";
import Loader from "./Loader";

function StarRatingInput({ rating, setRating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => setRating(star)}
          className={`text-2xl transition-transform hover:scale-110 ${
            star <= rating ? "text-amber-500" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 font-mono text-xs text-walnutLight">
        {rating} {rating === 1 ? "estrela" : "estrelas"}
      </span>
    </div>
  );
}

function StarDisplay({ count }) {
  return (
    <div className="flex text-amber-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= count ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductReviewsSection({ productId }) {
  const { isAuthenticated, user } = useAuth();

  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getProductReviewsRequest(productId);
      setReviewsData(data);
    } catch (err) {
      console.error("Erro ao carregar avaliações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg("Por favor, escreva um comentário com pelo menos 5 caracteres.");
      return;
    }

    try {
      setSubmitting(true);
      await createReviewRequest(productId, { rating, comment });
      setSuccessMsg("Avaliação enviada com sucesso! Ela foi salva normalmente no banco de dados.");
      setComment("");
      setRating(5);
      await fetchReviews();
    } catch (err) {
      setErrorMsg(err.message || "Erro ao publicar avaliação.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !reviewsData) {
    return <Loader label="Carregando avaliações..." />;
  }

  const {
    reviewSummary,
    reviewSummaryUpdatedAt,
    totalReviews = 0,
    averageRating = 0,
    reviews = [],
  } = reviewsData || {};

  return (
    <section className="mt-16 border-t border-walnut/15 pt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-walnut">
            Avaliações dos Clientes
          </h2>
          <div className="mt-1 flex items-center gap-3">
            <StarDisplay count={Math.round(averageRating)} />
            <span className="font-mono text-sm font-semibold text-walnut">
              {averageRating > 0 ? `${averageRating} de 5.0` : "Sem avaliações ainda"}
            </span>
            <span className="font-mono text-xs text-walnutLight">
              ({totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"})
            </span>
          </div>
        </div>
      </div>

      {/* Card de Resumo de IA (Gerado Assincronamente) */}
      <ReviewSummaryCard
        summary={reviewSummary}
        updatedAt={reviewSummaryUpdatedAt}
        totalReviews={totalReviews}
      />

      {/* Formulário de Envio de Avaliação */}
      <div className="my-8 rounded-lg border border-walnut/10 bg-paper/60 p-6 shadow-sm">
        <h3 className="font-display text-base font-semibold text-walnut">
          Escrever uma avaliação
        </h3>

        {!isAuthenticated ? (
          <p className="mt-2 text-sm text-walnutLight">
            Você precisa estar conectado para avaliar este produto.
          </p>
        ) : (
          <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
            <div>
              <label className="block mb-1 font-mono text-xs uppercase tracking-wider text-walnut">
                Sua Nota
              </label>
              <StarRatingInput rating={rating} setRating={setRating} />
            </div>

            <div>
              <label className="block mb-1 font-mono text-xs uppercase tracking-wider text-walnut">
                Seu Comentário
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte o que achou da qualidade, material e acabamento..."
                className="w-full rounded-md border border-walnut/20 bg-white p-3 text-sm text-walnut placeholder-walnutLight/60 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-red-600">{errorMsg}</p>
            )}

            {successMsg && (
              <p className="text-xs font-semibold text-emerald-700">{successMsg}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50"
            >
              {submitting ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </form>
        )}
      </div>

      {/* Lista de Avaliações */}
      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm italic text-walnutLight py-4">
            Seja o primeiro a avaliar esta peça artesanal!
          </p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-md border border-walnut/10 bg-white p-4 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarDisplay count={rev.rating} />
                  <span className="font-semibold text-sm text-walnut">
                    {rev.user?.name || "Cliente"}
                  </span>
                </div>
                <span className="font-mono text-xs text-walnutLight">
                  {new Date(rev.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-walnutLight">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
