// Variables
const popupContainer = document.querySelector('.popup-container'),
      popup = document.querySelector('.popup'),
      close = document.querySelector('.close'),
      APIurl = 'https://brandstestowy.smallhost.pl/api/random',
      productsSection = document.querySelector('#products'),
      lastElement = document.querySelector('.loader'),
      sections = document.querySelectorAll('section'),
      navSections = document.querySelectorAll('nav ul li');

let pageSize = document.querySelector('#quantity option:checked').value,
    productsArray = document.querySelectorAll('.product'),
    productsList = document.querySelector('#products-list'),
    pages = productsArray.length / pageSize;

const menu = document.querySelector('.menu'),
      nav = document.querySelector('nav'),
      menuClose = document.querySelector('.close-menu');

menu.addEventListener('click', () => {
    nav.classList.add('mobile');
})

menuClose.addEventListener('click', () => {
    nav.classList.remove('mobile');
})
close.addEventListener('click', closePopup);
popupContainer.addEventListener('click', closePopup);

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - (sectionHeight / 3))) {
            current = section.getAttribute('id');
        }
    })
    navSections.forEach( navSection => {
        navSection.classList.remove('active');
        if (navSection.classList.contains(current)) {
            navSection.classList.add('active');
        }
    })
})

// loading data if dog is visible
const loadData = document.querySelector('#dog');
const options = {
    marginRoot: '0px',
    threshold: 0.5
};
let isLoaded = false;
let pageSizeChanged = false;

const dogObserver = new IntersectionObserver(function (entries, self) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !isLoaded) {
      fetchData();
      isLoaded = true; // checking this property to ensure that the data will load only once when the dog is visible
    }
  });
}, options);

dogObserver.observe(loadData);

const endOfPageObserver = new IntersectionObserver(function (entries, self) {
    entries.forEach(entry => {
        if (entry.isIntersecting && isLoaded && !pageSizeChanged) {
            setTimeout(fetchData, 500);
        }
    })
}, options);


endOfPageObserver.observe(lastElement);

// fetching data when the page size changes
document.querySelector('#quantity').addEventListener('change', function() {
    productsList.replaceChildren();
    pageSize = document.querySelector('#quantity option:checked').value;
    productsArray = document.querySelectorAll('.product');
    pages = productsArray.length / pageSize;
    productsList = document.querySelector('#products-list');
    pageSizeChanged = true;
    fetchData();
    setTimeout(() => {
        pageSizeChanged = false;
    }, 500);
});

// Fetch data
async function fetchData() {
    const pageNumber = pages + 1;
    const endpoint = `${APIurl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    try {
        const response = await fetch(endpoint);
        if(response.ok) {
            const jsonResponse = await response.json();
            appendFetchedData(jsonResponse);
        }
    } catch (error) {
        console.log(error);
    }
    pageSize = document.querySelector('#quantity option:checked').value;
    productsArray = document.querySelectorAll('.product');
    productsList = document.querySelector('#products-list');
    pages = productsArray.length / pageSize;

    productsArray.forEach((product) => {
        product.addEventListener('click', () => {
            popupContainer.style.display = 'block';
            const ID = product.querySelector('.ID');
            const name = product.querySelector('.name');
            const value = product.querySelector('.value');
            const popupID = document.querySelector('#ID');
            const popupName = document.querySelector('#name');
            const popupValue = document.querySelector('#value');

            popupID.innerText = ID.innerText;
            popupName.innerText = name.innerText;
            popupValue.innerText = value.innerText;
        });
    })
}

// append data to the document

function appendFetchedData(jsonResponse) {
    for (let i = 0; i < pageSize; i++) {
        const divProduct = document.createElement('div');
        divProduct.classList.add('product');
        const ID = document.createElement('span');
        ID.classList.add('ID')
        const divInfo = document.createElement('div');
        divInfo.classList.add('info');
        const ul = document.createElement('ul');
        ul.classList.add('hidden');
        const liName = document.createElement('li');
        liName.classList.add('name')
        const liValue = document.createElement('li');
        liValue.classList.add('value')

        ID.textContent = `ID: ${jsonResponse.data[i].id}`;
        liName.textContent = jsonResponse.data[i].name;
        liValue.textContent = jsonResponse.data[i].value;

        divProduct.appendChild(ID);
        ul.appendChild(liName);
        ul.appendChild(liValue);
        divInfo.appendChild(ul);
        divProduct.appendChild(divInfo);

        productsList.appendChild(divProduct);
    }
}


// Close popup
function closePopup() {
    popup.classList.add('slide-up');
    setTimeout(() => {
        popupContainer.style.display = 'none';
        popup.classList.remove('slide-up');
    }, 500)
}