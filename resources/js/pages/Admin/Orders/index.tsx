import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import AdminLayout from '@/components/layout/AdminLayout';
import Alert from '@/components/layout/alert';

export default function OrdersIndex({ orders, statuses, currentStatus }: any) {
    const { flash } = usePage().props as { flash?: any };
    const [filter, setFilter] = useState(currentStatus || '');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleStatusChange = (orderId: number, newStatus: string) => {
        router.patch(route('admin.orders.update-status', orderId), { status: newStatus });
    };

    const openOrderDetails = (order: any) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <AdminLayout title="Заказы">
            <Alert flash={flash} autoCloseDelay={5000} />
            <div className="mb-4! flex gap-2">
                <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-2! py-1!">
                    <option value="">Все статусы</option>
                    {statuses.map((s: string) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => router.get(route('admin.orders.index', { status: filter }))} className="bg-gray-200 px-4! py-1! rounded">
                    Фильтр
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4! py-2! border">ID</th>
                            <th className="px-4! py-2! border">Клиент</th>
                            <th className="px-4! py-2! border">Сумма</th>
                            <th className="px-4! py-2! border">Статус</th>
                            <th className="px-4! py-2! border">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: any) => (
                            <tr key={order.id}>
                                <td className="px-4! py-2! border text-center">{order.id}</td>
                                <td className="px-4! py-2! border">{order.full_name}<br/><span className="text-xs">{order.email}</span></td>
                                <td className="px-4! py-2! border text-right">{order.total_price} ₽</td>
                                <td className="px-4! py-2! border">
                                    <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)} className="border rounded px-1! py-0.5">
                                        {statuses.map((s: string) => <option key={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td className="px-4! py-2! border text-center">
                                    <button onClick={() => openOrderDetails(order)} className="text-blue-500 hover:underline">Детали</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Модальное окно с деталями заказа */}
            {modalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="bg-white rounded-lg p-6! w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4!">Заказ №{selectedOrder.id}</h2>
                        <div className="mb-4!">
                            <h3 className="font-semibold">Информация о клиенте</h3>
                            <p>ФИО: {selectedOrder.full_name}</p>
                            <p>Телефон: {selectedOrder.phone}</p>
                            <p>Email: {selectedOrder.email}</p>
                            <p>Способ доставки: {selectedOrder.delivery_type}</p>
                            <p>Адрес: {selectedOrder.address || '—'}</p>
                            <p>Способ оплаты: {selectedOrder.payment_method}</p>
                            <p>Комментарий: {selectedOrder.comment || '—'}</p>
                            <p>Дата: {selectedOrder.created_at}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2!">Товары в заказе</h3>
                            <table className="min-w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-2! py-1! border text-left">Товар</th>
                                        <th className="px-2! py-1! border text-center">Кол-во</th>
                                        <th className="px-2! py-1! border text-right">Цена</th>
                                        <th className="px-2! py-1! border text-right">Сумма</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="px-2! py-1! border">{item.product_name}</td>
                                            <td className="px-2! py-1! border text-center">{item.quantity}</td>
                                            <td className="px-2! py-1! border text-right">{item.price_at_time} ₽</td>
                                            <td className="px-2! py-1! border text-right">{item.quantity * item.price_at_time} ₽</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-2! py-2! text-right font-bold">Итого:</td>
                                        <td className="px-2! py-2! text-right font-bold">{selectedOrder.total_price} ₽</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="mt-4! flex justify-end">
                            <button onClick={closeModal} className="px-4! py-2! bg-gray-200 rounded">Закрыть</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
