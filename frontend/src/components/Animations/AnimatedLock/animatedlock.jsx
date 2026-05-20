import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedLock = () => {
  const [isLocked, setIsLocked] = useState(false);

  const particles = [
    { char: '1', color: '#ff6b6b', angle: 0, distance: 25 },
    { char: '0', color: '#4ecdc4', angle: 60, distance: 28 },
    { char: '#', color: '#45b7d1', angle: 120, distance: 30 },
    { char: '*', color: '#96ceb4', angle: 180, distance: 32 },
    { char: 'A', color: '#feca57', angle: 240, distance: 34 },
    { char: 'X', color: '#ff9ff3', angle: 300, distance: 36 },
  ];

  return (
    <div 
      className="lock-container"
      onMouseEnter={() => setIsLocked(true)}
      onMouseLeave={() => setIsLocked(false)}
      style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
    >
      <motion.svg 
        width="43" 
        height="56" 
        viewBox="0 0 43 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <g filter="url(#filter0_d_149_340)">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M34.6667 18.6666C36.8758 18.6666 38.6667 20.4575 38.6667 22.6666V39.3033C38.6666 40.8201 37.8135 42.2042 36.4388 42.845C32.6244 44.623 24.909 48 21.3333 48C17.7577 48 10.0423 44.623 6.22786 42.845C4.85312 42.2042 4.00007 40.8201 4 39.3033V22.6666C4 20.4575 5.79086 18.6666 8 18.6666H34.6667ZM21.3333 26.6666C19.8606 26.6666 18.6667 27.8605 18.6667 29.3333C18.6667 30.3196 19.2039 31.178 20 31.6393V37.3333C20 38.0697 20.597 38.6666 21.3333 38.6666C22.0236 38.6666 22.5917 38.1422 22.6602 37.47L22.6667 37.3333H23.3333C23.7015 37.3333 24 37.0348 24 36.6666C24 36.2984 23.7015 36 23.3333 36H22.6667V34.6666H23.3333C23.7015 34.6666 24 34.3681 24 34C24 33.6318 23.7015 33.3333 23.3333 33.3333H22.6667V31.6393C23.4628 31.178 24 30.3196 24 29.3333C24 27.8605 22.8061 26.6666 21.3333 26.6666Z" 
            fill="#D9D9D9"
          />
          
          <motion.path 
            d="M8 12H12V26.6667H8V12Z" 
            fill="#D9D9D9"
            animate={{ 
              d: isLocked ? "M8 18H12V26.6667H8V18Z" : "M8 12H12V26.6667H8V12Z"
            }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }}
          />
          
          <motion.path 
            d="M32 12C32 10.4241 31.6896 8.86371 31.0866 7.4078C30.4835 5.95189 29.5996 4.62902 28.4853 3.51472C27.371 2.40042 26.0481 1.5165 24.5922 0.913445C23.1363 0.310389 21.5759 -6.88831e-08 20 0C18.4241 6.88831e-08 16.8637 0.310389 15.4078 0.913446C13.9519 1.5165 12.629 2.40042 11.5147 3.51472C10.4004 4.62902 9.5165 5.95189 8.91345 7.4078C8.31039 8.86371 8 10.4241 8 12L12.0106 12C12.0106 10.9508 12.2172 9.91191 12.6188 8.94259C13.0203 7.97327 13.6088 7.09252 14.3506 6.35064C15.0925 5.60875 15.9733 5.02026 16.9426 4.61875C17.9119 4.21725 18.9508 4.0106 20 4.0106C21.0492 4.0106 22.0881 4.21725 23.0574 4.61875C24.0267 5.02026 24.9075 5.60875 25.6494 6.35064C26.3912 7.09252 26.9797 7.97327 27.3812 8.94259C27.7828 9.91191 27.9894 10.9508 27.9894 12H32Z" 
            fill="#D9D9D9"
            animate={{ 
              y: isLocked ? 6 : 0,
              scaleY: isLocked ? 0.7 : 1
            }}
            transition={{ 
              duration: 0.4,
              type: "spring", 
              stiffness: 250,
              damping: 15
            }}
          />
        </g>
        
        <defs>
          <filter id="filter0_d_149_340" x="0" y="0" width="42.6667" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_149_340" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_149_340" result="shape" />
          </filter>
        </defs>
      </motion.svg>

      <AnimatePresence>
        {isLocked && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}>
            {particles.map((particle, index) => (
              <motion.div
                key={index}
                style={{
                  position: 'absolute',
                  fontSize: '10px',
                  fontWeight: '900',
                  color: particle.color,
                  textShadow: '0 0 4px currentColor'
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 1, 
                  x: 0, 
                  y: 0 
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [1, 1.2, 1, 0.8],
                  x: Math.cos(particle.angle * Math.PI / 180) * particle.distance,
                  y: Math.sin(particle.angle * Math.PI / 180) * particle.distance,
                  rotate: [0, 180, 360],
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0 
                }}
                transition={{
                  duration: 1.0,
                  delay: 0,
                  times: [0, 0.2, 0.7, 1],
                  ease: "easeOut"
                }}
              >
                {particle.char}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedLock;