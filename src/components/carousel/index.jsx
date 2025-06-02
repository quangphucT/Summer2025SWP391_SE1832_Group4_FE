// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./index.scss";

// import required modules
import { Pagination } from "swiper/modules";
import { Image } from "antd";
import imageBanner1 from "../../assets/images/HIVAIDS-Banner-1920x1024v2.jpg";

export default function Carousel() {
  return (
    <div >
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="w-full h-[620px]"
      >
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image
              src={imageBanner1}
              preview={false}
              className="w-full h-full object-cover"
            />
            <div className="overlay absolute inset-0"></div>
            {/* Thêm nội dung chồng lên nếu cần, như tiêu đề, nút bấm */}
            <div className="absolute font-mono inset-0 flex flex-col items-center justify-center text-white text-center z-10 px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Safe & Confidential HIV Care
              </h1>
              <p className="text-lg md:text-xl max-w-2xl leading-relaxed">
                We are committed to walking with you on your health journey —
                with privacy, compassion, and effectiveness. Take the first step
                today.
              </p>
              <button className="mt-6 cursor-pointer bg-[#1e88e5] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-300">
                Book an Appointment
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
