"use client";
import { motion } from "framer-motion";

export default function MarqueeEffect() {
  const marqueeVariants = {
    animate: {
      x: [0, -1035],
      transition: {
        x: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="overflow-hidden whitespace-nowrap w-full py-2">
      <motion.div
        className="inline-block"
        variants={marqueeVariants}
        animate="animate"
      >
        <span className="mx-4 text-lg md:text-2xl font-bold">
          SUMMER SALE - UP TO 50% OFF
        </span>
        <span className="mx-4 text-lg md:text-2xl font-bold">
          FREE SHIPPING ON ALL ORDERS
        </span>
        <span className="mx-4 text-lg md:text-2xl font-bold">
          100% AUTHENTIC PRODUCTS
        </span>
        <span className="mx-4 text-lg md:text-2xl font-bold">
          EASY RETURNS & EXCHANGES
        </span>
        <span className="mx-4 text-lg md:text-2xl font-bold">
          SUMMER SALE - UP TO 50% OFF
        </span>
        <span className="mx-4 text-lg md:text-2xl font-bold">
          FREE SHIPPING ON ALL ORDERS
        </span>
      </motion.div>
    </div>
  );
}
