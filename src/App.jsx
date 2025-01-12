import { useEffect, useRef, useState } from "react"

import "./App.css"
import logo from "./assets/logo.png"
import discount from "./assets/discount_header.png"
import video from "./assets/kitsch-video.mp4"
import content1 from "./assets/content_1.png"
import content2 from "./assets/content_testimonials-footer.jpg"
import btnShopNow from "./assets/btn-shopnow.png"

import slide1 from "./assets/carousel/content_carousel_1.jpg"
import slide2 from "./assets/carousel/content_carousel_2.jpg"
import slide3 from "./assets/carousel/content_carousel_3.jpg"
import slide4 from "./assets/carousel/content_carousel_4.jpg"
import ImageSlider from "./ImageSlider"

function App() {
  const images = [slide1, slide2, slide3, slide4]

  const [isViewable, setIsViewable] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const discountDivRef = useRef(null)
  const logoDivRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const mraid = window.mraid || {};

  const handleScroll = () => {
    if (contentRef.current) {
      const scrollTop = contentRef.current.scrollTop;

      if (scrollTop >= 100) {
        discountDivRef.current.classList.add('hidden');
      } else {
        discountDivRef.current.classList.remove('hidden');
      }
    }
  }

  // Configuration Constants
  const SCROLL_SPEED = 1; // Pixels per tick
  const SCROLL_INTERVAL = 50; // Milliseconds
  const FALLBACK_DELAY = 1000; // Delay for non-MRAID environments

  // Utility: Starts auto-scrolling
  const startAutoScroll = () => {
    if (!isAutoScrolling || !contentRef.current) return;
    scrollIntervalRef.current = setInterval(() => {
      const content = contentRef.current;
      content.scrollTop += SCROLL_SPEED;
      if (content.scrollHeight - content.scrollTop <= content.clientHeight) {
        content.scrollTop = 0; // Reset scroll to top
      }
    }, SCROLL_INTERVAL);
  };

  // Utility: Stops auto-scrolling
  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
    clearInterval(scrollIntervalRef.current);
  };

  // Utility: Handles click actions
  const handleClickAction = () => {
    if (mraid.open && typeof mraid.open === "function") {
      mraid.open();
    } else {
      window.open();
    }
  };

  // Initialize scrolling and content visibility
  const initializeScrolling = () => {
    if (contentRef.current) {
      contentRef.current.style.display = "block"; // Ensure content is visible
    }
    if (isViewable) {
      startAutoScroll();
    }
  };

  // Initialize MRAID functionality
  const initializeMraid = () => {
    if (mraid && typeof mraid.getState === "function") {
      const state = mraid.getState();
      if (state === "loading") {
        mraid.addEventListener("ready", () => {
          setIsViewable(true);
          initializeScrolling();
        });
      } else {
        setIsViewable(true);
        initializeScrolling();
      }
    } else {
      // Fallback for non-MRAID environments
      setTimeout(initializeScrolling, FALLBACK_DELAY);
    }
  };

  // Add user interaction event listeners
  const addUserInteractionListeners = () => {
    const content = contentRef.current;
    if (!content) return;

    const events = ["touchstart", "mousedown", "wheel"];
    events.forEach((eventType) => {
      content.addEventListener(eventType, stopAutoScroll, { passive: true });
    });

    return () => {
      events.forEach((eventType) => {
        content.removeEventListener(eventType, stopAutoScroll);
      });
    };
  };

  // React Effect: Initialization
  useEffect(() => {
    initializeMraid();
    const cleanup = addUserInteractionListeners();

    return () => {
      clearInterval(scrollIntervalRef.current);
      if (cleanup) cleanup();
    };
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Start editing here depending on clients preference */}
      <div ref={discountDivRef} className="bg-black py-2 flex justify-center duration-300 linear transition-all" >
        <img src={discount} alt="Discount" className="w-full" />
      </div>

      <div className="sticky" ref={logoDivRef} onClick={handleClickAction}>
        <img src={logo} alt="Kitsch" className="w-full" />  
      </div>
      {/* Edint of editing here depending on clients preference */}
      
      <div className="overflow-y-scroll" id="content" ref={contentRef} onScroll={handleScroll}>
        {/* Start Editing here */}
        <video playsInline autoPlay muted loop className="w-full">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <img src={content1} alt="Best selling" className="w-full" />

        <ImageSlider images={images} interval={1500} />

        <img src={content2} alt="Content Bottom" className="w-full" />

        <div className="bg-white bg-opacity-70 p-7 w-full fixed bottom-0">
          <button className="mx-auto block pulse-button" onClick={handleClickAction}>
            <img className="w-full max-w-[300px]" src={btnShopNow} alt="Shop Now" />
          </button>
        </div>


        {/* End of Editing */}
      </div>
    </div>
  )
}

export default App
