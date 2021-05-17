fetch('products.json').then(function (response) {
    return response.json();
}).then(function (json) {
    let product = json;
    initialize(product);
}).catch(function (err) {
    console.log('Fetch problem: ' + err.message);
});

function initialize(product) {
    let category = document.querySelector('#category');
    let searchInput = document.querySelector('#search');
    let filterBtn = document.querySelector('#filter');
    let main = document.querySelector('main');

    let lastCategory = category.value;
    let lastSearch = '';

    let categoryGroup;
    let finalGroup;

    finalGroup = product;
    updateDisplay();

    categoryGroup = [];
    finalGroup = [];

    filterBtn.onclick = selectCategory;
    function selectCategory(e) {
        e.preventDefault();

        categoryGroup = [];
        finalGroup = [];

        if (category.value === lastCategory && searchInput.value.trim() === lastSearch) {
            return;
        }
        else {
            lastCategory = category.value;
            lastSearch = searchInput.value.trim();

            if (category.value === 'All') {
                categoryGroup = product;
                selectProducts();
            }
            else {
                let lowerCaseType = category.value.toLowerCase();
                for (let i = 0; i < product.length; i++) {
                    if (product[i].type === lowerCaseType) {
                        categoryGroup.push(product[i]);
                    }
                }
                selectProducts();
            }
        }
    }
    function selectProducts() {
        if (searchInput.value.trim() === '') {
            finalGroup = categoryGroup;
            updateDisplay();
        }
        else {
            let lowerCaseSearchTerm = searchInput.value.trim().toLowerCase();
            for (let i = 0; i < categoryGroup.length; i++) {
                if (categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
                    finalGroup.push(categoryGroup[i])
                }
            }
            updateDisplay();
        }
    }
    function updateDisplay() {
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }

        if (finalGroup.length === 0) {
            const noItemPara = document.createElement('para');
            noItemPara.textContent = 'No results to display!';
            main.appendChild(noItemPara);
        }
        else {
            for (let i = 0; i < finalGroup.length; i++) {
                fetchBlob(finalGroup[i]);
            }
        }
    }
    function fetchBlob(product) {
        let url = 'images/' + product.image;
        fetch(url).then(function (response) {
            return response.blob();
        }).then(function (blob) {
            let objectURL = URL.createObjectURL(blob);
            showProduct(objectURL, product);
        });
    }
    function showProduct(objectURL, product) {
        let itemContainer = document.createElement('div');
        let labelContainer = document.createElement('div');
        let categoryLogo = document.createElement('img');
        let heading3 = document.createElement('h3');
        let itemImage = document.createElement('img');
        let itemPrice = document.createElement('span');

        itemContainer.setAttribute('id', 'item');
        labelContainer.setAttribute('class', 'label');
        if (product.type === 'vegetables') {
            categoryLogo.src = 'icons/vegetable.png';
        } else if (product.type === 'meat') {
            categoryLogo.src = 'icons/meat.png';
        } else if (product.type === 'soup') {
            categoryLogo.src = 'icons/soup.png';
        }
        heading3.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());
        itemPrice.textContent = '$' + product.price.toFixed(2);

        itemImage.src = objectURL;
        itemImage.alt = product.name;

        labelContainer.appendChild(categoryLogo);
        labelContainer.appendChild(heading3);
        itemContainer.appendChild(labelContainer);
        itemContainer.appendChild(itemImage);
        itemContainer.appendChild(itemPrice);
        main.appendChild(itemContainer);
    }
}




