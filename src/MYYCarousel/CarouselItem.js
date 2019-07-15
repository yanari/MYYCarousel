import './CarouselItem.css';

import React from 'react';

function CarouselItem ({data, width}) {
  return (
    <div className = "myy-carousel__item" style = {{width}}>
      {data}
    </div>
  );
}

export default CarouselItem;
