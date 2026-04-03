import contactOutsideImage from '../images/Contact/outside.png';
import contactInsideImage from '../images/Contact/inside.png';

// JavaScript to dynamically create and append the contact section to the body
export default function createMenuContainer() {
    // Create content-header
    const contentHeader = document.createElement('div');
    contentHeader.className = 'content-header container';
    contentHeader.innerHTML = '<h1>Connect with us</h1>';

    // Create main contact container
    const contactContainer = document.createElement('div');
    contactContainer.className = 'contact container';

    // Create reservations section
    const reservationsDiv = document.createElement('div');
    reservationsDiv.className = 'contact__reservations';
    reservationsDiv.innerHTML = `
        <p class="contact__header">Reservations & Inquiries</p>
        <form action="#" method="post">
            <input type="text" id="name" name="name" placeholder="Name" required>
            <input type="email" id="email" name="email" placeholder="Email" required>
            <div id="contact__datetime">
                <input type="date" id="date" name="date" placeholder="Date" required>
                <input type="time" id="time" name="time" placeholder="Time" required>
            </div>
            <textarea id="message" name="message" placeholder="Message" rows="4" cols="50"></textarea>
            <button type="submit">Send Message</button>
        </form>
    `;

    // Create connect section
    const connectDiv = document.createElement('div');
    connectDiv.className = 'contact__connect';
    connectDiv.innerHTML = `
        <p class="contact__header">Visit Us</p>
        <img class="contact" src=${contactOutsideImage} alt="The Rustic Olive Restaurant">
        <img src=${contactInsideImage} alt="The Rustic Olive Restaurant">
        <div class="contact__information">
            <section>
                <h3>Our Location</h3>
                <p>The Rustic Olive</p>
                <p>123 Main Street, CityVille</p>
                <p>Address, Genare</p>
            </section>
            <section>
                <h3>Opening Hours</h3>
                <p>Monday - Friday:<br>11am - 10pm</p>
                <p>Saturday - Sunday:<br>10am - 11pm</p>
            </section>
            <section>
                <h3>Contact Information</h3>
                <p>Email: info@therusticolive.com</p>
                <p>Phone: (123) 456-7890</p>
            </section>
        </div>
    `;

    // Assemble structure and append to body
    contactContainer.appendChild(reservationsDiv);
    contactContainer.appendChild(connectDiv);

    return {
        contentHeader: contentHeader,
        contactContainer: contactContainer
    }
};