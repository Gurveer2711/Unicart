// import ProductCard from "../components/ProductCard";
import CarouselDefault from "../components/Carousel";
import women from "../assets/carousel/women.jpg";
import men from "../assets/carousel/men.jpg";
import vogue from "../assets/carousel/vogue.jpg";
import couple from "../assets/carousel/couple.jpg";
import tech from "../assets/carousel/tech.jpg";
import MarqueeEffect from "../components/MarqueeComponent";

const Home = () => {
  // Images for the slider
  const images = [women, men, vogue, couple, tech];
  return (
    <div className="min-h-screen p-4 mt-20 mx-2">
      <div className=" sm:py-4 text-center">
        <span className="">
          <MarqueeEffect />
        </span>
      </div>
      <div>
        <CarouselDefault images={images} />
      </div>
      {/* <section className="topProducts px-4 py-7 ">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#f46530] mb-8">
            🔥 Top Selling Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section> */}
      <section className="my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <img
              src="https://imgs.search.brave.com/43tOzL3_5Yfj52nr2FKrArmdRE3zPUviYivv5GUPJM8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzk4LzQ4LzM1/LzM2MF9GXzk4NDgz/NTU4X05kT2d1ZHRj/S0NYc05rN1FlVnNK/dGtscXd4dW9GR2JT/LmpwZw"
              alt="Shipping"
              className="w-16 h-16"
            />
            <h3 className="text-lg font-bold mt-2">FREE SHIPPING</h3>
            <h5 className="text-sm text-gray-600">
              STANDARD DELIVERY 5-7 WORKING DAYS
            </h5>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://imgs.search.brave.com/mYEob41vDeHaLLL2XBdQoVY-imKj4moNpnytLJEuhKM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0Lzg4LzI3Lzk4/LzM2MF9GXzQ4ODI3/OTg3NF9pbjVZRlRL/WEEyYlFLd0Q2NkRy/S0s1ZGlUU1o2UlJv/bC5qcGc"
              alt="exchange"
              className="w-16 h-16"
            />
            <h3 className="text-lg font-bold mt-2">EASY EXCHANGE</h3>
            <h5 className="text-sm text-gray-600">
              HASSLE-FREE RETURNS WITHIN 30 DAYS
            </h5>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://imgs.search.brave.com/umnn0Y_p7dKKjJnQPzmG8E1ZnmQ11cC7qGNdRUCD_Vs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvY3JlZGl0LWNh/cmQtc2VjdXJlLWlj/b25fOTk2MTM1LTQw/NTY5LmpwZz9zZW10/PWFpc19oeWJyaWQ"
              alt="checkout"
              className="w-16 h-16"
            />
            <h3 className="text-lg font-bold mt-2">SECURE CHECKOUT</h3>
            <h5 className="text-sm text-gray-600">
              100% SAFE & SECURE PAYMENT
            </h5>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://imgs.search.brave.com/SdYJOZ7NkQMDRdbgD1AZRphlJnXlC8p1KQXINKGTUqw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2JhL2Ri/L2Q2L2JhZGJkNjZi/ZjM2MWFhMGZhN2Vh/ZTFiZTA4MWNlYTNj/LmpwZw"
              alt="satisfaction"
              className="w-16 h-16"
            />
            <h3 className="text-lg font-bold mt-2">100% SATISFACTION</h3>
            <h5 className="text-sm text-gray-600">
              CUSTOMER HAPPINESS GUARANTEED
            </h5>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
