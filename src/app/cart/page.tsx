'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Items</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-4">
                    <div className="flex items-center">
                      <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md mr-4" />
                      <div>
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-gray-600">{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 text-center border border-gray-300 rounded-md mr-4"
                      />
                      <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{getTotal()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹100.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{(parseFloat(getTotal().replace(/[^0-9.-]+/g, "")) + 100).toFixed(2)}</span>
            </div>
            <button onClick={() => router.push('/checkout')} className="bg-gray-800 text-white font-bold py-3 px-6 rounded-full w-full mt-8 hover:bg-gray-700">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
  export default CartPage;