import './index.css';

import React, {Component, createRef} from 'react';

class MYYCarousel extends Component {
  constructor () {
    super();
    this.state = {
      index: null,
      initialPositionX: null, // pra calcular o delta (se o swipe é pra direita ou esquerda)
      itemsWidth: null, // nao consegui passar pro render pq o ref n ta pronto quando renderiza ainda
      offsetCursor: null, // distancia entre o cursor e a esquerda pra n ter o problema da borda acompanhar o cursor
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
      }
    });
  };

  handleTouchEnd = (e) => {
    if (e.changedTouches[0].clientX - this.state.initialPositionX > 0) {
      this.setState((prevState) => {
        return {index: prevState.index - 1}
      });
    } else if (e.changedTouches[0].clientX - this.state.initialPositionX < 0) {
      this.setState((prevState) => {
        return {index: prevState.index + 1}
      });
    }
    this.setState({initialPositionX: 0, positionX: 0});
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
            marginLeft: -(this.state.itemsWidth * this.state.index) + this.state.positionX,
            width: this.state.itemsWidth * children.length,
          }}
        >
          {children.map((data) => {
            return (
              <div className = "myy-carousel__item" style = {{width: this.state.itemsWidth}}>
                {data}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default MYYCarousel;
