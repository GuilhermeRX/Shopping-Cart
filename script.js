const olCart = document.querySelector('.cart__items');
const total = document.querySelector('.total-price');
const inputSearch = document.querySelector('#inputSearch')
const btnSearch = document.querySelector('.icon-contain')
const sectionItems = document.querySelector('.items')
const menuPcgamer = document.querySelector('#gamer')
const menuJogos = document.querySelector('#jogos')
const menuEletro = document.querySelector('#eletro')
const menuCel = document.querySelector('#cel')
const exit = document.querySelector('.exit')

let sun = 0;

const soma = (valor) => {
  sun += valor;
  total.innerText = parseFloat(sun.toFixed(2));
  localStorage.setItem('sun', sun.toFixed(2));
};
const subtrair = (valor) => {
  sun -= valor;
  total.innerText = parseFloat(sun.toFixed(2));
  localStorage.setItem('sun', sun.toFixed(2));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  const parentItem = event.target.parentElement;
  parentItem.remove();
  const itemPrice = parentItem.children[1].innerText.split('$')[1];

  subtrair(parseFloat(itemPrice));
  saveCartItems(olCart.innerHTML); // Toda vez que eu remover um elemento ele vai atualizar meu LocalStorage.
}

const getAndRemoveStorage = () => { // Me inspirei no PR https://github.com/tryber/sd-019-a-project-shopping-cart/pull/90/commits/f0a330d13464eb63625e3aeefe966585e717de06 para Resolver este requisito.
  olCart.innerHTML = getSavedCartItems(); // atribuindo os dados do localStorage ao innerHtml da minha Ol.
  const listItems = [...olCart.childNodes]; // ChildNodes é um HTMLCollection, por isso espalhar ela em um array para poder Iterar.
  listItems.map((item) => item.addEventListener('click', cartItemClickListener)); // adicionando um evento de click em cada item.
};

function createCartItemElement({ sku, name, salePrice, image }) {
  const div = document.createElement('div')
  const tagI = document.createElement('i')
  const li = document.createElement('li');
  const img = document.createElement('img')

  li.className = 'cart__item';
  li.innerText = `${name} 
  R$${salePrice}`;

  img.className = 'cart__img';
  img.src = image
  div.className = 'cart__div'
  tagI.className = 'trash fas fa-trash-alt'
  div.appendChild(img)
  div.appendChild(li)
  div.appendChild(tagI)

  tagI.addEventListener('click', cartItemClickListener); // Toda vez que criar um cart ele vai criar um evento, para poder remover esse cart após um click
  return div;
}

async function addCartItem(id) { // Com o id eu consigo buscar o item novamente e formatar da forma que desejar.
  const cartItems = document.querySelector('.cart__items');
  const responseItem = await fetchItem(id);

  const format = (obj) => {
    const dados = {
      sku: obj.id,
      name: obj.title,
      salePrice: obj.price,
      image: obj.thumbnail,
    };

    cartItems.appendChild(createCartItemElement(dados));
  };
  format(responseItem); // Formatando o obj;
  console.log(responseItem.price);
  soma(responseItem.price);
  saveCartItems(cartItems.innerHTML); // Salvando no Local Storage.
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getItemCart = async (event) => { // Me inspirei no PR https://github.com/tryber/sd-019-a-project-shopping-cart/pull/90/commits/f0a330d13464eb63625e3aeefe966585e717de06 para Resolver este requisito.
  const btnAdd = event.target;
  const item = getSkuFromProductItem(btnAdd.parentElement); // ParentElement para recuperar o ID(sku) do PAI do meu button.
  addCartItem(item); // chamo a função retornando o id recuperado
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    e.addEventListener('click', getItemCart);
  }
  return e;
}

const loading = (status) => {
  const sectionItems = document.querySelector('.items');

  if (status === true) {
    const tagP = document.createElement('p');
    tagP.className = 'loading';
    tagP.innerText = 'carregando...';
    sectionItems.appendChild(tagP);
  } else if (status === false) {
    document.querySelector('.loading').remove();
  }
};

