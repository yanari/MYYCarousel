import './CarouselArrow.css';

import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function CarouselArrow (props) {
  const {
    arrow,
    direction,
    handleClick,
    isInactive,
  } = props;
  const classSet = cn(
    'yanari-carousel__arrow', {
      'yanari-carousel__arrow--left': direction === 'left',
    }, {
      'yanari-carousel__arrow--right': direction === 'right',
    }, {
      'is-inactive': isInactive,
    },
  );
  const styles = {
    marginLeft: direction === 'right' ? arrow.margin : 0,
    marginRight: direction === 'left' ? arrow.margin : 0,
    width: arrow.size,
  };
  return (
    <button
      className = {classSet}
      disabled = {isInactive}
      onClick = {handleClick}
      style = {styles}
      type = "button"
    >
      {arrow.label}
    </button>
  );
}

CarouselArrow.propTypes = {
  arrow: PropTypes.instanceOf(Object).isRequired,
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  handleClick: PropTypes.func.isRequired,
  isInactive: PropTypes.bool.isRequired,
};

export default CarouselArrow;
