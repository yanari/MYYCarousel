// Pra saber se esta scrollando ou swipando
// No mobile, é necessário saber se a intenção é scrollar pra bloquear o swipeamento e vice-versa
export const handleScrollOrSwipe = (e, state) => {
  const {initialPositionX, initialPositionY} = state;
  const deltaX = normalizeChangedTouches(e).clientX - initialPositionX;
  const deltaY = normalizeChangedTouches(e).clientY - initialPositionY;
  if (!state.isScrolling) {
    if (Math.abs(deltaX) > 10) {
      return {
        isScrolling: false,
        isSwiping: true,
      };
    }
  }
  if (!state.isSwiping) {
    if (Math.abs(deltaY) > 10) {
      return {
        isScrolling: true,
        isSwiping: false,
      };
    }
  }
  return null;
};

// click e touch são acessados de forma diferente
export const normalizeChangedTouches = (e) => {
  return e.changedTouches ? e.changedTouches[0] : e;
};

// é necessário alguns tratamentos quando é o ultimo e primeiro item
export const isNotLastItem = (state, props) => {
  const {carouselIndex} = state;
  const {items} = props;
  return carouselIndex < items.length - 1;
};

// é necessário alguns tratamentos quando é o ultimo e primeiro item
export const isNotFirstItem = (state) => {
  const {carouselIndex} = state;
  return carouselIndex > 0;
};

// diferença entre o ponto onde swipe começou e até o fim
export const getDeltaX = (e, state) => {
  return normalizeChangedTouches(e).clientX - state.initialPositionX;
};

// pega os styles inline do container de itens e dos itens separados
export const getBehaviorStyles = (state, props) => {
  const transition = -((state.itemsWidth + (props.itemMargin * 2)) * state.carouselIndex) + state.positionX;
  const itemsContainerStyle = {
    transform: 'translate3d(' + transition + 'px, 0, 0)', // o que indica a posição
    transition: state.animate ? 'transform 275ms ease' : null, // anima so no touch end
    width: (state.itemsWidth + (props.itemMargin * 2)) * props.items.length, // pra acomodar todos os itens horizontalmente um do lado do outro
  };
  const itemStyle = {
    margin: '0 ' + props.itemMargin + 'px',
    width: state.itemsWidth,
  };
  return [itemStyle, itemsContainerStyle];
};

// movimento minimo pra ser considerado um swipe
export const getThreshold = (state) => {
  return state.itemsWidth / 4;
};

export const addEventListeners = (handleSwipeStart, handleSwipeMove, handleSwipeEnd, refItemsContainer) => {
  const refItemsContainerDom = refItemsContainer.current;
  refItemsContainerDom.addEventListener('touchstart', handleSwipeStart);
  refItemsContainerDom.addEventListener('mousedown', handleSwipeStart);
  refItemsContainerDom.addEventListener('touchmove', handleSwipeMove, {passive: false});
  document.addEventListener('mousemove', handleSwipeMove, {passive: false});
  // o event listener nao ta no ref pq a pessoa pode soltar ou mover o cursor do mouse fora da area do carousel
  refItemsContainerDom.addEventListener('touchend', handleSwipeEnd, {passive: false});
  refItemsContainerDom.addEventListener('mouseleave', handleSwipeEnd);
  document.addEventListener('mouseup', handleSwipeEnd);
};

export const removeEventListeners = (handleSwipeStart, handleSwipeMove, handleSwipeEnd, refItemsContainer) => {
  const refItemsContainerDom = refItemsContainer.current;
  refItemsContainerDom.removeEventListener('touchstart', handleSwipeStart);
  refItemsContainerDom.removeEventListener('mousedown', handleSwipeStart);
  refItemsContainerDom.removeEventListener('touchmove', handleSwipeMove, {passive: false});
  document.removeEventListener('mousemove', handleSwipeMove, {passive: false});
  refItemsContainerDom.removeEventListener('touchend', handleSwipeEnd, {passive: false});
  refItemsContainerDom.removeEventListener('mouseleave', handleSwipeEnd);
  document.removeEventListener('mouseup', handleSwipeEnd);
};
