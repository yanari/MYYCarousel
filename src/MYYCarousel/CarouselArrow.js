import React from 'react';
import SvgIcon from './SvgIcon';

function CarouselArrow ({handleClick, direction}) {
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

export default CarouselArrow;
