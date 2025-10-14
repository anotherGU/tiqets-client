// Banner.tsx
import { useEffect, useRef } from 'react';
import styles from './Banner.module.css';

interface BannerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const Banner = ({ isOpen, onClose, imageUrl }: BannerProps) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bannerRef.current && !bannerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Блокируем скролл
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset'; // Восстанавливаем скролл
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div ref={bannerRef} className={styles.banner}>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close banner"
        >
          ×
        </button>
        <img 
          src={imageUrl} 
          alt="Promotional banner" 
          className={styles.bannerImage}
        />
      </div>
    </div>
  );
};

export default Banner;