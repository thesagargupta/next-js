'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const { cart, getTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    billingAddress: '',
    shippingAddress: '',
    pincode: '',
    paymentOption: 'Razorpay',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    try {
      // Step 1: Process Payment (Mock)
      const paymentRes = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(getTotal().replace(/[^0-9.-]+/g, "")),
          paymentMethod: formData.paymentOption,
        }),
      });

      const paymentResult = await paymentRes.json();

      if (!paymentRes.ok || !paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment failed');
      }

      // Step 2: Place Order if payment is successful
      const orderData = {
        ...formData,
        items: cart,
        total: getTotal(),
        status: 'New',
        paymentStatus: 'Paid',
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to place order after successful payment');
      }

      alert('Order placed and payment successful!');
      clearCart();
      router.push('/order-confirmation'); // Redirect to order confirmation page
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Checkout</h1>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Order ({cart.length} items)</h2>
        <ul className="mb-8">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between py-2 border-b border-gray-200">
              <span>{item.name} x {item.quantity}</span>
              <span>{item.price}</span>
            </li>
          ))}
          <li className="flex justify-between py-2 font-bold text-lg">
            <span>Total</span>
            <span>{getTotal()}</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping & Billing Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">Mobile</label>
            <input type="text" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingAddress">Billing Address</label>
            <textarea id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shippingAddress">Shipping Address</label>
            <textarea id="shippingAddress" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pincode">Pincode</label>
            <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentOption">Payment Option</label>
            <select id="paymentOption" name="paymentOption" value={formData.paymentOption} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="Razorpay">Razorpay</option>
              <option value="PayU">PayU</option>
            </select>
          </div>
          <button type="submit" className="bg-gray-800 text-white font-bold py-3 px-6 rounded-full w-full mt-4 hover:bg-gray-700">Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;