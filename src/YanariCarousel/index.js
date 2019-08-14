import './index.css';

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import CarouselArrow from './CarouselArrow';
import CarouselDots from './CarouselDots';
import {handleScrollOrSwipe, unify} from './utils/helper';

class YanariCarousel extends Component {
  constructor (props) {
    super(props);
    this.refContainer = createRef();
    this.refItemsContainer = createRef();
    this.state = {
      animate: false, // state pra rodar a animacao
      carouselIndex: props.startIndex,
      initialPositionX: null, // pra calcular o delta (se o swipe é pra direita ou esquerda)
      isScrolling: false, // se tiver scrollando nao tem como swipar
      isSwiping: false, // se tiver swipando n tem como scrollar (so no ios)
      itemsWidth: null, // nao consegui passar pro render pq o ref n ta pronto quando renderiza ainda
      offsetCursor: null, // distancia entre o cursor e a esquerda no touch start pra n ter o problema da borda do item acompanhar o cursor
      positionX: null, // onde o cursor ta no eixo X + a distancia entre o cursor e a esquerda
      started: false, // pra não sair andando sozinho no mousemove
    };
  }

  componentDidMount () {
    const {
      arrowSize,
      hasArrows,
      itemPreviewSize,
      showPrevAndNext,
    } = this.props;
    const arrowMargins = hasArrows ? (arrowSize * 2) : 0;
    const itemPreviewMargins = showPrevAndNext ? (itemPreviewSize * 2) : null;
    this.refItemsContainer.current.addEventListener('touchstart', this.handleTouchStart);
    this.refItemsContainer.current.addEventListener('mousedown', this.handleTouchStart);
    this.refItemsContainer.current.addEventListener('touchmove', this.handleTouchMove, {passive: false});
    document.addEventListener('mousemove', this.handleTouchMove, {passive: false});
    this.refItemsContainer.current.addEventListener('touchend', this.handleTouchEnd, {passive: false});
    document.addEventListener('mouseup', this.handleTouchEnd);
    this.setState({
      itemsWidth: this.refContainer.current.getBoundingClientRect().width - (arrowMargins + itemPreviewMargins),
    });
  }

  componentWillUnmount () {
    this.refItemsContainer.current.removeEventListener('touchstart', this.handleTouchStart);
    this.refItemsContainer.current.removeEventListener('mousedown', this.handleTouchStart);
    this.refItemsContainer.current.removeEventListener('touchmove', this.handleTouchMove, {passive: false});
    document.removeEventListener('mousemove', this.handleTouchMove, {passive: false});
    this.refItemsContainer.current.removeEventListener('touchend', this.handleTouchEnd, {passive: false});
    document.removeEventListener('mouseup', this.handleTouchEnd);
  }

  setCarouselIndex = (carouselIndex) => {
    this.handleAnimationAndSetState({carouselIndex});
  };

  handleTouchStart = (e) => {
    this.setState({
      // so ta aqui pra calcular o delta
      initialPositionX: unify(e).clientX,
      // pra saber se ta scrollando ou swipando
      initialPositionY: unify(e).clientY,
      // diferença entre o ponto que o cursor esta na hora do click e a esquerda do container (levando em conta margins e paddings)
      offsetCursor: unify(e).clientX - this.refContainer.current.offsetLeft,
      started: true,
    });
  };

  handleTouchMove = (e) => {
    if (this.state.started) {
      const returnedState = handleScrollOrSwipe(e, this.state);
      this.setState(returnedState);
      if (this.state.isScrolling) return;
      else if (this.state.isSwiping) e.preventDefault();
      const {items} = this.props;
      const deltaX = unify(e).clientX - this.state.initialPositionX;
      const isNotFirstItem = this.state.carouselIndex < items.length - 1;
      const isNotLastItem = this.state.carouselIndex > 0;
      const threshold = this.state.itemsWidth / 4;
      // impedir que o usuario swipe pro lado esquerdo qd é o ultimo item e pro lado direito quando é o primeiro item
      if (!isNotFirstItem && deltaX < -threshold) {
        this.setState({
          positionX: -threshold,
        });
        return;
      }
      if (!isNotLastItem && deltaX > threshold) {
        this.setState({
          positionX: threshold,
        });
        return;
      }
      if (this.state.isSwiping) {
        this.setState((prevState) => {
          return {
            // acompanha pra onde o cursor ou dedo ta indo, tira qualquer margem ou padding que possa existir e subtrai a
            // diferença entre onde o cursor/dedo tava na hora do touchstart e a esquerda do container
            positionX: ((unify(e).clientX - this.refContainer.current.offsetLeft) - prevState.offsetCursor),
          };
        });
      }
    }
  };

