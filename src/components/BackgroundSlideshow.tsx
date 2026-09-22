import React, { useEffect, useState } from 'react';

interface BackgroundSlideshowProps {
  images: string[];
  intervalMs?: number;
  transitionMs?: number;
}

const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({
  images,
  intervalMs = 7000,
  transitionMs = 1400,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    images.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07164f]" aria-hidden="true">
      {images.map((src, imageIndex) => (
        <div
          key={src}
          className="campaign-background absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${src}")`,
            opacity: imageIndex === index ? 1 : 0,
            transform: imageIndex === index ? 'scale(1.08)' : 'scale(1)',
            transition: `opacity ${transitionMs}ms ease-in-out, transform ${intervalMs}ms ease-out`,
          }}
        />
      ))}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .campaign-background {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BackgroundSlideshow;
