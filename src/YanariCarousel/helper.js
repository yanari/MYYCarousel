export const handleScrollOrSwipe = (e, state) => {
  const {initialPositionX, initialPositionY} = state;
  const deltaX = unify(e).clientX - initialPositionX;
  const deltaY = unify(e).clientY - initialPositionY;
  if (!state.isScrolling) {
    if (Math.abs(deltaX) > 10) {
      return {
        isSwiping: true,
        isScrolling: false,
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
};

export const unify = (e) => {
  return e.changedTouches ? e.changedTouches[0] : e;
};

export const isNotLastItem = (state, props) => {
  const {carouselIndex} = state;
  const {items} = props;
  return carouselIndex < items.length - 1;
};

export const isNotFirstItem = (state) => {
  const {carouselIndex} = state;
  return carouselIndex > 0;
};

export const getCarouselIndexOnTouchEnd = (state, props) => {
  const transition = getTransition(state, props);
  const threshold = getThreshold(state);
  const lastPossibleSwipePoint = -((state.itemsWidth + (props.itemMargin * 2)) * (props.items.length - 1) + threshold);
  if (transition > threshold) { // o swipe chegou no primeiro item
    return 0;
  } else if (transition < lastPossibleSwipePoint) { // o swipe chegou no ultimo item
    return props.items.length - 1;
  } else { // o swipe parou entre o primeiro e o ultimo item (a ser calculado)
    return Math.floor(Math.abs(transition) / state.itemsWidth);
  }
};

export const getDeltaX = (e, state) => {
  return unify(e).clientX - state.initialPositionX;
};

export const getThreshold = (state) => { // movimento minimo pra ser considerado um swipe
  return state.itemsWidth / 4;
};

export const getTransition = (state, props) => {
  return -((state.itemsWidth + (props.itemMargin * 2)) * state.carouselIndex) + state.positionX;
};

export const getPositionX = (e, state, props) => {
  // impedir que o usuario swipe pro lado esquerdo qd é o ultimo item e pro lado direito quando é o primeiro item
  const deltaX = getDeltaX(e, state);
  const threshold = getThreshold(state);
  if (!isNotLastItem(state, props) && deltaX < -threshold) {
    return -threshold
  }
  if (!isNotFirstItem(state) && deltaX > threshold) {
    return threshold;
  }
  return null;
};

export const addEventListeners = (handleSwipeStart, handleSwipeMove, handleSwipeEnd, refItemsContainer) => {
  refItemsContainer.current.addEventListener('touchstart', handleSwipeStart);
  refItemsContainer.current.addEventListener('mousedown', handleSwipeStart);
  refItemsContainer.current.addEventListener('touchmove', handleSwipeMove, {passive: false});
  document.addEventListener('mousemove', handleSwipeMove, {passive: false});
  // o event listener nao ta no ref pq a pessoa pode soltar ou mover o cursor do mouse fora da area do carousel
  refItemsContainer.current.addEventListener('touchend', handleSwipeEnd, {passive: false});
  document.addEventListener('mouseup', handleSwipeEnd);
};

export const removeEventListeners = (handleSwipeStart, handleSwipeMove, handleSwipeEnd, refItemsContainer) => {
  refItemsContainer.current.removeEventListener('touchstart', handleSwipeStart);
  refItemsContainer.current.removeEventListener('mousedown', handleSwipeStart);
  refItemsContainer.current.removeEventListener('touchmove', handleSwipeMove, {passive: false});
  document.removeEventListener('mousemove', handleSwipeMove, {passive: false});
  refItemsContainer.current.removeEventListener('touchend', handleSwipeEnd, {passive: false});
  document.removeEventListener('mouseup', handleSwipeEnd);
};
