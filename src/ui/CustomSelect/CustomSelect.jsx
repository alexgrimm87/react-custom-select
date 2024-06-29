import {useState, useEffect, useRef} from "react";
import {FixedSizeList as List} from 'react-window';
import PropTypes from "prop-types";
import useDebouncedCallback from "../../hooks/useDebouncedCallback.js";
import styles from './CustomSelect.module.scss';

const CustomSelect = ({list, loading, width, placeholder, onChange}) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [focus, setFocus] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [scrollPosition, setScrollPosition] = useState(0);

  const selectRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const onClickListItem = (i) => {
    setSelectedIndex(i);
    setFocusedIndex(i);
    setSelectedItem(list[i]);
    onChange(list[i]);
    setOpen(!open);
  };

  const handleKeyDown = (event) => {
    if (!open && event.key === 'Enter') {
      setOpen(true);
    }

    switch (event.key) {
      case 'ArrowDown':
        setFocusedIndex((prevIndex) => (prevIndex < list.length - 1 ? prevIndex + 1 : prevIndex));
        break;
      case 'ArrowUp':
        setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        break;
      case 'Enter':
        if (focusedIndex !== -1) {
          setSelectedItem(list[focusedIndex]);
          setSelectedIndex(focusedIndex);
          onChange(list[focusedIndex]);
          handleOpenDropdown();
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const handleItemMouseEnter = (index) => {
    if (focusedIndex === -1) {
      setFocusedIndex(index);
    }
  };

  const onListScroll = useDebouncedCallback((e) => {
    setScrollPosition(e.scrollOffset);
  }, 300);

  const handleOpenDropdown = () => {
    setOpen(!open);

    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTo(scrollPosition);
      }
    }, 0);
  };

  const ListItem = ({index, style}) => (
    <div
      style={{
        ...style,
        backgroundColor: index === focusedIndex ? '#1976D214' : 'white'
      }}
      className={`${styles.option} ${selectedIndex === index ? 'selected' : ''}`}
      onClick={() => onClickListItem(index)}
      onMouseEnter={() => handleItemMouseEnter(index)}
      onMouseLeave={() => setFocusedIndex(-1)}
      ref={(el) => (itemRefs.current[index] = el)}
    >
      {list[index]}
    </div>
  );

  ListItem.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !e.composedPath().includes(selectRef.current)) {
        setOpen(false);
        setFocus(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (focusedIndex !== -1 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

  return (
    <div
      className={styles.select}
      style={{width: `${width}`}}
      ref={selectRef}
      tabIndex="0"
      onFocus={() => setFocus(true)}
      onKeyDown={handleKeyDown}
    >
      <div className={`${styles.selectedLabel} ${focus ? 'focus' : ''} ${open ? 'open' : ''}`}
           onClick={handleOpenDropdown}
      >
        {selectedItem ? (
          <span>{selectedItem}</span>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <List
              className={styles.list}
              height={192}
              itemCount={list.length}
              itemSize={48}
              width={'100%'}
              ref={listRef}
              onScroll={onListScroll}
            >
              {ListItem}
            </List>
          )}
        </div>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  list: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  width: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default CustomSelect;