function createProductItemElement({ sku, name, image, price}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${price}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

const gerateProducts = async () => {
  loading(true);
  const response = await fetchProducts(inputSearch.value);
  loading(false);

  const result = response.results;
  const sectionItems = document.querySelector('.items');
  const format = (obj) => {
    const dados = {
      sku: obj.id,
      name: obj.title,
      image: obj.thumbnail,
      price: obj.price,
    };
    sectionItems.appendChild(createProductItemElement(dados));
  };
  result.map((element) => format(element));
};

const clearCart = () => {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    olCart.innerHTML = '';
    total.innerText = 0;
    saveCartItems(olCart.innerHTML);
    sun = 0;
    total.innerText = sun.toString();
    localStorage.setItem('sun', sun);
  });
};

clearCart();

const createDom = async ({ name, id }) => {
  const categoryList = document.querySelector('.category-list')
  const li = document.createElement('li')

  li.innerText = name
  li.className = 'category'
  const urlCategorieInfo = `https://api.mercadolibre.com/categories/${id}`

  const response = await fetch(urlCategorieInfo)
  const data = await response.json();

  li.addEventListener('click', async (event) => {
    const sectionItems = document.querySelector('.items');
    const urlCategorieSeach = `https://api.mercadolibre.com/sites/MLB/search?category=${id}`

    sectionItems.innerHTML = ''
    const response = await fetch(urlCategorieSeach)
    const data = await response.json();
    const result = data.results;

    const format = (obj) => {
      const dados = {
        sku: obj.id,
        name: obj.title,
        image: obj.thumbnail,
        price: obj.price
      };
      sectionItems.appendChild(createProductItemElement(dados));
    };
    result.map((element) => format(element));

  });

  categoryList.appendChild(li)
}

const listCategories = async () => {
  const urlCategories = 'https://api.mercadolibre.com/sites/MLB/categories'
  const response = await fetch(urlCategories);
  const data = await response.json();

  const categoryName = data.map((category) => createDom({ name: category.name, id: category.id }))

  return categoryName
}

const gerateProductsMenu = async (option) => {
  loading(true);
  const response = await fetchProducts(option);
  loading(false);

  const result = response.results;
  const sectionItems = document.querySelector('.items');
  const format = (obj) => {
    const dados = {
      sku: obj.id,
      name: obj.title,
      image: obj.thumbnail,
      price: obj.price
    };
    sectionItems.appendChild(createProductItemElement(dados));
  };
  result.map((element) => format(element));
};


const getMenuItems = async () => {
  menuPcgamer.addEventListener('click', async () => {
    sectionItems.innerHTML = ''
    await gerateProductsMenu('Pc gamer');
  })
  menuJogos.addEventListener('click', async () => {
    sectionItems.innerHTML = ''
    await gerateProductsMenu('Jogos');
  })

  menuEletro.addEventListener('click', async () => {
    sectionItems.innerHTML = ''
    await gerateProductsMenu('Eletrônicos');
  })

  menuCel.addEventListener('click', async () => {
    sectionItems.innerHTML = ''
    await gerateProductsMenu('Celulares');
  })
}

getMenuItems()

const pagInitial = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?category=MLB1000'
  const response = await fetch(url);
  const data = await response.json();

  const result = data.results;
  const sectionItems = document.querySelector('.items');
  const format = (obj) => {
    const dados = {
      sku: obj.id,
      name: obj.title,
      image: obj.thumbnail,
      price: obj.price
    };
    sectionItems.appendChild(createProductItemElement(dados));
  };
  result.map((element) => format(element));
}

const cart = document.querySelector('.cart')
const cartIcon = document.querySelector('.cartIcon')

  cartIcon.addEventListener('click', () => {
    if (cart.style.display !== 'flex') {
      cart.style.display = 'flex'
    } else {
      cart.style.display = 'none'
    }
    
  })


window.onload = async () => {
  getAndRemoveStorage();
  sun = parseFloat(localStorage.getItem('sun'));
  total.innerText = sun;
  //await createDom(listCategories())
  listCategories()
  await pagInitial()
  btnSearch.addEventListener('click', async (event) => {
    sectionItems.innerHTML = ''
    await gerateProducts();
  })
};