import './CarouselArrow.css';

import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';

function CarouselArrow (props) {
  const {
    direction,
    handleClick,
    hasArrows,
    size,
  } = props;
  return (
    <button
      className = "myy-carousel__arrow-button"
      onClick = {handleClick}
      style = {{opacity: hasArrows ? 1 : 0, '--arrow-size': size + 'px'}}
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
