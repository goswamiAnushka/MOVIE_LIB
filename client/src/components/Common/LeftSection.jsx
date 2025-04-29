import SwiperNavButton from "../Layout/SwiperNavButton";
import { Box } from "@mui/material";
import React from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import "../custom.css";
import "../responsive.css";
import "../dark.css";
import "../developer.css";
import "../global.css";


const LeftSection = () => {
  return (
    <Box className="auth-slider-wrap" style={{ position: "relative" }}>
      <Swiper
        slidesPerView={1}
        loop
        modules={[Navigation, Autoplay]}
        className="authSwiper"
        autoplay={{ delay: 3000 }}
      >
        <SwiperSlide>
          <Box className="auth-slider-img-holder" style={{ position: "relative" }}>
            <img
              src="/images/auth-slider-img1.jpg"
              alt="Slider Image 1"
              style={{ width: "100%", height: "auto", position: "absolute", top: "0", left: "0" }}
            />
            <Box className="auth-slider-info" style={{ position: "absolute", bottom: "0", left: "0" }}>
              <Box className="auth-slider-info-inner">
                <Box className="auth-slider-info-inner-top">
                  <h1>
                    Start Your <br />
                    Journey With Us.
                  </h1>
                  <SwiperNavButton />
                </Box>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Integer vel sed enim aliquet volutpat adipiscing ante amet. Aliquet volutpat ut magna lectus mi eu consectetur placerat facilisi. Enim et cursus at semper massa justo gravida. Eu parturient et neque morbi felis vitae nunc fermentum.
                </p>
              </Box>
            </Box>
          </Box>
        </SwiperSlide>

        <SwiperSlide>
          <Box className="auth-slider-img-holder" style={{ position: "relative" }}>
            <img
              src="/images/signup-slider-img1.jpg"
              alt="Slider Image 2"
              style={{ width: "100%", height: "auto", position: "absolute", top: "0", left: "0" }}
            />
            <Box className="auth-slider-info" style={{ position: "absolute", bottom: "0", left: "0" }}>
              <Box className="auth-slider-info-inner">
                <Box className="auth-slider-info-inner-top">
                  <h1>
                    Start Your <br />
                    Journey With Us.
                  </h1>
                  <SwiperNavButton />
                </Box>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Integer vel sed enim aliquet volutpat adipiscing ante amet. Aliquet volutpat ut magna lectus mi eu consectetur placerat facilisi. Enim et cursus at semper massa justo gravida. Eu parturient et neque morbi felis vitae nunc fermentum.
                </p>
              </Box>
            </Box>
          </Box>
        </SwiperSlide>
      </Swiper>
    </Box>
  );
};

export default LeftSection;
