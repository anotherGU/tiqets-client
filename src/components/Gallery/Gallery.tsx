import { useState, useEffect, useRef } from "react";
import styles from "./Gallery.module.css";
import {
  IoImagesOutline,
  IoClose,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

const Gallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Массив изображений для галереи
  const galleryImages = [
    "/assets/gallery/fullScreen/2a3f6b35b65e4a1b90f3cc0f7d556a33.avif",
    "/assets/gallery/fullScreen/3b3d4be4f4c241948f92485812cb604f.avif",
    "/assets/gallery/fullScreen/d0a005e7c3e640ea9fdf112cc6ef83f3.avif",
    "/assets/gallery/fullScreen/ddfd3163961f4770b82e70462dc1fa72.avif",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
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
      document.body.style.overflow = "hidden"; // Блокируем прокрутку страницы
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset"; // Восстанавливаем прокрутку
    };
  }, [isModalOpen]);

  return (
    <>
      <div className={styles.gallery}>
        <div className={styles.big__block} onClick={() => setIsModalOpen(true)}>
          <img
            className={styles.gallery__item}
            src="/assets/gallery/2a3f6b35b65e4a1b90f3cc0f7d556a33.avif"
            alt="Gallery image 1"
          />
        </div>

        <div
          className={styles.small__block_3}
          onClick={() => setIsModalOpen(true)}
        >
          <img
            className={styles.gallery__item}
            src="/assets/gallery/ddfd3163961f4770b82e70462dc1fa72.avif"
            alt="Gallery image 2"
          />
        </div>
        <div
          className={styles.small__block_4}
          onClick={() => setIsModalOpen(true)}
        >
          <img
            className={styles.gallery__item}
            src="/assets/gallery/3b3d4be4f4c241948f92485812cb604f.avif"
            alt="Gallery image 3"
          />
          <div
            className={styles.gallery__btn}
            onClick={() => setIsModalOpen(true)}
          >
            <IoImagesOutline size={24} />
            Gallery
          </div>
        </div>
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
                src={galleryImages[currentImageIndex]}
                alt={`Gallery image ${currentImageIndex + 1}`}
                className={styles.modalImage}
              />
            </div>

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
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
