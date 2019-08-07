import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';

function CarouselArrow ({direction, handleClick, hasArrows}) {
  return (
    <button
      className = {'myy-carousel__arrow-button myy-carousel__arrow-button--' + direction}
      onClick = {handleClick}
      style = {{opacity: hasArrows ? 1 : 0}}
      type = "button"
    >
      <SvgIcon name = {'feather-chevron-' + direction}/>
    </button>
  );
}

CarouselArrow.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
  handleClick: PropTypes.func,
  hasArrows: PropTypes.bool,
};

export default CarouselArrow;
