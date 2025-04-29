import React from "react";
import { useSwiper } from "swiper/react";

export const SwiperNavButton = () => {
  const swiper = useSwiper();

  return (
    <div className="swiper-nav-btns">
      {/* Previous Slide Button */}
      <button
        aria-label="previous"
        type="button"
        onClick={() => swiper.slidePrev()}
      >
        <img
          width={32}
          height={32}
          src="/images/slider-left-arrow.svg"
          alt="Previous slide"
        />
      </button>

      {/* Next Slide Button */}
      <button
        aria-label="next"
        type="button"
        onClick={() => swiper.slideNext()}
      >
        <img
          width={32}
          height={32}
          src="/images/slider-right-arrow.svg"
          alt="Next slide"
        />
      </button>
    </div>
  );
};

export default SwiperNavButton;
