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
