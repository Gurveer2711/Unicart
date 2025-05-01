"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products, loading }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;

      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });

      setScrollPosition(scrollTo);
    }
  };

  // Handle scroll event to update position
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        setScrollPosition(carouselRef.current.scrollLeft);
      }
    };

    const carousel = carouselRef.current;
    carousel?.addEventListener("scroll", handleScroll);

    return () => {
      carousel?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <div className="h-[200px] w-full rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-4 w-[80%] bg-gray-200 animate-pulse" />
            <div className="h-4 w-[60%] bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="flex-none w-[280px] snap-start">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-gray-500">No products available</p>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <>
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md z-10 p-2 border border-gray-200"
            onClick={() => scroll("left")}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-md z-10 p-2 border border-gray-200"
            onClick={() => scroll("right")}
            disabled={
              carouselRef.current
                ? scrollPosition >=
                  carouselRef.current.scrollWidth -
                    carouselRef.current.clientWidth -
                    10
                : false
            }
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
