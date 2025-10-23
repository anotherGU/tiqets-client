import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import styles from "./Dropdown.module.css";
import { IoIosArrowDown } from "react-icons/io";

interface IDropDownProps {
  title: string;
  color?: string;
  children?: ReactNode;
  is_open?: boolean;
}

const Dropdown: FC<IDropDownProps> = ({ children, title, color , is_open}) => {
  const [isExpanded, setIsExpanded] = useState(is_open);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdown__header} onClick={toggleDropdown}>
        <h3 className={styles.dropdown__title}>{title}</h3>
        <IoIosArrowDown
          size={29}
          color="#76819e"
          className={`${styles.dropdown__arrow} ${
            isExpanded ? styles.expanded : ""
          }`}
        />
      </div>
      <div
        className={styles.dropdown__content}
        style={{
          minHeight: isExpanded ? `${contentHeight}px` : "0px",
          transition: "min-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          ref={contentRef}
          className={styles.dropdown__inner}
          style={{
            color: color ? `${color}` : "",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
