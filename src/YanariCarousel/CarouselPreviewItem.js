import './CarouselPreviewItem.css';

import React from 'react';
import PropTypes from 'prop-types';

function CarouselPreviewItem (props) {
  const {
    handleClick,
    itemPreviewSize,
    previewIsClickable,
  } = props;
  return (
    <button
      className = "yanari-carousel__preview-button"
      onClick = {handleClick}
      style = {{zIndex: previewIsClickable ? 1 : -1}}
      type = "button"
    >
      <div style = {{minHeight: 1, width: itemPreviewSize}}/>
    </button>
  );
}

CarouselPreviewItem.propTypes = {
  handleClick: PropTypes.func.isRequired,
  itemPreviewSize: PropTypes.number.isRequired,
  previewIsClickable: PropTypes.bool.isRequired,
};

export default CarouselPreviewItem;
