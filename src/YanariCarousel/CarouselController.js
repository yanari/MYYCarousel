import React from 'react';

function CarouselController (props) {
  const {
    children,
    className,
    handleClick,
    style,
  } = props;
  return (
    <button
      className = {className}
      onClick = {handleClick}
      style = {style}
      type = "button"
    >
      {children}
    </button>
  );
}

export default CarouselController;
