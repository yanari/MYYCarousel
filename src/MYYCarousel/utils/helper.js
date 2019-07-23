export const handleDisableBodyScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.webkitOverflowScrolling = 'touch'; // Previne a rolagem do body no iOS
};

export const handleEnableBodyScroll = () => {
  document.body.style.overflow = 'auto';
  document.body.style.webkitOverflowScrolling = 'auto';
};

export const handleScrollOrSwipe = (e, state) => {
  const {initialPositionX, initialPositionY} = state;
  const deltaX = e.changedTouches[0].clientX - initialPositionX;
  const deltaY = e.changedTouches[0].clientY - initialPositionY;
  if (!state.isSwiping) {
    if (Math.abs(deltaY) > 10) {
      return {
        isScrolling: true,
        isSwiping: false,
      };
    }
  }
  if (Math.abs(deltaX) > 10) {
    return {
      isSwiping: true,
      isScrolling: false,
    };
  }
};
