"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductFormModal from "@/components/ProductFormModal";
import ConfirmModal from "@/components/ConfirmModal";
import {
  getProducts,
  searchProducts,
  getCategories,
} from "../../services/productService";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL parameters with safe fallbacks
  const pageParam = parseInt(searchParams.get("page"), 10);
  const limitParam = parseInt(searchParams.get("limit"), 10);
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "none";

  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const currentLimit = [10, 20, 50].includes(limitParam) ? limitParam : 10;
  const skip = (currentPage - 1) * currentLimit;

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // null for Add, object for Edit
  const [productToDelete, setProductToDelete] = useState(null);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState(searchParam);
  const latestRequestId = useRef(0);

  // Helper to update URL query parameters
  const updateURL = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  // Fetch products with race-condition prevention & URL syncing
  useEffect(() => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);

    const fetchFilteredData = async () => {
      try {
        let data;
        if (searchParam) {
          data = await searchProducts(searchParam, {
            limit: currentLimit,
            skip,
          });
        } else if (categoryParam !== "all") {
          const res = await apiGetCategoryProducts(
            categoryParam,
            currentLimit,
            skip,
          );
          data = res;
        } else {
          data = await getProducts({ limit: currentLimit, skip });
        }

        if (requestId !== latestRequestId.current) return;

        let items = data.products || [];

        if (searchParam && categoryParam !== "all") {
          items = items.filter((p) => p.category === categoryParam);
        }

        if (sortParam !== "none") {
          items.sort((a, b) => {
            if (sortParam === "price-asc") return a.price - b.price;
            if (sortParam === "price-desc") return b.price - a.price;
            if (sortParam === "rating-desc") return b.rating - a.rating;
            if (sortParam === "title-asc")
              return a.title.localeCompare(b.title);
            return 0;
          });
        }

        setProducts(items);
        setTotal(data.total || items.length);
      } catch (err) {
        if (requestId === latestRequestId.current) {
          setError("Failed to load products. Please try again.");
        }
      } finally {
        if (requestId === latestRequestId.current) {
          setLoading(false);
        }
      }
    };

    fetchFilteredData();
  }, [searchParam, categoryParam, sortParam, currentPage, currentLimit, skip]);

  async function apiGetCategoryProducts(category, limit, skip) {
    const response = await fetch(
      `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`,
    );
    return await response.json();
  }

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchParam) {
        updateURL({ search: searchInput, page: 1 });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput, searchParam, updateURL]);

  const totalPages = Math.ceil(total / currentLimit) || 1;
  const startItem = total === 0 ? 0 : skip + 1;
  const endItem = Math.min(skip + currentLimit, total);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Product Admin Dashboard
        </h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
          }}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Controls: Search, Category Filter, Sort, Page Size */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border rounded-md p-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />

        <select
          value={categoryParam}
          onChange={(e) => updateURL({ category: e.target.value, page: 1 })}
          className="border rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 capitalize"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug || cat} value={cat.slug || cat}>
              {cat.name || cat}
            </option>
          ))}
        </select>

        <select
          value={sortParam}
          onChange={(e) => updateURL({ sort: e.target.value })}
          className="border rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
        >
          <option value="none">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
        </select>

        <select
          value={currentLimit}
          onChange={(e) => updateURL({ limit: e.target.value, page: 1 })}
          className="border rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      {/* States: Loading, Error, Empty */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow p-6">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b text-gray-600 text-sm">
                  <th className="p-3">Image</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="p-3">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 font-medium text-gray-900">
                      {product.title}
                    </td>
                    <td className="p-3 text-gray-600 capitalize">
                      {product.category}
                    </td>
                    <td className="p-3 text-gray-900">${product.price}</td>
                    <td className="p-3 text-gray-600">⭐ {product.rating}</td>
                    <td className="p-3 text-gray-600">{product.stock}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsFormOpen(true);
                        }}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden mb-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow flex flex-col space-y-3"
              >
                <div className="flex space-x-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {product.category}
                    </p>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="font-bold text-blue-600">
                        ${product.price}
                      </span>
                      <span className="text-gray-600">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t text-sm">
                  <span className="text-xs text-gray-500">
                    ⭐ {product.rating}
                  </span>
                  <div className="space-x-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsFormOpen(true);
                      }}
                      className="text-blue-600 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow gap-4">
            <p className="text-sm font-medium text-gray-900">
              Showing {startItem}-{endItem} of {total}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateURL({ page: currentPage - 1 })}
                disabled={currentPage <= 1}
                className="rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-gray-900">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => updateURL({ page: currentPage + 1 })}
                disabled={currentPage >= totalPages}
                className="rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {/* Modals for Add/Edit and Delete */}
      <ProductFormModal
        isOpen={isFormOpen}
        product={selectedProduct}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(formData) => {
          if (selectedProduct) {
            // EDIT mode: Update existing product in local state
            setProducts(
              products.map((p) =>
                p.id === selectedProduct.id ? { ...p, ...formData } : p,
              ),
            );
          } else {
            // ADD mode: Include the actual stock and rating from the form
            const newProduct = {
              id: Date.now(),
              ...formData,
              thumbnail:
                formData.thumbnail ||
                "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
            };
            setProducts([newProduct, ...products]);
            setTotal((prev) => prev + 1);
          }
          setIsFormOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"?`}
        onConfirm={() => {
          setProducts(products.filter((p) => p.id !== productToDelete.id));
          setTotal((prev) => Math.max(0, prev - 1));
          setProductToDelete(null);
        }}
        onClose={() => setProductToDelete(null)}
      />
    </div>
  );
}