  handleTouchEnd = (e) => {
    if (this.state.started) {
      this.handleAnimationAndSetState();
      const deltaX = unify(e).clientX - this.state.initialPositionX;
      const threshold = this.state.itemsWidth / 4; // movimento minimo pra ser considerado um swipe
      const isValidSwipe = Math.abs(deltaX) >= threshold; // tem que ser no minimo metade do container pra mudar de indice
      if (this.state.isSwiping) {
        if (deltaX > 0 && isValidSwipe) { // delta positivo quer dizer que foi swipado pra direita
          this.handleDecrementIndex();
        } else if (deltaX < 0 && isValidSwipe) { // delta negativo indica que foi swipado pra esquerda
          this.handleIncrementIndex();
        }
      }
      this.setState({
        initialPositionX: 0,
        isScrolling: false,
        isSwiping: false,
        positionX: 0,
        started: false,
      }); // reseta os valores
    }
  };

  handleIncrementIndex = () => {
    const {items} = this.props;
    const isNotLastItem = this.state.carouselIndex < items.length - 1;
    if (isNotLastItem) {
      this.handleAnimationAndSetState({carouselIndex: this.state.carouselIndex + 1});
    }
  };

  handleDecrementIndex = () => {
    const isNotFirstItem = this.state.carouselIndex > 0;
    if (isNotFirstItem) {
      this.handleAnimationAndSetState({carouselIndex: this.state.carouselIndex - 1});
    }
  };

  handleAnimationAndSetState = (newState) => { // adiciona o transition e depois de 275ms retira
    this.setState({
      ...newState,
      animate: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          animate: false,
        });
      }, 275);
    });
  };

  render () {
    const {
      arrowSize,
      hasArrows,
      hasDots,
      itemRenderer,
      items,
      itemPreviewSize,
      showPrevAndNext,
    } = this.props;
    const itemMargin = 8;
    const transition = -((this.state.itemsWidth + (itemMargin * 2)) * this.state.carouselIndex) + this.state.positionX;
    const itemsContainerStyle = {
      transform: 'translate3d(' + transition + 'px, 0, 0)', // o que indica a posição
      transition: this.state.animate ? 'transform 275ms ease' : null, // anima so no touch end
      width: (this.state.itemsWidth + (itemMargin * 2)) * items.length, // pra acomodar todos os itens horizontalmente um do lado do outro
    };
    const itemStyle = {
      margin: '0 ' + itemMargin + 'px',
      width: this.state.itemsWidth,
    };
    return (
      <div className = "yanari-carousel" ref = {this.refContainer}>
        <div className = "yanari-carousel__flex-container">
          {hasArrows ? (
            <CarouselArrow
              direction = "left"
              handleClick = {this.handleDecrementIndex}
              size = {arrowSize}
            />
          ) : null}
          <div className = "yanari-carousel__items-wrapper">
            {showPrevAndNext ? (
              <button
                className = "yanari-carousel__preview-button"
                onClick = {this.handleDecrementIndex}
                type = "button"
              >
                <div style = {{height: itemPreviewSize, width: itemPreviewSize}}/>
              </button>
            ) : null}
            <div className = "yanari-carousel__item-container-wrapper" style = {{width: this.state.itemsWidth}}>
              <div className = "yanari-carousel__item-container" ref = {this.refItemsContainer} style = {itemsContainerStyle}>
                {items.map((data, index) => {
                  return (
                    <div
                      className = "yanari-carousel__item"
                      key = {index}
                      style = {itemStyle}
                    >
                      {itemRenderer({data})}
                    </div>
                  );
                })}
              </div>
            </div>
            {showPrevAndNext ? (
              <button
                className = "yanari-carousel__preview-button"
                onClick = {this.handleIncrementIndex}
                type = "button"
              >
                <div style = {{height: itemPreviewSize, width: itemPreviewSize}}/>
              </button>
            ) : null}
          </div>
          {hasArrows ? (
            <CarouselArrow
              direction = "right"
              handleClick = {this.handleIncrementIndex}
              size = {arrowSize}
            />
          ) : null}
        </div>
        {hasDots ? (
          <CarouselDots
            carouselIndex = {this.state.carouselIndex}
            items = {items}
            setCarouselIndex = {this.setCarouselIndex}
          />
        ) : null}
      </div>
    );
  }
}

YanariCarousel.propTypes = {
  arrowSize: PropTypes.number,
  hasArrows: PropTypes.bool,
  hasDots: PropTypes.bool,
  itemPreviewSize: PropTypes.number,
  itemRenderer: PropTypes.func.isRequired,
  items: PropTypes.instanceOf(Object).isRequired,
  showPrevAndNext: PropTypes.bool,
  startIndex: PropTypes.number,
};

YanariCarousel.defaultProps = {
  arrowSize: 32,
  itemPreviewSize: 32,
  startIndex: 0,
  showPrevAndNext: true,
};

export default YanariCarousel;
