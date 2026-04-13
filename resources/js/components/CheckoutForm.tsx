// resources/js/Components/CheckoutForm.tsx
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import '../../css/checkoutForm.css';

interface CheckoutFormProps {
  totalPrice: number;
  onSuccess: () => void;
}

export default function CheckoutForm({ totalPrice, onSuccess }: CheckoutFormProps) {
  const { data, setData, post, processing, errors } = useForm({
    full_name: '',
    phone: '',
    email: '',
    delivery_type: 'courier',
    address: '',
    payment_method: 'card',
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('order.store'), {
      preserveScroll: true,
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4!">
      <h2 className="text-2xl font-bold mb-4!">Оформление заказа</h2>
      <p className="text-gray-600 mb-4!">Сумма заказа: <span className="font-bold">{totalPrice.toLocaleString()} ₽</span></p>

      <div>
        <label className="block text-sm font-medium mb-1!">ФИО *</label>
        <input
          type="text"
          value={data.full_name}
          onChange={e => setData('full_name', e.target.value)}
          className="w-full border rounded-lg px-3! py-2!"
          required
        />
        {errors.full_name && <div className="field-error text-sm">{errors.full_name}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1!">Телефон *</label>
        <input
          type="tel"
          value={data.phone}
          onChange={e => setData('phone', e.target.value)}
          className="w-full border rounded-lg px-3! py-2!"
          required
        />
        {errors.phone && <div className="field-error text-sm">{errors.phone}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1!">Email *</label>
        <input
          type="email"
          value={data.email}
          onChange={e => setData('email', e.target.value)}
          className="w-full border rounded-lg px-3! py-2!"
          required
        />
        {errors.email && <div className="field-error text-sm">{errors.email}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1!">Способ доставки</label>
        <select
          value={data.delivery_type}
          onChange={e => setData('delivery_type', e.target.value)}
          className="w-full border rounded-lg px-3! py-2!"
        >
          <option value="courier">Курьером</option>
          <option value="pickup">Самовывоз</option>
          <option value="post">Почта России</option>
        </select>
      </div>

      {data.delivery_type !== 'pickup' && (
        <div>
          <label className="block text-sm font-medium mb-1!">Адрес доставки</label>
          <input
            type="text"
            value={data.address}
            onChange={e => setData('address', e.target.value)}
            className="w-full border rounded-lg px-3! py-2!"
          />
          {errors.address && <div className="field-error text-sm">{errors.address}</div>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1!">Способ оплаты</label>
        <select
          value={data.payment_method}
          onChange={e => setData('payment_method', e.target.value)}
          className="w-full border rounded-lg px-3! py-2!"
        >
          <option value="card">Картой онлайн</option>
          <option value="cash">Наличными при получении</option>
          <option value="bank">Банковский перевод</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1!">Комментарий к заказу</label>
        <textarea
          value={data.comment}
          onChange={e => setData('comment', e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3! py-2!"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4!">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4! py-2! border rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={processing}
          className="px-6! py-2! bg-[#b4632e] text-white rounded-lg hover:bg-[#9a4f24] disabled:opacity-50"
        >
          {processing ? 'Оформление...' : 'Подтвердить заказ'}
        </button>
      </div>
    </form>
  );
}
