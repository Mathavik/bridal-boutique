import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function NewArrivals() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [autoPlay, setAutoPlay] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sliderRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const navigate = useNavigate();

  const companyId = localStorage.getItem("selected_company_id") || "1";

  useEffect(() => {
    fetchNewArrivalVideos();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(autoPlayTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!autoPlay || videos.length <= visibleCount) {
      clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      scrollRight();
    }, 4000);

    return () => clearInterval(autoPlayTimerRef.current);
  }, [autoPlay, videos, visibleCount]);

  const handleResize = () => {
    if (window.innerWidth < 640) {
      setVisibleCount(1);
    } else if (window.innerWidth < 1024) {
      setVisibleCount(2);
    } else {
      setVisibleCount(4);
    }
  };

  const fetchNewArrivalVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching videos for company:", companyId);

      const res = await api.get(
        `/category/get_new_arrivals_videos.php?company_id=${companyId}&limit=20`
      );

      console.log("Videos Response:", res.data);

      if (res.data.status && res.data.data && res.data.data.length > 0) {
        console.log("First video data:", res.data.data[0]); // Debug
        setVideos(res.data.data);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    clearInterval(autoPlayTimerRef.current);
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 300;
      const gap = 24;
      sliderRef.current.scrollBy({ left: -(cardWidth + gap) * visibleCount, behavior: 'smooth' });
    }
    setTimeout(() => {
      if (autoPlay) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = setInterval(() => scrollRight(), 4000);
      }
    }, 3000);
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 300;
      const gap = 24;
      const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

      if (sliderRef.current.scrollLeft + sliderRef.current.clientWidth >= maxScroll - 10) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: (cardWidth + gap) * visibleCount, behavior: 'smooth' });
      }
    }
  };

  const handleManualScroll = () => {
    clearInterval(autoPlayTimerRef.current);
    if (autoPlay) {
      setTimeout(() => {
        autoPlayTimerRef.current = setInterval(() => scrollRight(), 4000);
      }, 3000);
    }
  };

  // Split title into 2 lines
  const splitTitle = (title) => {
    if (!title) return { line1: "", line2: "" };

    if (title.includes("&")) {
      const parts = title.split("&");
      return { line1: parts[0].trim(), line2: "& " + parts[1].trim() };
    }

    const words = title.split(" ");
    if (words.length > 2) {
      const mid = Math.ceil(words.length / 2);
      return {
        line1: words.slice(0, mid).join(" "),
        line2: words.slice(mid).join(" ")
      };
    }

    return { line1: title, line2: "" };
  };

  // Get current slide index for dot indicator
  const getCurrentSlideIndex = () => {
    if (!sliderRef.current) return 0;
    const cardWidth = sliderRef.current.children[0]?.offsetWidth || 300;
    const gap = 24;
    const scrollLeft = sliderRef.current.scrollLeft || 0;
    return Math.round(scrollLeft / ((cardWidth + gap) * visibleCount));
  };

  // Handle SHOP NOW click
  const handleShopNow = (video) => {
    console.log("Navigating with category_id:", video.category_id);
    if (video.category_id) {
      navigate(`/bridal-lehenga?category_id=${video.category_id}`);
    } else {
      // Fallback - go to all products
      navigate('/bridal-lehenga');
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-4xl font-semibold tracking-[6px] uppercase text-gray-900 mb-12">
            New Arrivals On Sale
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-[480px] rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-4xl font-semibold tracking-[6px] uppercase text-gray-900 mb-12">
            New Arrivals On Sale
          </h2>
          <div className="text-center text-red-500 py-20">{error}</div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-4xl font-semibold tracking-[6px] uppercase text-gray-900 mb-12">
            New Arrivals On Sale
          </h2>
          <div className="text-center text-gray-400 py-20">
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">No videos available yet</p>
            <p className="text-sm">Upload videos to showcase new arrivals!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-center text-4xl font-semibold tracking-[6px] uppercase text-gray-900 mb-12">
          New Arrivals On Sale
        </h2>

        {/* Slider Container */}
        <div
          className="relative"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg -ml-5 transition-all duration-300 hover:scale-110 border border-gray-200 flex items-center justify-center"
            style={{ display: videos.length <= visibleCount ? 'none' : 'flex' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onScroll={handleManualScroll}
          >
            {videos.map((video, index) => {
              const { line1, line2 } = splitTitle(video.video_title || video.category_name || "Untitled");
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={video.video_id}
                  className="min-w-[calc(25%-18px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] relative overflow-hidden group cursor-pointer flex-shrink-0"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Video */}
                  <video
                    src={video.video_url}
                    className="w-full h-[480px] object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={(e) => {
                      console.error("Video failed to load:", video.video_url);
                      e.target.style.display = 'none';
                    }}
                  />

                  {/* Overlay with Text at Bottom */}
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-end items-center text-center pb-6 px-6">
                    {/* Line 1 */}
                    {line1 && (
                      <h3
                        className="text-white text-[28px] leading-[100%] text-center capitalize"
                        style={{
                          fontFamily: "Porsha Richela",
                          fontWeight: 400,
                          letterSpacing: "0%",
                        }}
                      >
                        {line1}
                      </h3>
                    )}

                    {/* Line 2 */}
                    {line2 && (
                      <h4
                        className="text-white text-[28px] leading-[100%] text-center capitalize mt-1"
                        style={{
                          fontFamily: "Porsha Richela",
                          fontWeight: 400,
                          letterSpacing: "0%",
                        }}
                      >
                        {line2}
                      </h4>
                    )}

                    {/* SHOP NOW Button */}
                    <button
                      onClick={() => handleShopNow(video)}
                      className={`mt-6 border-2 border-white bg-transparent text-white font-medium px-10 py-3.5 transition-all duration-300 ${
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      SHOP NOW
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg -mr-5 transition-all duration-300 hover:scale-110 border border-gray-200 flex items-center justify-center"
            style={{ display: videos.length <= visibleCount ? 'none' : 'flex' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dot Indicators */}
        {videos.length > visibleCount && (
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: Math.ceil(videos.length / visibleCount) }).map((_, index) => {
              const currentSlide = getCurrentSlideIndex();
              return (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-[#a97c50] w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => {
                    clearInterval(autoPlayTimerRef.current);
                    if (sliderRef.current) {
                      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 300;
                      const gap = 24;
                      sliderRef.current.scrollTo({
                        left: (cardWidth + gap) * index * visibleCount,
                        behavior: 'smooth'
                      });
                    }
                    setTimeout(() => {
                      if (autoPlay) {
                        autoPlayTimerRef.current = setInterval(() => scrollRight(), 4000);
                      }
                    }, 3000);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

export default NewArrivals;