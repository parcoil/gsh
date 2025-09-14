export const getUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};
