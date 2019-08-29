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

export const getDeltaX = (e, state) => {
  return unify(e).clientX - state.initialPositionX;
};

export const getThreshold = (state) => { // movimento minimo pra ser considerado um swipe
  return state.itemsWidth / 4;
};

export const getTransition = (state, props) => {
  return -((state.itemsWidth + (props.itemMargin * 2)) * state.carouselIndex) + state.positionX;
};

export const addEventListeners = (handleSwipeStart, handleSwipeMove, handleSwipeEnd, refItemsContainer) => {
  refItemsContainer.current.addEventListener('touchstart', handleSwipeStart);
  refItemsContainer.current.addEventListener('mousedown', handleSwipeStart);
  refItemsContainer.current.addEventListener('touchmove', handleSwipeMove, {passive: false});
  document.addEventListener('mousemove', handleSwipeMove, {passive: false});
  // o event listener nao ta no ref pq a pessoa pode soltar ou mover o cursor do mouse fora da area do carousel
  refItemsContainer.current.addEventListener('touchend', handleSwipeEnd, {passive: false});
  refItemsContainer.current.addEventListener('mouseleave', handleSwipeEnd);
  document.addEventListener('mouseup', handleSwipeEnd);
};

export const removeEventListeners = (handleSwipeStart, handleSwipeMove, handleSwipeEnd, refItemsContainer) => {
  refItemsContainer.current.removeEventListener('touchstart', handleSwipeStart);
  refItemsContainer.current.removeEventListener('mousedown', handleSwipeStart);
  refItemsContainer.current.removeEventListener('touchmove', handleSwipeMove, {passive: false});
  document.removeEventListener('mousemove', handleSwipeMove, {passive: false});
  refItemsContainer.current.removeEventListener('touchend', handleSwipeEnd, {passive: false});
  refItemsContainer.current.removeEventListener('mouseleave', handleSwipeEnd);
  document.removeEventListener('mouseup', handleSwipeEnd);
};
