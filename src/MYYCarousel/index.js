import './index.css';

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import CarouselArrow from './CarouselArrow';
import CarouselDots from './CarouselDots';

class MYYCarousel extends Component {
  constructor (props) {
    super(props);
    this.refContainer = createRef();
    this.state = {
      animate: false, // state pra rodar a animacao
      carouselIndex: props.startIndex,
      initialPositionX: null, // pra calcular o delta (se o swipe é pra direita ou esquerda)
      isScrolling: false,
      isSwiping: true,
      itemsWidth: null, // nao consegui passar pro render pq o ref n ta pronto quando renderiza ainda
      offsetCursor: null, // distancia entre o cursor e a esquerda no touch start pra n ter o problema da borda do item acompanhar o cursor
      positionX: null, // onde o cursor ta no eixo X + a a distancia entre o cursor e a esquerda
    };
  }

  componentDidMount () {
    this.setState({
      itemsWidth: this.refContainer.current.getBoundingClientRect().width - 64, // tamanho das duas setas
    });
  }

  setCarouselIndex = (carouselIndex) => {
    this.setState({
      animate: true,
      carouselIndex,
    }, () => {
      setTimeout(() => {
        this.setState({
          animate: false,
        });
      }, 275);
    });
  };

  handleTouchStart = (e) => {
    this.setState({
      // so ta aqui pra calcular o delta
      initialPositionX: e.touches[0].clientX,
      // pra saber se ta scrollando ou swipando
      initialPositionY: e.touches[0].clientY,
      // diferença entre o ponto que o cursor esta na hora do click e a esquerda do container (levando em conta margins e paddings)
      offsetCursor: e.touches[0].clientX - this.refContainer.current.offsetLeft,
    });
  };

  handleTouchMove = (e) => {
    if (this.state.isScrolling) return;
    const {items} = this.props;
    const deltaX = e.changedTouches[0].clientX - this.state.initialPositionX;
    const deltaY = e.changedTouches[0].clientY - this.state.initialPositionY;
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
    console.log(deltaX);
    if (Math.abs(deltaY) > 10) {
      this.setState({
        isScrolling: true,
        isSwiping: false,
      });
      return;
    }
    if (Math.abs(deltaX) > 10) {
      this.setState({
        isSwiping: true,
        isScrolling: false,
      });
    }
    if (this.state.isSwiping) {
      e.persist();
      this.setState((prevState) => {
        return {
          // acompanha pra onde o cursor ou dedo ta indo, tira qualquer margem ou padding que possa existir e subtrai a
          // diferença entre onde o cursor/dedo tava na hora do touchstart e a esquerda do container
          positionX: ((e.touches[0].clientX - this.refContainer.current.offsetLeft) - prevState.offsetCursor),
        };
      });
    }
  };

  handleTouchEnd = (e) => {
    this.setState({
      animate: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          animate: false,
        });
      }, 275);
    });
    const deltaX = e.changedTouches[0].clientX - this.state.initialPositionX;
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
      positionX: 0,
      isScrolling: false,
      isSwiping: false,
    }); // reseta os valores
  };

  handleIncrementIndex = () => {
    const {items} = this.props;
    const isNotLastItem = this.state.carouselIndex < items.length - 1;
    if (isNotLastItem) {
      this.setState((prevState) => {
        return {
          carouselIndex: prevState.carouselIndex + 1,
          animate: true,
        };
      }, () => {
        setTimeout(() => {
          this.setState({
            animate: false,
          });
        }, 275);
      });
    }
  };

  handleDecrementIndex = () => {
    const isNotFirstItem = this.state.carouselIndex > 0;
    if (isNotFirstItem) {
      this.setState((prevState) => {
        return {
          carouselIndex: prevState.carouselIndex - 1,
          animate: true,
        };
      }, () => {
        setTimeout(() => {
          this.setState({
            animate: false,
          });
        }, 275);
      });
    }
  };

  handleDisableBodyScroll = () => {
    const preventDefault = e => {
      e = e || window.event;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    };
    window.ontouchmove = preventDefault;
  };

  handleEnableBodyScroll = () => {
    window.ontouchmove = null;
  };

  render () {
    const {itemRenderer, items} = this.props;
    const transition = (-(this.state.itemsWidth * this.state.carouselIndex) + this.state.positionX);
    const wrapperStyle = {
      transform: `translate3d(${transition}px, 0, 0)`, // o que indica a posição
      transition: this.state.animate ? 'transform 275ms ease' : null, // anima so no touch end
      width: this.state.itemsWidth * items.length, // pra acomodar todos os itens horizontalmente um do lado do outro
    };
    return (
      <div className = "myy-carousel" ref = {this.refContainer}>
        <div className = "myy-carousel__flex-container">
          <CarouselArrow direction = "left" handleClick = {this.handleDecrementIndex}/>
          <div className = "myy-carousel__items-container-wrapper" style = {{width: this.state.itemsWidth}}>
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
          </div>
          <CarouselArrow direction = "right" handleClick = {this.handleIncrementIndex}/>
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
