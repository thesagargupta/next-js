const OrderConfirmationPage = () => {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You for Your Order!</h1>
        <p className="text-lg text-gray-600 mb-8">Your order has been placed successfully and is being processed.</p>
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
          <p className="text-gray-600 mb-2">Order ID: #123456789</p>
          <p className="text-gray-600 mb-2">Total: ₹5,197</p>
          <p className="text-gray-600 mb-4">Estimated Delivery: 5-7 business days</p>
          <a href="/" className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">Continue Shopping</a>
        </div>
      </div>
    );
  };
  
  export default OrderConfirmationPage;