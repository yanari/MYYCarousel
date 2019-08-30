import './MyccSwipeDots.css';

import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function MyccSwipeDots (props) {
  const {
    carouselIndex,
    items,
    setCarouselIndex,
  } = props;
  return (
    <div className = "mycc-swipe__dots-container">
      {items.map((data, index) => {
        return (
          <button
            className = "mycc-swipe__dot-button"
            key = {data.key}
            onClick = {() => setCarouselIndex(index)}
            type = "button"
          >
            <div className = {cn('mycc-swipe__dot', {'active': index === carouselIndex})}/>
          </button>
        );
      })}
    </div>
  );
}

MyccSwipeDots.propTypes = {
  carouselIndex: PropTypes.number.isRequired,
  items: PropTypes.instanceOf(Object).isRequired,
  setCarouselIndex: PropTypes.func.isRequired,
};

export default MyccSwipeDots;
