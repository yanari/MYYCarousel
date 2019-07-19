import './index.css';

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import CarouselArrow from './CarouselArrow';
import CarouselDots from './CarouselDots';

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
    const deltaX = e.changedTouches[0].clientX - this.state.initialPositionX;
    const threshold = this.state.itemsWidth / 2; // movimento minimo pra ser considerado um swipe
    const isValidSwipe = Math.abs(deltaX) >= threshold; // tem que ser no minimo metade do container pra mudar de indice
    if (deltaX > 0 && isValidSwipe) { // delta positivo quer dizer que foi swipado pra direita
      this.handleDecrementIndex();
    } else if (deltaX < 0 && isValidSwipe) { // delta negativo indica que foi swipado pra esquerda
      this.handleIncrementIndex();
    }
    this.setState({
      initialPositionX: 0,
      positionX: 0,
    }); // reseta os valores
  };

  handleIncrementIndex = () => {
    const {items} = this.props;
    const isNotLastItem = this.state.carouselIndex < items.length - 1;
    if (isNotLastItem) {
      this.setState((prevState) => {
        return {
          carouselIndex: prevState.carouselIndex + 1,
        };
      });
    }
  };

  handleDecrementIndex = () => {
    const isNotFirstItem = this.state.carouselIndex > 0;
    if (isNotFirstItem) {
      this.setState((prevState) => {
        return {
          carouselIndex: prevState.carouselIndex - 1,
        };
      });
    }
  };

  render () {
    const {itemRenderer, items} = this.props;
    const wrapperStyle = {
      marginLeft: (-(this.state.itemsWidth * this.state.carouselIndex) + this.state.positionX), // o que indica a posição
      width: this.state.itemsWidth * items.length, // pra acomodar todos os itens horizontalmente um do lado do outro
    };
    return (
      <div className = "myy-carousel" ref = {this.refContainer}>
        <CarouselArrow direction = "left" handleClick = {this.handleDecrementIndex}/>
        <CarouselArrow direction = "right" handleClick = {this.handleIncrementIndex}/>
        <div
          className = "myy-carousel__items-container"
          onTouchEnd = {this.handleTouchEnd}
          onTouchMove = {this.handleTouchMove}
          onTouchStart = {this.handleTouchStart}
          style = {wrapperStyle}
        >
          {items.map((data, index) => {
            return (
              <div
                className = "myy-carousel__item"
                key = {index}
                style = {{width: this.state.itemsWidth}}
              >
                {itemRenderer({data})}
              </div>
            );
          })}
        </div>
        <CarouselDots
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
  items: PropTypes.instanceOf(Object).isRequired,
  startIndex: PropTypes.number,
};

MYYCarousel.defaultProps = {
  startIndex: 0,
};

export default MYYCarousel;
