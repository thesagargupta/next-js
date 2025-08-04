'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface Template {
  id: number;
  name: string;
  layout: string; // Tailwind CSS grid classes
}

interface UploadedImage {
  id: string;
  url: string;
}

const templates: Template[] = [
  { id: 1, name: 'Grid 2x2', layout: 'grid-cols-2 gap-4' },
  { id: 2, name: 'Grid 3x1', layout: 'grid-cols-3 gap-4' },
  { id: 3, name: 'Single Image', layout: 'grid-cols-1' },
];

function SortableImageItem({ url, id }: { url: string; id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative h-32 cursor-grab">
      <Image src={url} alt={`uploaded image ${id}`} fill className="object-cover rounded-lg" />
    </div>
  );
}

const ProductPage = ({ params }: { params: { id: string } }) => {
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor)
    );

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await res.json();
                setProduct(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const newImages: UploadedImage[] = files.map(file => ({
              id: file.name + Date.now(), // Unique ID for dnd-kit
              url: URL.createObjectURL(file)
            }));
            setUploadedImages(prev => [...prev, ...newImages]);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setUploadedImages((items) => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over?.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    const generatePreview = () => {
        const match = selectedTemplate.layout.match(/grid-cols-(\d+)/);
        const numberOfColumns = match ? parseInt(match[1]) : 1;
        const maxSlots = numberOfColumns * 2; // Display up to 2 rows of images in preview

        let imagesForPreview: string[] = [];

        for (let i = 0; i < maxSlots; i++) {
            if (uploadedImages[i]) {
                imagesForPreview.push(uploadedImages[i].url);
            } else {
                imagesForPreview.push('/placeholder.svg'); // Use a generic placeholder
            }
        }
        setPreviewImages(imagesForPreview);
    };

    useEffect(() => {
      generatePreview();
    }, [uploadedImages, selectedTemplate]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({ ...product, quantity: 1 });
            alert(`${product.name} added to cart!`);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-16 text-center text-red-500">{error}</div>;
    }

    if (!product) {
        return <div className="container mx-auto px-4 py-16 text-center">Product not found</div>;
    }

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <div className="relative w-full h-96 mb-8">
                    <Image src={product.image} alt={product.name} fill className="object-contain rounded-lg" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-8">{product.price}</p>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Photos</h2>
                    <input type="file" multiple onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"/>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={uploadedImages.map(img => img.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {uploadedImages.map((image) => (
                            <SortableImageItem key={image.id} id={image.id} url={image.url} />
                        ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose a Template</h2>
                    <div className="flex space-x-4">
                        {templates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                className={`px-4 py-2 rounded-full border ${selectedTemplate.id === template.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={generatePreview} className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-700 mr-4">Generate Preview</button>
                <button onClick={handleAddToCart} className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700">Add to Cart</button>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Preview</h2>
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className={`grid ${selectedTemplate.layout}`}>
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative h-64">
                                <Image src={image} alt={`preview image ${index + 1}`} fill className="object-contain rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProductPage;