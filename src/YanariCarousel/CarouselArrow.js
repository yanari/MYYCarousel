import './CarouselArrow.css';

import React from 'react';
import PropTypes from 'prop-types';
import CarouselController from './CarouselController';
import SvgIcon from './SvgIcon';

function CarouselArrow ({direction, handleClick, size}) {
  return (
    <CarouselController
      className = "yanari-carousel__arrow-button"
      handleClick = {handleClick}
      style = {{'--yanari-carousel-arrow-size': size + 'px'}}
    >
      <SvgIcon name = {'feather-chevron-' + direction}/>
    </CarouselController>
  );
}

CarouselArrow.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
};

export default CarouselArrow;
