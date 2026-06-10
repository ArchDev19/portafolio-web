import { useRef } from 'react';
// Import video asset so Vite handles the URL correctly
import avatarVideo from '../../assets/Avatar.webm';

interface AvatarProps {
  src: string;
  alt: string;
  numSize?: number; // Size in pixels
  className?: string;
}

export const Avatar = ({
  src,
  alt,
  numSize = 400,
  className = ''
}: AvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dimensions moved to CSS for hover transitions

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Reiniciar
      videoRef.current.play().catch(e => console.error("Error playing video:", e));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Mac Window Header Component reusable
  const MacHeader = () => (
    <div className="avatar-tools">
      <div className="avatar-circle"><span className="avatar-box red" /></div>
      <div className="avatar-circle"><span className="avatar-box yellow" /></div>
      <div className="avatar-circle"><span className="avatar-box green" /></div>
    </div>
  );

  return (
    <div className="avatar-neon-wrapper" style={{ width: `${numSize * 1.1}px`, height: `${numSize * 1.1}px` }}>
      <div className="avatar-neon-ring-1"></div>
      <div className="avatar-neon-ring-2"></div>
      <div
        className={`avatar-perspective ${className}`}
        style={{ width: '100%', height: '100%' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="avatar-flip-inner">
          {/* Front Face: Image */}
          <div className="avatar-face avatar-front">
            <MacHeader />
            <div className="avatar-content">
              <img src={src} alt={alt} />
            </div>
          </div>

          {/* Back Face: Video */}
          <div className="avatar-face avatar-back">
            <MacHeader />
            <div className="avatar-content">
              <video
                ref={videoRef}
                src={avatarVideo}
                muted
                playsInline
                style={{ objectPosition: 'center bottom' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
