import './MyccSwipeArrow.css';

import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function MyccSwipeArrow (props) {
  const {
    arrow,
    direction,
    handleClick,
    isInactive,
  } = props;
  const classSet = cn(
    'mycc-swipe__arrow', {
      'mycc-swipe__arrow--left': direction === 'left',
    }, {
      'mycc-swipe__arrow--right': direction === 'right',
    }, {
      'is-inactive': isInactive,
    },
  );
  const styles = {
    marginLeft: direction === 'right' ? arrow.margin : 0,
    marginRight: direction === 'left' ? arrow.margin : 0,
    width: arrow.width,
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

MyccSwipeArrow.propTypes = {
  arrow: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    margin: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  handleClick: PropTypes.func.isRequired,
  isInactive: PropTypes.bool.isRequired,
};

export default MyccSwipeArrow;
