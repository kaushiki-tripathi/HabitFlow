import { useState } from "react";
import { Link } from "react-router-dom";
import heatmapImg from "../../assets/heatmap.png";
import dashboard from "../../assets/dashboard.png";
import habitmanager from "../../assets/habitmanager.png";
import optimizer from "../../assets/Schedule.png";
import streak from "../../assets/streak.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

const featureCards = [
  {
    id: "dashboard",
    badgeLabel: "DAILY DASHBOARD",
    title: "Daily Dashboard",
    tagline: "Clarity for today",
    description:
      "A calm overview of your day. See what matters, track progress, and move forward with intention.",
    image: dashboard,
  },
  {
    id: "manager",
    badgeLabel: "HABIT MANAGER",
    title: "Habit Manager",
    tagline: "Simple consistency",
    description:
      "Create and organize habits in one clean space. Mark progress instantly without clutter.",
    image: habitmanager,
  },
  {
    id: "optimizer",
    badgeLabel: "SCHEDULE OPTIMIZER",
    title: "Schedule Optimizer",
    tagline: "Balance without burnout",
    description:
      "Balances habits across the week so your routine stays realistic and sustainable.", 
    image: optimizer,
  },
  {
    id: "analytics",
    badgeLabel: "HEATMAP ANALYTICS",
    title: "Heatmap Analytics",
    tagline: "Your consistency story",
    description:
      "Turn daily effort into a visual story of streaks, patterns, and quiet progress.",
    image: heatmapImg,
  },
  {
    id: "streaks",
    badgeLabel: "STREAK ENGINE",
    title: "Streak Engine",
    tagline: "Momentum that lasts",
    description:
      "Tracks current and best streaks so consistency feels rewarding, not punishing.",
    image: streak,
  },
];

export default function Features() {
  const defaultIndex = Math.floor(featureCards.length / 2);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const active = featureCards[activeIndex];

  return (
    <section
      id="features"
      className="relative min-h-screen overflow-hidden bg-[#2C261F] px-4 py-24 sm:px-6 lg:py-28"
    >
      {/* Header */}
      <div className="relative mx-auto mb-12 max-w-3xl text-center lg:mb-16">
        
        <h2 className="font-serif text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl">
          Features
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white sm:text-base">
          A focused set of tools designed for routines you actually keep —
          calm, clear, and built for consistency.
        </p>
      </div>

      {/* 3D Coverflow Carousel */}
      <div className="relative mx-auto max-w-6xl">
        {/* custom nav buttons */}
        <button
          type="button"
          className="features-prev cursor-pointer absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5DCD2] bg-white/90 text-[#5C5046] shadow-md backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 sm:left-2 lg:-left-2"
          aria-label="Previous feature"
        >
          <ChevronLeft size={20} strokeWidth={1.75} />
        </button>

        <button
          type="button"
          className="features-next cursor-pointer absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5DCD2] bg-white/90 text-[#5C5046] shadow-md backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 sm:right-2 lg:-right-2"
          aria-label="Next feature"
        >
          <ChevronRight size={20} strokeWidth={1.75} />
        </button>

        <Swiper
          modules={[EffectCoverflow, Pagination, Navigation]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={false}
          slidesPerView="auto"
          initialSlide={defaultIndex}
          coverflowEffect={{
            rotate: 18,       // side card tilt (like the Pinterest ref)
            stretch: 0,
            depth: 160,       // 3D depth
            modifier: 1.15,
            slideShadows: false,
          }}
          pagination={{
            el: ".features-pagination",
            clickable: true,
          }}
          navigation={{
            prevEl: ".features-prev",
            nextEl: ".features-next",
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="features-coverflow !overflow-visible px-2 py-8"
        >
          {featureCards.map((card) => (
            <SwiperSlide
              key={card.id}
              className="!flex !h-auto !w-[min(82vw,320px)] items-stretch sm:!w-[300px] lg:!w-[320px]"
            >
              <article className="flex h-full w-full flex-col rounded-[28px] border border-[#E8DFD6] bg-[#FFFCFA] p-5 shadow-[0_25px_60px_rgba(44,38,31,0.10)] transition-shadow duration-500 sm:p-6">
                {/* badge */}
                <div className="mb-4 text-center">
                  <h3 className="font-serif text-2xl tracking-tight text-[#3f3931]">
                    {card.title}
                  </h3>
                </div>

                {/* image / visual */}
                <div className={`mb-5 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#FBF8F5] to-[#F0E7DE] ${card.id === "analytics" ? "p-0" : "p-4"} shadow-inner`}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-fill"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  
                </div>

                {/* copy */}
                <div className="mt-auto text-center">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9A8776]">
                    {card.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#6F655C]">
                    {card.description}
                  </p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* pagination dots (Swiper will inject bullets here) */}
        <div className="features-pagination mt-2 flex items-center justify-center gap-2" />
      </div>
      

      {/* small local styles for Swiper bullets + active slide emphasis */}
      <style>{`
        .features-coverflow .swiper-slide {
          transition: transform 0.45s ease, opacity 0.45s ease, filter 0.45s ease;
          opacity: 0.55;
          filter: saturate(0.85);
        }
        .features-coverflow .swiper-slide-active {
          opacity: 1;
          filter: saturate(1);
        }
        .features-coverflow .swiper-slide-active article {
          box-shadow: 0 30px 70px rgba(44, 38, 31, 0.14);
          border-color: #d4c4b4;
        }
        .features-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d8c8bd;
          opacity: 1;
          border-radius: 999px;
          transition: all 0.3s ease;
        }
        .features-pagination .swiper-pagination-bullet-active {
          width: 28px;
          background: #8c7465;
        }
      `}</style>
    </section>
  );
}