"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getProductById } from "@/services/productService";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The product you are looking for does not exist or has an incorrect ID.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.push("/products")}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        &larr; Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-80 object-cover rounded-lg border mb-4"
          />
          <div className="flex gap-2 overflow-x-auto">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                className="w-16 h-16 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">
            {product.title}
          </h1>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            ${product.price}
          </p>
          <p className="text-gray-600 text-sm mb-6">{product.description}</p>

          <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Rating:</span> ⭐ {product.rating}
            </p>
            <p>
              <span className="font-semibold">Stock Available:</span>{" "}
              {product.stock}
            </p>
            <p>
              <span className="font-semibold">Brand:</span>{" "}
              {product.brand || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {review.reviewerName}
                  </span>
                  <span className="text-xs text-gray-500">
                    ⭐ {review.rating}/5
                  </span>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No reviews available for this product.
          </p>
        )}
      </div>
    </div>
  );
}
