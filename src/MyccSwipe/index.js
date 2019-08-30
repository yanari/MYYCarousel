import './index.css';

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import MyccSwipeArrow from './MyccSwipeArrow';
import MyccSwipeDots from './MyccSwipeDots';
import MyccSwipePreviewItem from './MyccSwipePreviewItem';
import {
  addEventListeners,
  getBehaviorStyles,
  getDeltaX,
  getThreshold,
  handleScrollOrSwipe,
  isNotFirstItem,
  isNotLastItem,
  normalizeChangedTouches,
  removeEventListeners,
} from './helper';

class MyccSwipe extends Component {
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
    const {arrowConfig, itemPreviewConfig} = this.props;
    const arrowSizes = arrowConfig
      ? (arrowConfig.left.width + arrowConfig.left.margin + arrowConfig.right.width + arrowConfig.right.margin)
      : 0;
    const itemPreviewSizes = itemPreviewConfig ? (itemPreviewConfig.widthLeft + itemPreviewConfig.widthRight) : null;
    this.setState({
      itemsWidth: this.refContainer.current.getBoundingClientRect().width - (arrowSizes + itemPreviewSizes),
    });
    addEventListeners(this.handleSwipeStart, this.handleSwipeMove, this.handleSwipeEnd, this.refItemsContainer);
  }

  componentWillUnmount () {
    removeEventListeners(this.handleSwipeStart, this.handleSwipeMove, this.handleSwipeEnd, this.refItemsContainer);
  }

  setCarouselIndex = (carouselIndex) => {
    this.handleAnimation({carouselIndex});
  };

  handleSwipeStart = (e) => {
    // e.preventDefault ? e.preventDefault() : e.returnValue = false; // pra nao rolar o drag and drop de links dentro do carousel MAS impede o usuario de scrollar no mobile
    this.setState({
      // so ta aqui pra calcular o delta
      initialPositionX: normalizeChangedTouches(e).clientX,
      // pra saber se ta scrollando ou swipando
      initialPositionY: normalizeChangedTouches(e).clientY,
      // diferença entre o ponto que o cursor esta na hora do click e a esquerda do container (levando em conta margins e paddings)
      offsetCursor: normalizeChangedTouches(e).clientX - this.refContainer.current.offsetLeft,
      // nos eventos do mouse precisa ter começado o swipe pro mousemove não ficar doido
      started: true,
    });
  };

  handleSwipeMove = (e) => {
    // se quisermos desabilitar o click de links dentro do carousel precisariamos desabilitar todos os links com o getElementByTagName,
    // e habilitar novamente no touchEnd, mas por ora decidimos não implementar
    if (this.state.started) {
      const returnedState = handleScrollOrSwipe(e, this.state);
      this.setState(returnedState);
      if (this.state.isScrolling) return;
      else if (this.state.isSwiping && e.cancelable) e.preventDefault();
      // motivo do e.cancelable: https://github.com/kenwheeler/slick/issues/1800
      const deltaX = getDeltaX(e, this.state);
      const threshold = getThreshold(this.state);
      // limita o swipe caso seja primeiro ou ultimo item
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
      // responsavel pelo movimento
      if (this.state.isSwiping) {
        this.setState((prevState) => {
          return {
            // acompanha pra onde o cursor ou dedo ta indo, tira qualquer margem ou padding que possa existir (state.offsetCursor)
            // e subtrai a diferença entre onde o cursor/dedo tava na hora do touchstart e a esquerda do container (offsetLeft)
            positionX: ((normalizeChangedTouches(e).clientX - this.refContainer.current.offsetLeft) - prevState.offsetCursor),
          };
        });
      }
    }
  };

  handleSwipeEnd = (e) => {
    if (this.state.started) {
      this.handleAnimation();
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
      this.handleAnimation({carouselIndex: this.state.carouselIndex + 1});
    }
  };

  handleDecrementIndex = () => {
    if (isNotFirstItem(this.state)) {
      this.handleAnimation({carouselIndex: this.state.carouselIndex - 1});
    }
  };

  handleAnimation = (newState) => {
    // adiciona o animate pro state e o render fica de olho nesse state pra adicionar ou remover o transform 275ms ease
    // obrigada carousel do mercado livre
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
      arrowConfig,
      hasDots,
      itemRenderer,
      items,
      itemPreviewConfig,
    } = this.props;
    const [itemStyle, itemsContainerStyle] = getBehaviorStyles(this.state, this.props);
    return (
      <div className = "mycc-swipe" ref = {this.refContainer}>
        <div className = "mycc-swipe__flex-container">
          {arrowConfig && arrowConfig.left ? (
            <MyccSwipeArrow
              arrow = {arrowConfig.left}
              direction = "left"
              handleClick = {this.handleDecrementIndex}
              isInactive = {!isNotFirstItem(this.state)}
            />
          ) : null}
          <div className = "mycc-swipe__items-wrapper">
            {itemPreviewConfig && itemPreviewConfig.widthLeft ? (
              <MyccSwipePreviewItem
                handleClick = {this.handleDecrementIndex}
                itemPreviewIsClickable = {itemPreviewConfig.isClickable}
                itemPreviewWidth = {itemPreviewConfig.widthLeft}
              />
            ) : null}
            <div
              className = "mycc-swipe__item-container-wrapper"
              style = {{width: this.state.itemsWidth}}
            >
              <div
                className = "mycc-swipe__item-container"
                ref = {this.refItemsContainer}
                style = {itemsContainerStyle}
              >
                {items.map((data) => {
                  return (
                    <div
                      className = "mycc-swipe__item"
                      key = {data.key}
                      style = {itemStyle}
                    >
                      {itemRenderer({data})}
                    </div>
                  );
                })}
              </div>
            </div>
            {itemPreviewConfig && itemPreviewConfig.widthRight ? (
              <MyccSwipePreviewItem
                handleClick = {this.handleIncrementIndex}
                itemPreviewIsClickable = {itemPreviewConfig.isClickable}
                itemPreviewWidth = {itemPreviewConfig.widthRight}
              />
            ) : null}
          </div>
          {arrowConfig && arrowConfig.right ? (
            <MyccSwipeArrow
              arrow = {arrowConfig.right}
              direction = "right"
              handleClick = {this.handleIncrementIndex}
              isInactive = {!isNotLastItem(this.state, this.props)}
            />
          ) : null}
        </div>
        {hasDots ? (
          <MyccSwipeDots
            carouselIndex = {this.state.carouselIndex}
            items = {items}
            setCarouselIndex = {this.setCarouselIndex}
          />
        ) : null}
      </div>
    );
  }
}

MyccSwipe.propTypes = {
  arrowConfig: PropTypes.shape({
    left: PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
      margin: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    right: PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
      margin: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
  }),
  hasDots: PropTypes.bool,
  // é usado no helper
  // eslint-disable-next-line react/no-unused-prop-types
  itemMargin: PropTypes.number,
  itemPreviewConfig: PropTypes.shape({
    isClickable: PropTypes.bool.isRequired,
    widthLeft: PropTypes.number.isRequired,
    widthRight: PropTypes.number.isRequired,
  }),
  itemRenderer: PropTypes.func.isRequired,
  items: PropTypes.instanceOf(Object).isRequired,
  startIndex: PropTypes.number,
};

MyccSwipe.defaultProps = {
  arrowConfig: null,
  hasDots: false,
  itemMargin: 8,
  itemPreviewConfig: {
    isClickable: false,
  },
  startIndex: 0,
};

export default MyccSwipe;
