'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  customerName: string;
  total: string;
  status: string;
  items: { productId: number; name: string; quantity: number; price: string }[];
}

interface TrackingInfo {
  orderId: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  history: { timestamp: string; location: string; description: string }[];
}

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchOrder();
      fetchTracking();
    }
  }, [status, router, params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch order');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async () => {
    try {
      const res = await fetch(`/api/track?orderId=${params.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch tracking info');
      }
      const data = await res.json();
      setTracking(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRefund = async () => {
    if (!order) return;
    const confirmRefund = window.confirm(`Are you sure you want to refund order ${order.id} for ${order.total}?`);
    if (confirmRefund) {
      try {
        const res = await fetch('/api/refund', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: order.id, amount: parseFloat(order.total.replace(/[^0-9.-]+/g, "")) }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Refund failed');
        }
        alert(data.message);
        fetchOrder();
      } catch (err: any) {
        alert(`Refund Error: ${err.message}`);
      }
    }
  };

  const handleGenerateInvoice = async () => {
    if (!order) return;
    try {
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.customerName,
          totalAmount: parseFloat(order.total.replace(/[^0-9.-]+/g, "")),
          items: order.items,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invoice generation failed');
      }
      alert(data.message + ` Invoice ID: ${data.invoice.invoiceId}`);
    } catch (err: any) {
      alert(`Invoice Generation Error: ${err.message}`);
    }
  };

  const handleSimulateShipRocketUpdate = async () => {
    if (!order) return;
    const newStatus = prompt('Enter new ShipRocket status (e.g., Shipped, Delivered):');
    if (newStatus) {
      try {
        const res = await fetch('/api/shiprocket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: order.id, status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'ShipRocket update failed');
        }
        alert(data.message);
        fetchTracking(); // Refresh tracking info
      } catch (err: any) {
        alert(`ShipRocket Update Error: ${err.message}`);
      }
    }
  };

  if (status === 'loading' || loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-16 text-center text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-16 text-center">Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Order Details (ID: {order.id})</h1>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="mb-4">
          <p className="text-lg"><span className="font-bold">Customer Name:</span> {order.customerName}</p>
          <p className="text-lg"><span className="font-bold">Total:</span> {order.total}</p>
          <p className="text-lg"><span className="font-bold">Status:</span> {order.status}</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Items</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {tracking && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ShipRocket Tracking</h2>
            <p className="text-lg"><span className="font-bold">Tracking Number:</span> {tracking.trackingNumber}</p>
            <p className="text-lg"><span className="font-bold">Status:</span> {tracking.status}</p>
            <p className="text-lg"><span className="font-bold">Estimated Delivery:</span> {tracking.estimatedDelivery}</p>
            <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">Tracking History</h3>
            <ul>
              {tracking.history.map((event, index) => (
                <li key={index} className="text-gray-600">{new Date(event.timestamp).toLocaleString()}: {event.location} - {event.description}</li>
              ))}
            </ul>
            <button onClick={handleSimulateShipRocketUpdate} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 mt-4">Simulate ShipRocket Update</button>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={handleGenerateInvoice} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700">Generate GST Invoice</button>
          <button onClick={handleRefund} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700">Trigger Refund</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

export default OrderDetailsPage;