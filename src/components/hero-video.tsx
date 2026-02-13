"use client";

import { useRef, useEffect, useState } from "react";

const VIDEO_URL =
  "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setLoaded(true);
    video.addEventListener("canplay", handleCanPlay);

    // Attempt autoplay (muted videos autoplay in all modern browsers)
    video.play().catch(() => {
      // Autoplay blocked — still show the overlay gradient
    });

    return () => video.removeEventListener("canplay", handleCanPlay);
  }, []);

  return (
    <div className="hero-video-wrap">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className={`transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
    </div>
  );
}
