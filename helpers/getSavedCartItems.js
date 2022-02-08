const getSavedCartItems = () => {
  // seu código aqui
  const getItem = localStorage.getItem('cartItems');
  return getItem;
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
