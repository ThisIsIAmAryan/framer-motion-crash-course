import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LegacyComponent = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showImages, setShowImages] = useState(false);

  const headingVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setShowImages(true);
    }, 500); // Display intro for 0.5 seconds
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
  <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <motion.h1
      variants={headingVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="text-4xl font-bold"
    >
      FuturePreneurs 10.0
    </motion.h1>

    <motion.img
      src="/imgs/active/img1.jpg"
      alt="Image 1"
      className="absolute top-0 left-0 w-36 h-36 object-contain"
      variants={imageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    />
    <motion.img
      src="/imgs/active/img2.jpg"
      alt="Image 2"
      className="absolute top-0 right-0 w-36 h-36 object-contain"
      variants={imageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    />
    <motion.img
      src="/imgs/active/img3.jpg"
      alt="Image 3"
      className="absolute bottom-0 right-0 w-36 h-36 object-contain"
      variants={imageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    />
  </div>
);

};

export default LegacyComponent;
