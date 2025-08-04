import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  subcategory: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-200 h-64 w-full flex items-center justify-center relative">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.category} - {product.subcategory}</p>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">{product.price}</span>
          <Link href={`/products/${product.id}`} className="bg-gray-800 text-white px-4 py-2 rounded-full font-bold hover:bg-gray-700">View</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;