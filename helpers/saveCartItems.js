const saveCartItems = (cart) => {
  // seu código aqui
  localStorage.setItem('cartItems', cart);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
