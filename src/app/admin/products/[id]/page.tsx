'use client';

const EditProductPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1>Edit Product Page</h1>
      <p>Product ID: {params.id}</p>
    </div>
  );
};

export default EditProductPage;
