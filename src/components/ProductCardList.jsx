'use client';
import { useRouter } from 'next/navigation';

export default function ProductCardList({ products }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 md:hidden mb-4">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => router.push(`/products/${product.id}`)}
          className="bg-white p-4 rounded-lg shadow flex space-x-4 cursor-pointer hover:bg-gray-50"
        >
          <img src={product.thumbnail} alt={product.title} className="w-20 h-20 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{product.title}</h3>
            <p className="text-xs text-gray-500 capitalize">{product.category}</p>
            <div className="flex justify-between mt-2 text-sm">
              <span className="font-bold text-blue-600">${product.price}</span>
              <span className="text-gray-600">Stock: {product.stock}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">⭐ {product.rating}</div>
          </div>
        </div>
      ))}
    </div>
  );
}