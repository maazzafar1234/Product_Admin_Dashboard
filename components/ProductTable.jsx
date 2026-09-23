'use client';
import { useRouter } from 'next/navigation';

export default function ProductTable({ products }) {
  const router = useRouter();

  return (
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
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)}
              className="border-b hover:bg-gray-50 text-sm cursor-pointer"
            >
              <td className="p-3">
                <img src={product.thumbnail} alt={product.title} className="w-12 h-12 object-cover rounded" />
              </td>
              <td className="p-3 font-medium text-gray-900">{product.title}</td>
              <td className="p-3 text-gray-600 capitalize">{product.category}</td>
              <td className="p-3 text-gray-900">${product.price}</td>
              <td className="p-3 text-gray-600">⭐ {product.rating}</td>
              <td className="p-3 text-gray-600">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}