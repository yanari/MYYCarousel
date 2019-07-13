import './index.css';

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import Dots from './Dots';

class MYYCarousel extends Component {
  constructor (props) {
    super(props);
    this.state = {
      carouselIndex: props.startIndex,
      initialPositionX: null, // pra calcular o delta (se o swipe é pra direita ou esquerda)
      itemsWidth: null, // nao consegui passar pro render pq o ref n ta pronto quando renderiza ainda
      offsetCursor: null, // distancia entre o cursor e a esquerda pra n ter o problema da borda do item acompanhar o cursor
      positionX: null, // onde o cursor ta no eixo X
    };
    this.refContainer = createRef();
  }

  componentDidMount () {
    this.setState({itemsWidth: this.refContainer.current.getBoundingClientRect().width});
  }

  handleTouchStart = (e) => {
    this.setState({
      initialPositionX: e.touches[0].clientX,
      offsetCursor: e.touches[0].clientX - this.refContainer.current.offsetLeft,
    });
  };

  handleTouchMove = (e) => {
    e.persist();
    this.setState((prevState) => {
      return {
        positionX: e.touches[0].clientX - this.refContainer.current.offsetLeft - prevState.offsetCursor,
      };
    });
  };

  handleTouchEnd = (e) => {
    const {children} = this.props;
    const deltaX = e.changedTouches[0].clientX - this.state.initialPositionX;
    const canBeSwipedRight = this.state.carouselIndex > 0;
    const canBeSwipedLeft = this.state.carouselIndex < children.length - 1;
    if (deltaX > 0 && canBeSwipedRight) {
      this.setState((prevState) => {
        return {carouselIndex: prevState.carouselIndex - 1};
      });
    } else if (deltaX < 0 && canBeSwipedLeft) {
      this.setState((prevState) => {
        return {carouselIndex: prevState.carouselIndex + 1};
      });
    }
    this.setState({initialPositionX: 0, positionX: 0}); // reseta os valores
  };

  setCarouselIndex = (carouselIndex) => {
    this.setState({carouselIndex});
  };

  render () {
    const {children} = this.props;
    return (
      <div className = "myy-carousel" ref = {this.refContainer}>
        <div
          className = "myy-carousel__wrapper"
          onTouchStart = {this.handleTouchStart}
          onTouchMove = {this.handleTouchMove}
          onTouchEnd = {this.handleTouchEnd}
          style = {{
            marginLeft: -(this.state.itemsWidth * this.state.carouselIndex) + this.state.positionX,
            width: this.state.itemsWidth * children.length,
          }}
        >
          {children.map((data) => {
            return (
              <div
                className = "myy-carousel__item"
                key = {data.key}
                style = {{width: this.state.itemsWidth}}
              >
                {data}
              </div>
            );
          })}
        </div>
        <Dots
          carouselIndex = {this.state.carouselIndex}
          setCarouselIndex = {this.setCarouselIndex}
          items = {children}
        />
      </div>
    );
  }
}

MYYCarousel.propTypes = {
  startIndex: PropTypes.number,
};

MYYCarousel.defaultProps = {
  startIndex: 0,
};

export default MYYCarousel;
