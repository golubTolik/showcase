import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";
import { asset } from "@/utils/helper";

export default function Show({ product }) {
    // product уже содержит все переданные данные: id, name, price, image и т.д.
    return (
        <>
            <Navbar/>
            
            <div className="container">
                <h1>{product.name}</h1>
                <img src={asset(product.images[0].image_url)} alt={product.name} />
                <p>{product.price} ₽</p>
            </div>

            <Footer/>
        </>
    );
}
