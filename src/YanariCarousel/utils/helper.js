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
