import foodImage1 from '../images/Home/1.png'
import foodImage2 from '../images/Home/2.png'
import foodImage3 from '../images/Home/3.png'

export default function createHeroContainer() {
    const hero = document.createElement('div');
    hero.setAttribute('class', 'content__hero');

    const heroText = document.createElement('p');
    heroText.setAttribute('id', 'content__hero-text');
    heroText.innerHTML = 'WELCOME TO THE<br> RUSTIC OLIVE';
    const heroSubText = document.createElement('p');
    heroSubText.setAttribute('id', 'content__hero-subtext');
    heroSubText.textContent = 'Experience authentic Mediterranean flavors in a cozy, welcoming atmosphere';
    const heroButton = document.createElement('a');
    heroButton.setAttribute('class', 'link-btn');
    heroButton.setAttribute('id', 'hero-btn');
    heroButton.setAttribute('href', '#');
    heroButton.textContent = "Make a reservation";

    hero.append(heroText, heroSubText, heroButton);

    return {
        hero: hero,
        aboutUs: createMainContentContainer()
    };
}

function createMainContentContainer() {
    // Create the main container
    const mainContentContainer = document.createElement('div');
    mainContentContainer.className = 'home-page container';

    mainContentContainer.innerHTML = `
        <div class="food-gallery">
            <img src=${foodImage1} alt="Rice, eggs, and side items">
            <img src=${foodImage2} alt="Skewered meatballs with herbs">
            <img src=${foodImage3} alt="Noodles with eggs and meatballs">
        </div>
        <div class="home-page__text">
            <h1 id="home-page__hero-text">A genuine fine-dining<br>experience awaits</h1>
            <h2 id="home-page__hero-subtext">It's time to enjoy the finer things in life</h2>
            <hr>
            <p id="home-page__description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempor, sapien id blandit
                consectetur,
                nibh tellus commodo libero, a blandit justo tortor vitae urna. Aenean non risus ac nisi placerat
                pretium.
                Suspendisse ac pellentesque augue. Pellentesque habitant morbi tristique senectus et netus et malesuada
                fames ac turpis.
            </p>
            <a href="#" id="menu-btn" class="link-btn">Explore Menu</a>
        </div>
`;

    return mainContentContainer;
}