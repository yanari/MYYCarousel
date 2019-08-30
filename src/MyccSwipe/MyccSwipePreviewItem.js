import './MyccSwipePreviewItem.css';

import React from 'react';
import PropTypes from 'prop-types';

function MyccSwipePreviewItem (props) {
  const {
    handleClick,
    itemPreviewIsClickable,
    itemPreviewWidth,
  } = props;
  return (
    <button
      className = "mycc-swipe__preview-button"
      onClick = {handleClick}
      style = {{zIndex: itemPreviewIsClickable ? 1 : -1}}
      type = "button"
    >
      <div style = {{minHeight: 1, width: itemPreviewWidth}}/>
    </button>
  );
}

MyccSwipePreviewItem.propTypes = {
  handleClick: PropTypes.func.isRequired,
  itemPreviewIsClickable: PropTypes.bool.isRequired,
  itemPreviewWidth: PropTypes.number.isRequired,
};

export default MyccSwipePreviewItem;
