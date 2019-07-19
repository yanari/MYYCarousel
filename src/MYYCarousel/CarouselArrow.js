import React from 'react';
import SvgIcon from './SvgIcon';

function CarouselArrow ({handleClick, direction}) {
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

export default CarouselArrow;
