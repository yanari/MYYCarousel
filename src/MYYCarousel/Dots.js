import './Dots.css';

import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function Dots (props) {
  const {
    carouselIndex,
    items,
    setCarouselIndex,
  } = props;
  return (
    <div className = "myy-carousel__dots-container">
      {items.map((data, index) => {
        return (
          <button
            className = "myy-carousel__dot-button"
            key = {data.key}
            onClick = {() => setCarouselIndex(index)}
          >
            <div className = {cn('myy-carousel__dot', {'active': index === carouselIndex})}/>
          </button>
        );
      })}
    </div>
  );
}

Dots.propTypes = {
  carouselIndex: PropTypes.number,
  items: PropTypes.node,
  setCarouselIndex: PropTypes.func,
};

export default Dots;
