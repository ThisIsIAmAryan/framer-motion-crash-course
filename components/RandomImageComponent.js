import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Fixed positions for images
const fixedPositions = [
  { top: '15vh', left: '10vw' },
  { top: '10vh', left: '70vw' },
  { top: '50vh', left: '20vw' },
  { top: '45vh', left: '60vw' },
  { top: '80vh', left: '35vw' },
  { top: '78vh', left: '70vw' },
  { top: '33vh', left: '40vw' },
  { top: '30vh', left: '88vw' },
  { top: '60vh', left: '30vw' },
  { top: '83vh', left: '80vw' },
];

const RandomImageComponent = () => {
  const imageSets = [
    ['/imgs/active/img1.jpg', '/imgs/active/img2.jpg', '/imgs/active/img3.jpg'],
    ['/imgs/active/img4.jpg', '/imgs/active/img5.jpeg', '/imgs/active/img6.jpeg'],
    ['/imgs/active/img7.jpeg', '/imgs/active/img8.jpeg', '/imgs/active/img9.jpeg'],
  ];

  const [currentSet, setCurrentSet] = useState(0);
  const [imageSizes, setImageSizes] = useState([]);

  const desiredWidth = 300; // Adjust image size to be larger

  useEffect(() => {
    const loadImages = async (images) => {
      const sizes = await Promise.all(images.map(async (src) => {
        const img = new Image();
        img.src = src;
        await img.decode(); // Wait for the image to load
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const height = desiredWidth / aspectRatio;
        return { width: desiredWidth, height };
      }));
      setImageSizes(sizes);
    };

    loadImages(imageSets[currentSet]);

    const interval = setInterval(() => {
      setCurrentSet((prevSet) => (prevSet + 1) % imageSets.length);
    }, 2000); // Change set every 2 seconds

    return () => clearInterval(interval);
  }, [currentSet]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Centered H1 Text */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-6xl font-bold text-black relative">
          <span className="absolute inset-0 text-white -z-10 filter blur-[2px]">
            FuturePreneurs 10.0
          </span>
          FuturePreneurs 10.0
        </h1>
      </div>

      {/* Red Border for Testing */}
      <div className="absolute inset-0 border-4 border-blue-400 pointer-events-none z-0"></div>

      {/* Images with Animation */}
      <AnimatePresence mode="wait">
        {imageSets[currentSet].map((image, index) => (
          <motion.img
            key={image}
            src={image}
            alt={`Random Image ${index + 1}`}
            className="absolute z-0 border-2 border-green-500 rounded-lg"
            style={{
              width: `${imageSizes[index]?.width}px`,
              height: `${imageSizes[index]?.height}px`,
              top: fixedPositions[index]?.top,
              left: fixedPositions[index]?.left,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RandomImageComponent;
