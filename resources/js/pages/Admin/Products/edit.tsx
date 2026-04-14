import { useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import AdminLayout from '@/components/layout/AdminLayout';
import Alert from '@/components/layout/alert';
import { asset } from '@/utils/helper';

export default function Edit({ product, categories, attributes, productAttributes }: any) {
    const { flash } = usePage().props as { flash?: any };
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status,
        category_id: product.category_id.toString(),
        attribute_values: productAttributes, // { attrId: value }
    });

    const [uploading, setUploading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Передаём attribute_values как JSON строку
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('status', data.status);
        formData.append('category_id', data.category_id);
        formData.append('attribute_values', JSON.stringify(data.attribute_values));
        formData.append('_method', 'PUT');
        router.post(route('admin.products.update', product.id), formData, {
            forceFormData: true,
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) {
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        router.post(route('admin.products.upload-image', product.id), formData, {
            preserveScroll: true,
            onFinish: () => setUploading(false),
        });
    };

    const handleDeleteImage = (imageId: number) => {
        if (confirm('Удалить изображение?')) {
            router.delete(route('admin.products.delete-image', imageId));
        }
    };

    return (
        <AdminLayout title="Редактировать товар">
            <Alert flash={flash} autoCloseDelay={5000} />
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Название *</label>
                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border rounded px-3 py-2" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Описание</label>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={4} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Цена *</label>
                        <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Остаток *</label>
                        <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="w-full border rounded px-3 py-2" required />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Категория *</label>
                    <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full border rounded px-3 py-2" required>
                        <option value="">Выберите категорию</option>
                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Статус</label>
                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border rounded px-3 py-2">
                        <option value="active">Активен</option>
                        <option value="inactive">Неактивен</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Изображения</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {product.images?.map((img: any) => (
                            <div key={img.id} className="relative w-20 h-20 border rounded overflow-hidden group">
                                <img src={asset(img.image_url)} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(img.id)}
                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    {uploading && <span className="text-sm text-gray-500 ml-2">Загрузка...</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Характеристики (атрибуты)</label>
                    {attributes.map((attr: any) => (
                        <div key={attr.id} className="mb-2">
                            <label className="text-sm">{attr.name}</label>
                            <input
                                type="text"
                                value={data.attribute_values[attr.id] || ''}
                                onChange={e => setData(`attribute_values.${attr.id}`, e.target.value)}
                                className="w-full border rounded px-3 py-1 mt-1"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => window.history.back()} className="px-4 py-2 border rounded">Отмена</button>
                    <button type="submit" disabled={processing} className="bg-[#b4632e] text-white px-4 py-2 rounded disabled:opacity-50">
                        {processing ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
