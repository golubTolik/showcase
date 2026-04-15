import { useForm } from '@inertiajs/react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { route } from 'ziggy-js';
// import Alert from '@/components/layout/alert';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';

export default function Contacts() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.send'), {
            preserveScroll: true,
            onSuccess: () => reset('name', 'email', 'message'),
        });
    };

    return (
        <>
            <Navbar />
            <main className="bg-linear-to-b from-white to-amber-50/30 py-12!">
                <div className="container mx-auto! px-4! max-w-6xl">
                    {/* Заголовок */}
                    <div className="text-center mb-12!">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3! font-[Gabriela]">
                            Контакты
                        </h1>
                        <div className="w-24 h-1 bg-[#b4632e] mx-auto rounded-full"></div>
                        <p className="text-gray-500 mt-4! max-w-lg mx-auto!">
                            Мы всегда на связи. Оставьте сообщение или свяжитесь удобным для вас способом.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Левая колонка – контактная информация */}
                        <div className="space-y-6!">
                            <div className="bg-white rounded-xl shadow-md p-6!">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4! flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#b4632e]" />
                                    Адрес
                                </h2>
                                <p className="text-gray-600">г. Москва, ул. Примерная, д. 123</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6!">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4! flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-[#b4632e]" />
                                    Телефон
                                </h2>
                                <a href="tel:+78001234567" className="text-gray-600 hover:text-[#b4632e] transition block">
                                    +7 (800) 123-45-67
                                </a>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6!">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4! flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-[#b4632e]" />
                                    Email
                                </h2>
                                <a href="mailto:info@example.com" className="text-gray-600 hover:text-[#b4632e] transition">
                                    info@example.com
                                </a>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6!">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4! flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#b4632e]" />
                                    Режим работы
                                </h2>
                                <p className="text-gray-600">Пн-Пт: 09:00 – 20:00</p>
                                <p className="text-gray-600">Сб: 10:00 – 18:00</p>
                                <p className="text-gray-600">Вс: выходной</p>
                            </div>
                        </div>

                        {/* Правая колонка – форма обратной связи */}
                        <div className="bg-white rounded-xl shadow-md p-6!">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4! flex items-center gap-2">
                                <Send className="w-5 h-5 text-[#b4632e]" />
                                Написать нам
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4!">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4! py-2! focus:outline-none focus:ring-2 focus:ring-[#b4632e] focus:border-transparent transition"
                                        required
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1!">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1!">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4! py-2! focus:outline-none focus:ring-2 focus:ring-[#b4632e] focus:border-transparent transition"
                                        required
                                    />
                                    {errors.email && <div className="text-red-500 text-sm mt-1!">{errors.email}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1!">Сообщение</label>
                                    <textarea
                                        rows={5}
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4! py-2! focus:outline-none focus:ring-2 focus:ring-[#b4632e] focus:border-transparent transition"
                                        required
                                    />
                                    {errors.message && <div className="text-red-500 text-sm mt-1!">{errors.message}</div>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#b4632e] text-white font-semibold py-2! rounded-lg hover:bg-[#9a4f24] transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Отправка...' : 'Отправить сообщение'}
                                    {!processing && <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Карта (можно добавить, если есть координаты) */}
                    {/* <div className="mt-16">
                        <div className="bg-gray-200 rounded-xl overflow-hidden h-64 flex items-center justify-center text-gray-400">
                            <p>Здесь может быть карта (например, Яндекс.Карты)</p>
                        </div>
                    </div> */}
                </div>
            </main>
            <Footer />
        </>
    );
}
