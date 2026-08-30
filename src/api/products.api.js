import client from './client';

let fallbackCache = null;

async function fetchFallbackData() {
  if (fallbackCache) return fallbackCache;
  try {
    let res = await fetch('/product.json');
    if (!res.ok) {
      res = await fetch('/products.json');
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    let products = [];
    let categories = [];

    if (Array.isArray(json)) {
      products = json;
    } else if (json && typeof json === 'object') {
      products = json.products || json.data || [];
      categories = json.categories || [];
    }

    if (categories.length === 0 && products.length > 0) {
      const catMap = new Map();
      products.forEach((p) => {
        if (p.category && p.category.id) {
          catMap.set(String(p.category.id), p.category);
        }
      });
      categories = Array.from(catMap.values());
    }

    fallbackCache = { products, categories };
    return fallbackCache;
  } catch (err) {
    console.error('Erro ao buscar product.json de fallback:', err);
    return { products: [], categories: [] };
  }
}

export const listProductsRequest = async (params = {}) => {
  try {
    const r = await client.get('/products', { params });
    return r.data;
  } catch (error) {
    console.warn('API indisponível. Carregando produtos via fallback product.json:', error?.message || error);
    const { products } = await fetchFallbackData();
    let filtered = [...products];

    if (params?.categoryId) {
      filtered = filtered.filter(
        (p) =>
          String(p.categoryId) === String(params.categoryId) ||
          String(p.category?.id) === String(params.categoryId)
      );
    }

    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s) ||
          p.material?.toLowerCase().includes(s)
      );
    }

    return {
      success: true,
      data: filtered,
      pagination: {
        total: filtered.length,
        page: 1,
        limit: params?.limit || filtered.length,
        pages: 1,
      },
    };
  }
};

export const getProductRequest = async (id) => {
  try {
    const r = await client.get(`/products/${id}`);
    return r.data.data;
  } catch (error) {
    console.warn(`API indisponível. Carregando produto ${id} via fallback product.json:`, error?.message || error);
    const { products } = await fetchFallbackData();
    const product = products.find(
      (p) => String(p.id) === String(id) || String(p.slug) === String(id)
    );
    if (!product) {
      throw error;
    }
    return product;
  }
};

export const listCategoriesRequest = async () => {
  try {
    const r = await client.get('/products/categories');
    return r.data.data;
  } catch (error) {
    console.warn('API indisponível. Carregando categorias via fallback product.json:', error?.message || error);
    const { categories } = await fetchFallbackData();
    return categories;
  }
};

