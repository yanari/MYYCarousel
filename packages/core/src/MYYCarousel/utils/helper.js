export const handleScrollOrSwipe = (e, state) => {
  const {initialPositionX, initialPositionY} = state;
  const deltaX = e.changedTouches[0].clientX - initialPositionX;
  const deltaY = e.changedTouches[0].clientY - initialPositionY;
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
