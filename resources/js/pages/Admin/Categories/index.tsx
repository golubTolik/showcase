import { router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { route } from 'ziggy-js';
import AdminLayout from '@/components/layout/AdminLayout';
import Alert from '@/components/layout/alert';
import { asset } from '@/utils/helper';

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
    parent_name?: string;
    img?: string | null;
    created_at: string;
}

interface ParentCategory {
    id: number;
    name: string;
}

export default function CategoriesIndex({ categories, parents }: { categories: Category[]; parents: ParentCategory[] }) {
    const { flash } = usePage().props as { flash?: any };
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form, setForm] = useState({ name: '', parent_id: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openCreateModal = () => {
        setEditingCategory(null);
        setForm({ name: '', parent_id: '' });
        setImageFile(null);
        setImagePreview('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setModalOpen(true);
    };

    const openEditModal = (cat: Category) => {
        setEditingCategory(cat);
        setForm({ name: cat.name, parent_id: cat.parent_id?.toString() || '' });

        if (cat.img) {
            setImagePreview(cat.img);
        } else {
            setImagePreview('');
        }

        setImageFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);

        if (form.parent_id) {
            formData.append('parent_id', form.parent_id);
        }

        if (imageFile) {
            formData.append('img', imageFile);
        }

        if (editingCategory) {
            formData.append('_method', 'PATCH');
            router.post(route('admin.categories.update', editingCategory.id), formData, {
                forceFormData: true,
            });
        } else {
            router.post(route('admin.categories.store'), formData, {
                forceFormData: true,
            });
        }

        setModalOpen(false);
        setImageFile(null);
        setImagePreview('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Удалить категорию?')) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setImageFile(null);
        setImagePreview('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AdminLayout title="Управление категориями">
            <Alert flash={flash} autoCloseDelay={5000} />
            <div className="mb-4! flex justify-end">
                <button onClick={openCreateModal} className="bg-[#b4632e] text-white px-4! py-2! rounded hover:bg-[#9a4f24]">
                    + Новая категория
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4! py-2! text-left">ID</th>
                            <th className="px-4! py-2! text-left">Изображение</th>
                            <th className="px-4! py-2! text-left">Название</th>
                            <th className="px-4! py-2! text-left">Родительская категория</th>
                            <th className="px-4! py-2! text-left">Дата создания</th>
                            <th className="px-4! py-2!">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id} className="border-t">
                                <td className="px-4! py-2!">{cat.id}</td>
                                <td className="px-4! py-2!">
                                    {cat.img ? (
                                        <img src={asset(cat.img)} alt={cat.name} className="w-10 h-10 object-cover rounded" />
                                    ) : '—'}
                                </td>
                                <td className="px-4! py-2!">{cat.name}</td>
                                <td className="px-4! py-2!">{cat.parent_name || '—'}</td>
                                <td className="px-4! py-2!">{cat.created_at}</td>
                                <td className="px-4! py-2! text-center space-x-2!">
                                    <button onClick={() => openEditModal(cat)} className="text-blue-600 hover:underline">Ред.</button>
                                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 ml-5 hover:underline">Уд.</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Модальное окно */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="bg-white rounded-lg p-6! w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4!">{editingCategory ? 'Редактировать категорию' : 'Создать категорию'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1!">Название</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full border rounded px-3! py-2!"
                                    required
                                />
                            </div>
                            <div className="mb-4!">
                                <label className="block text-sm font-medium mb-1!">Родительская категория (необязательно)</label>
                                <select
                                    value={form.parent_id}
                                    onChange={e => setForm({ ...form, parent_id: e.target.value })}
                                    className="w-full border rounded px-3! py-2!"
                                >
                                    <option value="">— Нет (корневая категория) —</option>
                                    {parents.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1!">Изображение</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="w-full border rounded px-3! py-2!"
                                />
                                {imagePreview && (
                                    <div className="mt-2!">
                                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                                        {editingCategory && editingCategory.img && !imageFile && (
                                            <p className="text-xs text-gray-500 mt-1!">Текущее изображение</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="px-4! py-2! border rounded">Отмена</button>
                                <button type="submit" className="px-4! py-2! bg-[#b4632e] text-white rounded">Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
