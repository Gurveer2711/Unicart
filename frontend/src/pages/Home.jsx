import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopSellingProducts,
  fetchNewProducts,
} from "../features/productSlice";
import ProductCarousel from "../components/ProductCarousel";
import MarqueeEffect from "../components/MarqueeComponent";
import FeatureSection from "../components/FeatureSection";
import Carousel from "../components/Carousel";
import women from "../assets/carousel/women.jpg";
import men from "../assets/carousel/men.jpg";
import vogue from "../assets/carousel/vogue.jpg";
import couple from "../assets/carousel/couple.jpg";
import tech from "../assets/carousel/tech.jpg";

export default function Home() {
  const dispatch = useDispatch();
  const { topSelling, newProducts, loading } = useSelector(
    (state) => state.products
  );
   const images = [women, men, vogue, couple, tech];


  useEffect(() => {
    dispatch(fetchTopSellingProducts());
    dispatch(fetchNewProducts());
  }, [dispatch]);

  // Images for the hero slider
 

  return (
    <div className="min-h-screen p-4 mt-20 mx-2">
      <div className="mt-4 mx-2 md:mx-4">
        <div className=" sm:py-4 text-center">
          <span className="">
            <MarqueeEffect />
          </span>
        </div>

        <div className="my-6">
          <Carousel images={images} />
        </div>

        {/* Top Selling Products Section */}
        <section className="my-10 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-[black] mb-8 text-center">
              🔥 Top Selling Products
            </h2>
            <ProductCarousel products={topSelling} loading={loading} />
          </div>
        </section>

        {/* New Products Section */}
        <section className="my-10 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-[black] mb-8 text-center">
              ✨ New Products
            </h2>
            <ProductCarousel products={newProducts} loading={loading} />
          </div>
        </section>

        {/* Feature section */}
        <FeatureSection />
      </div>
    </div>
  );
}
