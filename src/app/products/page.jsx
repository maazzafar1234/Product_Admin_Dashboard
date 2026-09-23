"use client";
import { useState, useEffect } from "react";
import { getProducts, getCategories } from "@/services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductsData = async () => {
    try {
      setError(null);
      const data = await getProducts({ limit: 10, skip: 0 });
      setProducts(data.products);
      const catData = await getCategories();
      setCategories(catData);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchProductsData}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Product List</h2>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-600 text-sm">
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Stock</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Hidden on desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow flex space-x-4"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{product.title}</h3>
              <p className="text-xs text-gray-500 capitalize">
                {product.category}
              </p>
              <div className="flex justify-between mt-2 text-sm">
                <span className="font-bold text-blue-600">
                  ${product.price}
                </span>
                <span className="text-gray-600">Stock: {product.stock}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ⭐ {product.rating}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
