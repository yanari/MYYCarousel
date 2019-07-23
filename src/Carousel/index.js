import './index.css';

import React, {Component} from 'react';

class Carousel extends Component {
  constructor () {
    super();
    this.refContainer = React.createRef();
    this.state = {
      isSwiping: false,
      isScrolling: false,
      itemsWidth: null,
      startX: null,
      startY: null,
      currentX: null,
      currentY: null,
    };
  }

  componentDidMount () {
    this.setState({
      itemsWidth: this.refContainer.current.getBoundingClientRect().width,
    });
  }

  handleTouchStart = (e) => {
    this.setState({
      startX: e.touches ? e.touches[0].pageX : e.clientX,
      startY: e.touches ? e.touches[0].pageY : e.clientY,
      currentX: e.touches ? e.touches[0].pageX : e.clientX,
      currentY: e.touches ? e.touches[0].pageY : e.clientY,
    });
  };

  handleTouchMove = (e) => {
    let swipeLength = Math.round(
      Math.sqrt(Math.pow(e.touches[0].pageX - this.state.startX, 2))
    );
    let verticalSwipeLength = Math.round(
      Math.sqrt(Math.pow(e.touches[0].pageY - this.state.startY, 2))
    );
    console.log(swipeLength);

    if (verticalSwipeLength > 10 && swipeLength < 10) {
      this.setState({
        isScrolling: true,
        isSwiping: false,
      });
    }

    if (swipeLength > 10 && verticalSwipeLength < 10) {
      this.setState({
        isScrolling: false,
        isSwiping: true,
      });
      e.preventDefault();
    }

    if (this.state.isSwiping) {
      this.setState({
        currentX: e.touches ? e.touches[0].pageX : e.clientX,
        currentY: e.touches ? e.touches[0].pageY : e.clientY,
      });
    }
  };

  handleDisableBodyScroll = () => {
    const preventDefault = (e) => {
      e = e || window.event;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    };
    window.ontouchmove = preventDefault;
  };

  render () {
    const {itemRenderer, items} = this.props;
    const trackStyle = {
      transform: `translate3d(${this.state.currentX}px, 0, 0)`,
      width: this.state.itemsWidth * items.length,
    };
    return (
      <div className = "carousel-container" ref = {this.refContainer}>
        <div className = "carousel-slider">
          <div
            className = "carousel-list"
            onTouchEnd = {this.handleTouchEnd}
            onTouchMove = {this.handleTouchMove}
            onTouchStart = {this.handleTouchStart}
            role = "presentation"
          >
            <div className = "carousel-track" style = {trackStyle}>
              {items.map((data) => {
                return (
                  <div className = "carousel-item" style = {{width: this.state.itemsWidth}}>
                    {itemRenderer({data})}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Carousel;
