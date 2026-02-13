"use client";

import { useRef, useEffect, useState } from "react";

interface HeroVideoProps {
  videoUrl?: string;
}

export function HeroVideo({ videoUrl }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setLoaded(false);

    const handleCanPlay = () => setLoaded(true);
    video.addEventListener("canplay", handleCanPlay);

    video.load();
    video.play().catch(() => {
      // Autoplay blocked — still show the overlay gradient
    });

    return () => video.removeEventListener("canplay", handleCanPlay);
  }, [videoUrl]);

  if (!videoUrl) return null;

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
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}
