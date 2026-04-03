import menuItem1 from '../images/Menu/Mains/1.png'
import menuItem2 from '../images/Menu/Mains/2.png'
import menuItem3 from '../images/Menu/Mains/3.png'
import menuItem4 from '../images/Menu/Mains/4.png'
import menuItem5 from '../images/Menu/Mains/5.png'
import menuItem6 from '../images/Menu/Mains/6.png'

export default function createMenuContainer() {
    // Create menu header
    const menuHeader = document.createElement('div');
    menuHeader.className = 'content-header container';
    menuHeader.innerHTML = '<h1>Our Menu</h1>';

    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container container';

    // Create options section
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'menu-container__options';
    optionsDiv.innerHTML = `
    <div class="menu-container__options--section">
        <a href="#" class="menu-container__options--main-courses">Mains</a>
        <a href="#" class="menu-container__options--appetizers">Appetizers</a>
    </div>

    <!-- Desserts and Beverages -->
    <div class="menu-container__options--section">
        <a href="#" class="menu-container__options--desserts">Desserts</a>
        <a href="#" class="menu-container__options--beverages">Beverages</a>
    </div>
`;

    // Create menu items data
    const menuItems = [
        { img: menuItem1, alt: 'Baked Sea Bass with Lemon and Herbs', name: 'Baked Sea Bass', price: '$24.99' },
        { img: menuItem2, alt: 'Calamari with Aioli ', name: 'Calamari with Aioli ', price: '$20.99' },
        { img: menuItem3, alt: 'Garlic Butter Shrimp', name: 'Garlic Butter Shrimp', price: '$22.99' },
        { img: menuItem4, alt: 'Grilled Octopus', name: 'Grilled Octopus', price: '$26.99' },
        { img: menuItem5, alt: 'Seafood Paella', name: 'Seafood Paella', price: '$28.99' },
        { img: menuItem6, alt: 'Stuffed Squid', name: 'Stuffed Squid', price: '$25.99' }
    ];

    // Create selection container and menu items
    const selectionDiv = document.createElement('div');
    selectionDiv.className = 'menu-container__selection';

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
        <img class="menu-item__image" src="${item.img}" alt="${item.alt}">
        <p class="menu-item__header">
            <span class="menu-item__name">${item.name}</span>
            <span class="menu-item__price">${item.price}</span>
        </p>
        <p class="menu-item__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis est corrupti, necessitatibus dignissimos voluptatem</p>
    `;
        selectionDiv.appendChild(menuItem);
    });

    // Assemble the structure
    menuContainer.appendChild(optionsDiv);
    menuContainer.appendChild(selectionDiv);
    // document.body.appendChild(menuHeader);
    // document.body.appendChild(menuContainer);

    return {
        menuHeader: menuHeader,
        menuContainer: menuContainer
    }
};