import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';

function CarouselArrow ({direction, handleClick}) {
  return (
    <button
      className = {'myy-carousel__arrow-button myy-carousel__arrow-button--' + direction}
      onClick = {handleClick}
      type = "button"
    >
      <SvgIcon name = {'feather-chevron-' + direction}/>
    </button>
  );
}

CarouselArrow.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
  handleClick: PropTypes.func,
};

export default CarouselArrow;
