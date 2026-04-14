import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import AdminLayout from '@/components/layout/AdminLayout';
import Alert from '@/components/layout/alert';

interface CategoryOption {
    id: number;
    name: string;
}

interface Attribute {
    id: number;
    name: string;
}

export default function Create({ categories, attributes }: { categories: CategoryOption[]; attributes: Attribute[] }) {
    const { flash } = usePage().props as { flash?: any };
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        status: 'active',
        category_id: '',
        images: [] as File[],
        attribute_values: {} as Record<number, string>,
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('images', files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleAttributeChange = (attrId: number, value: string) => {
        setData('attribute_values', { ...data.attribute_values, [attrId]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', String(data.price));
        formData.append('stock', String(data.stock));
        formData.append('status', data.status);
        formData.append('category_id', String(data.category_id));
        data.images.forEach(file => formData.append('images[]', file));
        formData.append('attribute_values', JSON.stringify(data.attribute_values));
        post(route('admin.products.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => clearErrors(),
        });
    };

    return (
        <AdminLayout title="Создать товар">
            <Alert flash={flash} autoCloseDelay={5000} />
            <form onSubmit={handleSubmit} className="space-y-4! bg-white p-6! rounded shadow max-w-2xl mx-auto">
                <div>
                    <label className="block font-medium mb-1!">Название</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="border rounded w-full p-2!"
                    />
                    {errors.name && <div className="field-error text-sm">{errors.name}</div>}
                </div>

                <div>
                    <label className="block font-medium mb-1!">Описание</label>
                    <textarea
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        rows={4}
                        className="border rounded w-full p-2!"
                    />
                    {errors.description && <div className="field-error text-sm">{errors.description}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1!">Цена (₽)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            className="border rounded w-full p-2!"
                        />
                        {errors.price && <div className="field-error text-sm">{errors.price}</div>}
                    </div>
                    <div>
                        <label className="block font-medium mb-1!">Количество на складе</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="border rounded w-full p-2!"
                        />
                        {errors.stock && <div className="field-error text-sm">{errors.stock}</div>}
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1!">Статус</label>
                    <select
                        value={data.status}
                        onChange={e => setData('status', e.target.value)}
                        className="border rounded w-full p-2!"
                    >
                        <option value="active">Активен</option>
                        <option value="inactive">Неактивен</option>
                    </select>
                    {errors.status && <div className="field-error text-sm">{errors.status}</div>}
                </div>

                <div>
                    <label className="block font-medium mb-1!">Категория</label>
                    <select
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className="border rounded w-full p-2!"
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <div className="field-error text-sm">{errors.category_id}</div>}
                </div>

                <div>
                    <label className="block font-medium mb-1!">Изображения (можно несколько)</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border rounded w-full p-2!"
                    />
                    {previews.length > 0 && (
                        <div className="flex gap-2 mt-2! flex-wrap">
                            {previews.map((src, idx) => (
                                <img key={idx} src={src} alt="preview" className="w-20 h-20 object-cover rounded" />
                            ))}
                        </div>
                    )}
                    {errors.images && <div className="field-error text-sm">{errors.images}</div>}
                </div>

                <div>
                    <label className="block font-medium mb-2!">Характеристики</label>
                    {attributes.map(attr => (
                        <div key={attr.id} className="mb-3!">
                            <label className="block text-sm font-medium text-gray-700">{attr.name}</label>
                            <input
                                type="text"
                                value={data.attribute_values[attr.id] || ''}
                                onChange={e => handleAttributeChange(attr.id, e.target.value)}
                                className="border rounded w-full p-2! mt-1!"
                                placeholder={`Введите значение для ${attr.name}`}
                            />
                            {errors.attribute_values && <div className="field-error text-sm">{errors.attribute_values}</div>}
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#b4632e] text-white px-6! py-2! rounded-md hover:bg-[#9a4f24] disabled:opacity-50"
                    >
                        {processing ? 'Сохранение...' : 'Создать товар'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
