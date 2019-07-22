import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';

function CarouselArrow ({direction, handleClick}) {
  const buttonStyle = {
    marginLeft: direction === 'right' ? 8 : null,
    marginRight: direction === 'left' ? 8 : null,
  };
  return (
    <button
      className = {'myy-carousel__arrow-button myy-carousel__arrow-button--' + direction}
      onClick = {handleClick}
      style = {buttonStyle}
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
