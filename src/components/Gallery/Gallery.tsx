import { useState, useEffect, useRef } from "react";
import styles from "./Gallery.module.css";
import {
  IoImagesOutline,
  IoClose,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

interface GalleryProps {
  images: string[];
}

const Gallery = ({ images }: GalleryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Если нет изображений, показываем заглушку
  if (!images || images.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.big__block}>
          <img
            className={styles.gallery__item}
            src="/assets/placeholder.jpg"
            alt="No image available"
          />
        </div>
      </div>
    );
  }

  // Берем первые 3 изображения для превью
  const previewImages = images.slice(0, 3);
  const hasMultipleImages = images.length > 1;

  const openModal = (index: number = 0) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Обработчики для клика по превью изображениям
  const handleSmallImageClick = (index: number) => {
    // index + 1 потому что первое изображение уже показано в большом блоке
    openModal(index + 1);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <div className={styles.gallery}>
        {/* Большое основное изображение */}
        <div className={styles.big__block} onClick={() => openModal(0)}>
          <img
            className={styles.gallery__item}
            src={previewImages[0]}
            alt="Main gallery image"
          />
        </div>

        {/* Маленькие изображения (показываем только если есть больше 1 изображения) */}
        {hasMultipleImages && (
          <>
            {/* Второе изображение */}
            {previewImages[1] && (
              <div
                className={styles.small__block_3}
                onClick={() => handleSmallImageClick(0)}
              >
                <img
                  className={styles.gallery__item}
                  src={previewImages[1]}
                  alt="Gallery image 2"
                />
              </div>
            )}

            {/* Третье изображение + кнопка галереи */}
            {previewImages[2] && (
              <div
                className={styles.small__block_4}
                onClick={() => handleSmallImageClick(1)}
              >
                <img
                  className={styles.gallery__item}
                  src={previewImages[2]}
                  alt="Gallery image 3"
                />
                {/* Кнопка галереи показывается только если есть больше 3 изображений */}
                {images.length > 3 && (
                  <div
                    className={styles.gallery__btn}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(0);
                    }}
                  >
                    <IoImagesOutline size={24} />
                    +{images.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Если только 2 изображения, показываем кнопку галереи во втором блоке */}
            {images.length === 2 && (
              <div
                className={styles.small__block_4}
                onClick={() => handleSmallImageClick(0)}
              >
                <img
                  className={styles.gallery__item}
                  src={previewImages[1]}
                  alt="Gallery image 2"
                />
                <div
                  className={styles.gallery__btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(0);
                  }}
                >
                  <IoImagesOutline size={24} />
                  Gallery
                </div>
              </div>
            )}
          </>
        )}

        {/* Если только 1 изображение, показываем кнопку галереи */}
        {!hasMultipleImages && (
          <div
            className={styles.small__block_4}
            onClick={() => openModal(0)}
          >
            <div className={styles.gallery__item} style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>No additional images</span>
            </div>
            <div
              className={styles.gallery__btn}
              onClick={(e) => {
                e.stopPropagation();
                openModal(0);
              }}
            >
              <IoImagesOutline size={24} />
              View
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно галереи */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} ref={modalRef}>
            <button
              className={styles.closeButton}
              onClick={() => setIsModalOpen(false)}
            >
              <IoClose size={32} />
            </button>

            <div className={styles.imageContainer}>
              <img
                src={images[currentImageIndex]}
                alt={`Gallery image ${currentImageIndex + 1}`}
                className={styles.modalImage}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  className={styles.navButton}
                  onClick={prevImage}
                  style={{ left: "20px" }}
                >
                  <IoChevronBack size={32} />
                </button>

                <button
                  className={styles.navButton}
                  onClick={nextImage}
                  style={{ right: "20px" }}
                >
                  <IoChevronForward size={32} />
                </button>

                <div className={styles.imageCounter}>
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;