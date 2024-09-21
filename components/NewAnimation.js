import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function NewAnimation() {
  const images = [
    { src: '/imgs/active/img1.jpg', top: '15%', left: '25%' },
    { src: '/imgs/active/img2.jpg', top: '25%', left: '15%' },
    { src: '/imgs/active/img3.jpg', top: '55%', left: '65%' },
    { src: '/imgs/active/img4.jpg', top: '5%', left: '60%' },
    { src: '/imgs/active/img5.jpeg', top: '35%', left: '75%' },
    { src: '/imgs/active/img6.jpeg', top: '65%', left: '45%' },
    { src: '/imgs/active/img7.jpeg', top: '70%', left: '20%' },
    { src: '/imgs/active/img8.jpeg', top: '15%', left: '75%' },
    { src: '/imgs/active/img9.jpeg', top: '50%', left: '15%' },
  ];

  const imageSets = [
    [0, 5, 3], // img1, img6, img4
    [6, 1, 4], // img7, img2, img5
    [7, 8, 2], // img8, img9, img3
  ];

  const [currentSet, setCurrentSet] = useState(0); // Track which set is visible
  const [fadeOut, setFadeOut] = useState(false); // Control fade-out state

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeOut(true); // Start fading out
      setTimeout(() => {
        setCurrentSet((prevSet) => (prevSet + 1) % imageSets.length); // Change the image set
        setFadeOut(false); // Reset fade-out state for next transition
      }, 1500); // Wait for 1.5 seconds for fade-out to complete before switching set
    }, 4000); // Change the set every 4 seconds (2.5s visible + 1.5s fade out)

    return () => clearInterval(timer); // Cleanup interval
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Centered Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        zIndex: 10, // Ensure text is above images
      }}>
        FuturePreneurs 10.0
      </div>

      {images.map((image, index) => {
        const isFadingOut = fadeOut && !imageSets[currentSet].includes(index);
        const isFadingIn = !fadeOut && imageSets[currentSet].includes(index);
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: image.top,
              left: image.left,
              width: '20vw', // Image size
              height: '20vw',
              maxWidth: '200px',
              maxHeight: '200px',
              transition: 'opacity 1s ease', // Smooth transition for opacity
              opacity: isFadingIn ? 1 : (isFadingOut ? 0 : (imageSets[currentSet].includes(index) ? 1 : 0)), // Manage opacity
            }}
          >
            <Image
              src={image.src}
              alt={`Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        );
      })}
    </div>
  );
}
