import { AnimatePresence, useAnimate } from "framer-motion";
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
  ];

  return (
    <MouseImageTrail renderImageBuffer={50} rotationRange={25} images={images}>
      <section className="grid h-screen w-full place-content-center bg-[url('/background1.jpg')] bg-cover bg-no-repeat bg-center">
  <p className="flex items-center gap-2 text-8xl font-bold uppercase text-black z-10">
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
}) => {
  const [scope, animate] = useAnimate();
  const lastRenderPosition = useRef({ x: 0, y: 0 });
  const imageRenderCount = useRef(0);

  // State for cycling images at specific positions
  const [currentSet, setCurrentSet] = useState([]);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

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

      // Directly pass mouse coordinates to render the next image
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

    // Update position based on mouse coordinates
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = "translate(-50%, -50%)"; // Centers the image on the mouse

    const rotation = Math.random() * rotationRange;

    // Animate the image using framer-motion
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

    // Fade out the image after a delay
    animate(
      selector,
      {
        opacity: [1, 0],
      },
      { ease: "linear", duration: 0.5, delay: 3 }
    );

    imageRenderCount.current = imageRenderCount.current + 1;
  };
    
// Function to check if two positions overlap based on their bounding box
const isOverlapping = (newPos, existingPositions, imageSize) => {
  const halfSize = imageSize / 2;
  return existingPositions.some(({ x, y }) => {
    const distance = Math.sqrt((newPos.x - x) ** 2 + (newPos.y - y) ** 2);
    return distance < imageSize; // Check if the distance is less than the image size
  });
};

// Function to randomize positions within the viewport
const randomizePositions = (count) => {
  const positions = [];
  const imageSize = 200; // Assuming your image width is 160px

  while (positions.length < count) {
    const x = Math.random() * (window.innerWidth - imageSize); // Adjust for image width
    const y = Math.random() * (window.innerHeight - imageSize); // Adjust for image height
    const newPos = { x, y };
    
    if (!isOverlapping(newPos, positions, imageSize)) {
      positions.push(newPos);
    }
  }
  return positions;
};


  useEffect(() => {
  // Set positions immediately without initial setup
  const interval = setInterval(() => {
    const positions = randomizePositions(3); // Get new random positions
    setCurrentSet(positions.map((pos, i) => ({
      idx: i,
      pos: pos,
    })));
  }, 2000); // Adjusted interval for changing images

  return () => clearInterval(interval);
}, [images.length]);

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
          className="pointer-events-none absolute h-20 w-20 rounded-xl border-2 border-black bg-neutral-900 object-cover opacity-0"
          src={img}
          alt={`Mouse move image ${index}`}
          key={index}
          data-mouse-move-index={index}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)", // Center the image at the mouse point
          }}
        />
      ))}

      {/* Position images randomly on the screen */}
      <AnimatePresence>
        {currentSet.map(({ idx, pos }) => (
          <motion.img
          key={`ease-in-${idx}-${Date.now()}`} // Ensure a unique key with time
          src={images[idx]}
          alt={`Ease-in image ${idx}`}
          className="h-[180px] w-[320px] object-cover rounded-xl border-2 border-black" // Set height to 90px and width to 160px
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, left: pos.x, top: pos.y }}
          exit={{ opacity: 0, scale: 0.5, filter: "blur(5px)" }} // Blur before disappearing
          transition={{ duration: 1.2, ease: "easeInOut" }} // Slower animation for smoother transition
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)", // Center the image at the position
          }}
        />
        
        ))}
      </AnimatePresence>
    </div>
  );
};
