
'use client';

import { useParams } from 'next/navigation';

const EditProductPage = () => {
  const params = useParams();
  const id = params.id as string;
  return (
    <div>
      <h1>Edit Product Page</h1>
      <p>Product ID: {id}</p>
    </div>
  );
};

export default EditProductPage;
