import { useAnimate } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { FiMousePointer } from "react-icons/fi";
import { motion } from "framer-motion";

export const MouseTrail = () => {
  const images = [
    "/imgs/active/img1.jpg",
    "/imgs/active/img2.jpg",
    "/imgs/active/img3.jpg",
    "/imgs/active/img4.jpg",
    "/imgs/active/img5.jpeg",
    "/imgs/active/img6.jpeg",
    "/imgs/active/img7.jpeg",
    "/imgs/active/img8.jpeg",
    "/imgs/active/img9.jpg",
  ];

  const imageGroups = [
    [0, 3, 6], // Group for cells 1, 4, 7
    [1, 8, 4], // Group for cells 2, 9, 5
    [2, 5, 7]  // Group for cells 3, 6, 8
  ];

  return (
    <MouseImageTrail renderImageBuffer={50} rotationRange={25} images={images} imageGroups={imageGroups}>
      <section className="grid h-screen w-full place-content-center bg-white">
        <p className="flex items-center gap-2 text-3xl font-bold uppercase text-black">
          <FiMousePointer />
          <span>FuturePreneurs</span>
        </p>
      </section>
    </MouseImageTrail>
  );
};

const MouseImageTrail = ({
  children,
  images,
  renderImageBuffer,
  rotationRange,
  imageGroups
}) => {
  const [scope, animate] = useAnimate();
  const lastRenderPosition = useRef({ x: 0, y: 0 });
  const imageRenderCount = useRef(0);

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  // Update mouse move handler
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    const distance = calculateDistance(
      clientX,
      clientY,
      lastRenderPosition.current.x,
      lastRenderPosition.current.y
    );

    if (distance >= renderImageBuffer) {
      lastRenderPosition.current.x = clientX;
      lastRenderPosition.current.y = clientY;

      renderNextImage(clientX, clientY);
    }
  };

  // Distance calculation function
  const calculateDistance = (x1, y1, x2, y2) => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  // Function to render the next image at the mouse position
  const renderNextImage = (x, y) => {
    const imageIndex = imageRenderCount.current % images.length;
    const selector = `[data-mouse-move-index="${imageIndex}"]`;

    const el = document.querySelector(selector);

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = "translate(-50%, -50%)";

    const rotation = Math.random() * rotationRange;

    animate(
      selector,
      {
        opacity: [0, 1],
        transform: [
          `scale(0.5) rotate(${rotation}deg)`,
          `scale(1) rotate(${rotation}deg)`,
        ],
      },
      { type: "spring", damping: 15, stiffness: 200 }
    );

    animate(
      selector,
      {
        opacity: [1, 0],
      },
      { ease: "linear", duration: 0.5, delay: 5 }
    );

    imageRenderCount.current += 1;
  };

  // Ease-in functionality for images at specified positions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGroupIndex((prev) => (prev + 1) % imageGroups.length);
    }, 3000); // Set interval for changing groups
    return () => clearInterval(interval);
  }, [imageGroups.length]);

  return (
    <div
      ref={scope}
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {children}

      {/* Mouse trail images */}
      {images.map((img, index) => (
        <img
          className="pointer-events-none absolute h-24 w-24 rounded-xl border-2 border-black bg-neutral-900 object-cover opacity-0"
          src={img}
          alt={`Mouse move image ${index}`}
          key={index}
          data-mouse-move-index={index}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Hardcoded 3x3 grid for ease-in images */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4 p-4">
        {imageGroups[currentGroupIndex].map((imageIndex, idx) => (
          <motion.img
            key={imageIndex}
            src={images[imageIndex]}
            alt={`Ease-in image ${imageIndex}`}
            className="h-full w-full object-cover rounded-xl border-4 border-black"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(5px)" }}
            transition={{ duration: 1, ease: "easeIn" }}
            style={{
              gridColumn: (idx % 3) + 1,
              gridRow: Math.floor(idx / 3) + 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};
