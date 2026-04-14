import { router, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/components/layout/AdminLayout';
import Alert from '@/components/layout/alert';
import { asset } from '@/utils/helper';

interface ProductItem {
    id: number;
    name: string;
    price: number;
    stock: number;
    status: string;
    category_name: string | null;
    image: string | null;
}

export default function ProductsIndex({ products }: { products: ProductItem[] }) {
    const { flash } = usePage().props as { flash?: any };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Удалить товар "${name}"?`)) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <AdminLayout title="Управление товарами">
            <Alert flash={flash} autoCloseDelay={5000} />
            <div className="mb-4! flex justify-end">
                <Link href={route('admin.products.create')} className="bg-[#b4632e] text-white px-4! py-2! rounded hover:bg-[#9a4f24]">
                    + Новый товар
                </Link>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4! py-2! text-left">ID</th>
                            <th className="px-4! py-2! text-left">Изображение</th>
                            <th className="px-4! py-2! text-left">Название</th>
                            <th className="px-4! py-2! text-left">Категория</th>
                            <th className="px-4! py-2! text-right">Цена</th>
                            <th className="px-4! py-2! text-right">Остаток</th>
                            <th className="px-4! py-2! text-center">Статус</th>
                            <th className="px-4! py-2!">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-t">
                                <td className="px-4! py-2!">{p.id}</td>
                                <td className="px-4! py-2!">
                                    {p.image ? (
                                        <img src={asset(p.image)} alt="" className="w-12 h-12 object-cover rounded" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">—</div>
                                    )}
                                </td>
                                <td className="px-4! py-2!">{p.name}</td>
                                <td className="px-4! py-2!">{p.category_name || '—'}</td>
                                <td className="px-4! py-2! text-right">{p.price.toLocaleString()} ₽</td>
                                <td className="px-4! py-2! text-right">{p.stock}</td>
                                <td className="px-4! py-2! text-center">
                                    <span className={`px-2! py-1! rounded text-xs ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {p.status === 'active' ? 'Активен' : 'Неактивен'}
                                    </span>
                                </td>
                                <td className="px-4! py-2! text-center space-x-2">
                                    <Link href={route('admin.products.edit', p.id)} className="text-blue-600 hover:underline">Редактировать</Link>
                                    <button onClick={() => handleDelete(p.id, p.name)} className="text-red-600 hover:underline">Удалить</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
