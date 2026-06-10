import { useEffect, useState } from 'react';
import './taskManager.css';

const SpaceBackground = () => {
  const [shootingStars, setShootingStars] = useState<{ id: number; top: string; left: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate random shooting stars
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 8; i++) {
        newStars.push({
          id: Math.random(),
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 80}%`,
          delay: `${Math.random() * 5}s`,
        });
      }
      setShootingStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tm-space-background">
      <div className="tm-stars"></div>
      <div className="tm-stars2"></div>
      <div className="tm-stars3"></div>
      
      {shootingStars.map(star => (
        <div 
          key={star.id} 
          className="tm-shooting-star"
          style={{ top: star.top, left: star.left, animationDelay: star.delay }}
        />
      ))}
      
      <div className="tm-earth-container">
        <div className="tm-earth"></div>
      </div>
      <div className="tm-overlay"></div>
    </div>
  );
};

export default SpaceBackground;
