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
      offsetCursor: null, // distancia entre o cursor e a esquerda no touch start pra n ter o problema da borda do item acompanhar o cursor
      positionX: null, // onde o cursor ta no eixo X + a a distancia entre o cursor e a esquerda
    };
    this.refContainer = createRef();
  }

  componentDidMount () {
    this.setState({
      itemsWidth: this.refContainer.current.getBoundingClientRect().width,
    });
  }

  setCarouselIndex = (carouselIndex) => {
    this.setState({carouselIndex});
  };

  handleTouchStart = (e) => {
    this.setState({
      // so ta aqui pra calcular o delta
      initialPositionX: e.touches[0].clientX,
      // diferença entre o ponto que o cursor esta na hora do click e a esquerda do container (levando em conta margins e paddings)
      offsetCursor: e.touches[0].clientX - this.refContainer.current.offsetLeft,
    });
  };

  handleTouchMove = (e) => {
    const {items} = this.props;
    const deltaX = e.changedTouches[0].clientX - this.state.initialPositionX;
    const canBeSwipedLeft = this.state.carouselIndex < items.length - 1; // náo é o primeiro item
    const canBeSwipedRight = this.state.carouselIndex > 0; // nao é o ultimo item
    const threshold = this.state.itemsWidth / 2;
    // impedir que o usuario swipe pro lado esquerdo qd é o ultimo item e pro lado direito quando é o primeiro item
    if (!canBeSwipedLeft && deltaX < -threshold) {
      console.log(deltaX);
      this.setState({positionX: -threshold});
      return;
    }
    if (!canBeSwipedRight && deltaX > threshold) {
      this.setState({positionX: threshold});
      return;
    }
    e.persist();
    this.setState((prevState) => {
      return {
        // acompanha pra onde o cursor ou dedo ta indo, tira qualquer margem ou padding que possa existir e subtrai a
        // diferença entre onde o cursor/dedo tava na hora do touchstart e a esquerda do container
        positionX: ((e.touches[0].clientX - this.refContainer.current.offsetLeft) - prevState.offsetCursor),
      };
    });
  };

  handleTouchEnd = (e) => {
    const {items} = this.props;
    const deltaX = e.changedTouches[0].clientX - this.state.initialPositionX;
    const threshold = this.state.itemsWidth / 2; // tem que ser no minimo metade do container pra mudar de indice
    const isValidSwipe = Math.abs(deltaX) >= threshold;
    const canBeSwipedRight = this.state.carouselIndex > 0; // nao é o ultimo item
    const canBeSwipedLeft = this.state.carouselIndex < items.length - 1; // náo é o primeiro item
    if (deltaX > 0 && canBeSwipedRight && isValidSwipe) { // delta positivo quer dizer que foi swipado pra direita
      this.setState((prevState) => {
        return {
          carouselIndex: prevState.carouselIndex - 1,
        };
      });
    } else if (deltaX < 0 && canBeSwipedLeft && isValidSwipe) { // delta negativo indica que foi swipado pra esquerda
      this.setState((prevState) => {
        return {
          carouselIndex: prevState.carouselIndex + 1,
        };
      });
    }
    this.setState({
      initialPositionX: 0,
      positionX: 0,
    }); // reseta os valores
  };

  render () {
    const {itemRenderer, items} = this.props;
    const wrapperStyle = {
      marginLeft: (-(this.state.itemsWidth * this.state.carouselIndex) + this.state.positionX), // o que indica a posição
      width: this.state.itemsWidth * items.length, // pra acomodar todos os itens horizontalmente um do lado do outro
    };
    return (
      <div className = "myy-carousel" ref = {this.refContainer}>
        <div
          className = "myy-carousel__wrapper"
          onTouchEnd = {this.handleTouchEnd}
          onTouchMove = {this.handleTouchMove}
          onTouchStart = {this.handleTouchStart}
          style = {wrapperStyle}
        >
          {items.map((data) => {
            return (
              <div
                className = "myy-carousel__item"
                key = {data.key}
                style = {{width: this.state.itemsWidth}}
              >
                {itemRenderer({data})}
              </div>
            );
          })}
        </div>
        <Dots
          carouselIndex = {this.state.carouselIndex}
          items = {items}
          setCarouselIndex = {this.setCarouselIndex}
        />
      </div>
    );
  }
}

MYYCarousel.propTypes = {
  itemRenderer: PropTypes.func.isRequired,
  items: PropTypes.node.isRequired,
  startIndex: PropTypes.number,
};

MYYCarousel.defaultProps = {
  startIndex: 0,
};

export default MYYCarousel;
