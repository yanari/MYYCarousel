import './CarouselArrow.css';

import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';

function CarouselArrow ({direction, handleClick, size}) {
  return (
    <button
      className = "yanari-carousel__arrow-button"
      onClick = {handleClick}
      style = {{'--yanari-carousel-arrow-size': size + 'px'}}
    >
      <SvgIcon name = {'feather-chevron-' + direction}/>
    </button>
  );
}

CarouselArrow.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
};

export default CarouselArrow;
