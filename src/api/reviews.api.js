import client from "./client";

export async function getProductReviewsRequest(productId) {
  const { data } = await client.get(`/products/${productId}/reviews`);
  return data.data;
}

export async function createReviewRequest(productId, { rating, comment }) {
  const { data } = await client.post(`/products/${productId}/reviews`, {
    rating,
    comment,
  });
  return data;
}

export async function triggerSummaryRequest(productId) {
  const { data } = await client.post(`/products/${productId}/reviews/summarize`);
  return data;
}
