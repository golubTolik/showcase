import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { route } from "ziggy-js";
import CheckoutForm from '@/components/CheckoutForm';
import Alert from '@/components/layout/alert';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import ModalWindow from '@/components/modal/modalWindow';
import { Badge } from "@/components/ui/badge"
import { asset } from '@/utils/helper';

interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image: string | null;
}

interface Props {
    cartItems: CartItem[];
    totalPrice: number;
}

interface FlashProps {
  showModal?: boolean;
  success?: string;
  error?: string;
  info?: string;
}

export default function CartIndex({ cartItems, totalPrice }: Props) {
    // const { flash } = usePage<{ flash: { showModal?: boolean; } }>().props;
    // const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string; }};
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [modalActive, setModalActive] = useState(false);

    useEffect(() => {
        if (flash.showModal !== undefined) {
          setModalActive(flash.showModal);
        }
    }, [flash.showModal, setModalActive]);


    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            return
        }

        setUpdatingId(itemId);
        router.patch(route('cart.update', { cartItem: itemId }), { quantity: newQuantity }, {
            preserveScroll: true,
            onSuccess: () => {
                setUpdatingId(null);
                // Перезагружаем данные корзины с сервера
                router.reload({ only: ['cartItems', 'totalPrice'] });
            },
            onError: () => setUpdatingId(null),
        });
    };

    const removeItem = (itemId: number) => {
            router.delete(route('cart.destroy', { cartItem: itemId }), {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['cartItems', 'totalPrice'] });
                },
            });
    };

    // const { post: submitOrder, processing } = useForm();

    const handleCheckout = () => {
        setModalActive(true);
    };

    // Вычисляем общее количество товаров на основе актуальных пропсов
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <Navbar />

            <Alert flash={flash} autoCloseDelay={5000} />

            <main className="container min-h-screen mx-auto! px-4! py-8! max-w-5xl">
                <h1 className="text-2xl  mb-6! font-[Gabriela]">Корзина</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12!">
                        <p className="text-gray-500 mb-4!">Ваша корзина пуста</p>
                        <Link href={route('catalog')} className="text-[#b4632e] hover:underline">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 border rounded-lg p-4! bg-white shadow-sm">
                                    <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        {item.image ? (
                                            <img src={asset(item.image)} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">🖼️</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Link href={route('products.show', item.product_id)} className="font-semibold hover:text-[#b4632e]">
                                            {item.name}
                                        </Link>
                                        <div className="text-sm text-gray-500 mt-1!">{item.price.toLocaleString()} ₽</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={updatingId === item.id}
                                                className="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={updatingId === item.id}
                                                className="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="font-bold">{(item.price * item.quantity).toLocaleString()} ₽</div>
                                        {/* <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-sm text-red-500 hover:underline"
                                        >
                                            Удалить из корзины
                                        </button> */}
                                        <Badge
                                            onClick={() => removeItem(item.id)}
                                            variant="destructive"
                                            className="cursor-pointer hover:bg-red-500 hover:text-white"
                                        >
                                            Удалить из корзины
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white border shadow-sm rounded-lg p-6! sticky top-24">
                                <h2 className="text-xl font-semibold mb-4!">Итого</h2>
                                <div className="flex justify-between text-lg mb-2!">
                                    <span>Товары ({totalQuantity} шт.)</span>
                                    <span>{totalPrice.toLocaleString()} ₽</span>
                                </div>
                                <div className="border-t my-4!"></div>
                                <div className="flex justify-between text-2xl font-bold mb-6!">
                                    <span>К оплате</span>
                                    <span>{totalPrice.toLocaleString()} ₽</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    // disabled={processing || cartItems.length === 0}
                                    disabled={cartItems.length === 0}
                                    className="w-full bg-[#b4632e] text-white py-3! rounded-lg hover:bg-[#9a4f24] transition disabled:bg-gray-400"
                                >
                                    {/* {processing ? 'Оформление...' : 'Оформить заказ'} */}
                                    {'Оформить заказ'}
                                </button>
                                <ModalWindow
                                active={modalActive}
                                setActive={setModalActive}
                                >
                                    <CheckoutForm
                                        totalPrice={totalPrice}
                                        onSuccess={() => setModalActive(false)}
                                    />
                                </ModalWindow>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
