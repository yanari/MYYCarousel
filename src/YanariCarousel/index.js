import './index.css';

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import CarouselArrow from './CarouselArrow';
import CarouselDots from './CarouselDots';
import CarouselPreviewItem from './CarouselPreviewItem';
import {
  addEventListeners,
  getDeltaX,
  getStyles,
  getThreshold,
  handleScrollOrSwipe,
  isNotFirstItem,
  isNotLastItem,
  removeEventListeners,
  unify,
} from './helper';

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
    const {arrows, itemPreviewSize} = this.props;
    const arrowMargins = arrows ? (arrows.left.size + arrows.left.margin + arrows.right.size + arrows.right.margin) : 0;
    const itemPreviewMargins = itemPreviewSize ? (itemPreviewSize.left + itemPreviewSize.right) : null;
    this.setState({
      itemsWidth: this.refContainer.current.getBoundingClientRect().width - (arrowMargins + itemPreviewMargins),
    });
    addEventListeners(this.handleSwipeStart, this.handleSwipeMove, this.handleSwipeEnd, this.refItemsContainer);
  }

  componentWillUnmount () {
    removeEventListeners(this.handleSwipeStart, this.handleSwipeMove, this.handleSwipeEnd, this.refItemsContainer);
  }

  setCarouselIndex = (carouselIndex) => {
    this.handleAnimationAndSetState({carouselIndex});
  };

  handleSwipeStart = (e) => {
    // e.preventDefault ? e.preventDefault() : e.returnValue = false; // pra nao rolar o drag and drop de links dentro do carousel
    this.setState({
      // so ta aqui pra calcular o delta
      initialPositionX: unify(e).clientX,
      // pra saber se ta scrollando ou swipando
      initialPositionY: unify(e).clientY,
      // diferença entre o ponto que o cursor esta na hora do click e a esquerda do container (levando em conta margins e paddings)
      offsetCursor: unify(e).clientX - this.refContainer.current.offsetLeft,
      // nos eventos do mouse precisa ter começado o swipe pro mousemove não ficar doido
      started: true,
    });
  };

  handleSwipeMove = (e) => {
    /*
      se quisermos desabilitar o click de links dentro do carousel precisariamos desabilitar todos os links com o getElementByTagName,
      e habilitar novamente no touchEnd, mas por ora decidimos não implementar
    */
    if (this.state.started) {
      const returnedState = handleScrollOrSwipe(e, this.state);
      this.setState(returnedState);
      if (this.state.isScrolling) return;
      else if (this.state.isSwiping && e.cancelable) e.preventDefault();
      // https://github.com/kenwheeler/slick/issues/1800
      const deltaX = getDeltaX(e, this.state);
      const threshold = getThreshold(this.state);
      if (!isNotLastItem(this.state, this.props) && deltaX < -threshold) {
        this.setState({
          positionX: -threshold,
        });
        return;
      }
      if (!isNotFirstItem(this.state) && deltaX > threshold) {
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

  handleSwipeEnd = (e) => {
    if (this.state.started) {
      this.handleAnimationAndSetState();
      const deltaX = getDeltaX(e, this.state);
      const threshold = getThreshold(this.state);
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
      });
    }
  };

  handleIncrementIndex = () => {
    if (isNotLastItem(this.state, this.props)) {
      this.handleAnimationAndSetState({carouselIndex: this.state.carouselIndex + 1});
    }
  };

  handleDecrementIndex = () => {
    if (isNotFirstItem(this.state)) {
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
      arrows,
      hasDots,
      itemRenderer,
      items,
      itemPreviewSize,
      previewIsClickable,
    } = this.props;
    const [itemStyle, itemsContainerStyle] = getStyles(this.state, this.props);
    return (
      <div className = "yanari-carousel" ref = {this.refContainer}>
        <div className = "yanari-carousel__flex-container">
          {arrows && arrows.left ? (
            <CarouselArrow
              arrow = {arrows.left}
              direction = "left"
              handleClick = {this.handleDecrementIndex}
              isInactive = {!isNotFirstItem(this.state)}
            />
          ) : null}
          <div className = "yanari-carousel__items-wrapper">
            {itemPreviewSize && itemPreviewSize.left ? (
              <CarouselPreviewItem
                handleClick = {this.handleDecrementIndex}
                itemPreviewSize = {itemPreviewSize.left}
                previewIsClickable = {previewIsClickable}
              />
            ) : null}
            <div className = "yanari-carousel__item-container-wrapper" style = {{width: this.state.itemsWidth}}>
              <div className = "yanari-carousel__item-container" ref = {this.refItemsContainer} style = {itemsContainerStyle}>
                {items.map((data) => {
                  return (
                    <div
                      className = "yanari-carousel__item"
                      key = {data.key}
                      style = {itemStyle}
                    >
                      {itemRenderer({data})}
                    </div>
                  );
                })}
              </div>
            </div>
            {itemPreviewSize && itemPreviewSize.right ? (
              <CarouselPreviewItem
                handleClick = {this.handleIncrementIndex}
                itemPreviewSize = {itemPreviewSize.right}
                previewIsClickable = {previewIsClickable}
              />
            ) : null}
          </div>
          {arrows && arrows.right ? (
            <CarouselArrow
              arrow = {arrows.right}
              direction = "right"
              handleClick = {this.handleIncrementIndex}
              isInactive = {!isNotLastItem(this.state, this.props)}
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
  arrows: PropTypes.instanceOf(Object),
  hasDots: PropTypes.bool,
  itemMargin: PropTypes.number,
  itemRenderer: PropTypes.func.isRequired,
  items: PropTypes.instanceOf(Object).isRequired,
  itemPreviewSize: PropTypes.instanceOf(Object),
  previewIsClickable: PropTypes.bool,
  startIndex: PropTypes.number,
};

YanariCarousel.defaultProps = {
  hasDots: false,
  itemMargin: 8,
  previewIsClickable: false,
  startIndex: 0,
};

export default YanariCarousel;
