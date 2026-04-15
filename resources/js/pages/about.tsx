import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import ChatTeardropDots from '../../assets/icons/ChatTeardropDots.svg';
import HouseLine from '../../assets/icons/HouseLine.svg';
import ShieldCheck from '../../assets/icons/ShieldCheck.svg';
import TruckTrailer from '../../assets/icons/TruckTrailer.svg';

export default function About() {
    return (
        <>
            <Navbar />
            <main className="bg-linear-to-b from-white to-amber-50/30 py-12!">
                <div className="container mx-auto! px-4! max-w-6xl">
                    {/* Заголовок */}
                    <div className="text-center mb-12!">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3! font-[Gabriela]">
                            О нас
                        </h1>
                        <div className="w-24 h-1 bg-[#b4632e] mx-auto rounded-full"></div>
                    </div>

                    {/* Описание компании */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20!">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4!">
                                Ваш надёжный помощник в создании уюта
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4!">
                                Наша компания основана в 2020 году с целью предоставить покупателям лучшие товары для дома и кухни.
                                Мы верим, что уют начинается с мелочей, поэтому тщательно отбираем каждый товар в нашем ассортименте.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Мы работаем напрямую с проверенными производителями, чтобы предложить вам высокое качество по доступным ценам.
                                Наша команда всегда готова помочь с выбором и ответить на ваши вопросы.
                            </p>
                        </div>
                        <div className="bg-[#b4632e]/10 rounded-2xl p-6! text-center">
                            <img src={HouseLine} alt="Дом" className="w-16 h-16 mx-auto mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800">Более 5000 довольных клиентов</h3>
                            <p className="text-gray-600 mt-2!">по всей России</p>
                        </div>
                    </div>

                    {/* Преимущества в виде карточек */}
                    <div className="mb-12!">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-3!">
                            Наши преимущества
                        </h2>
                        <div className="w-24 h-1 bg-[#b4632e] mx-auto rounded-full mb-8!"></div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { img: ShieldCheck, title: 'Сертифицированные товары', desc: 'Только проверенное качество' },
                                { img: TruckTrailer, title: 'Быстрая доставка', desc: 'По всей стране' },
                                { img: ChatTeardropDots, title: 'Поддержка 24/7', desc: 'Профессиональная помощь' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-5 shadow-md text-center hover:shadow-lg transition">
                                    <img src={item.img} alt={item.title} className="w-12 h-12 mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1!">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Цитата или призыв */}
                    <div className="bg-[#b4632e]/10 rounded-2xl p-8! text-center">
                        <p className="text-gray-700 italic text-lg">«Мы заботимся о вашем комфорте, чтобы каждый день был наполнен теплом и уютом»</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
