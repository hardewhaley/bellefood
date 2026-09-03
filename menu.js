const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

fetch("food.json")
    .then(response => response.json())
    .then(foods => {

        const menuList = document.getElementById("menuList");

        foods.forEach((food, index) => {

            menuList.innerHTML += `
                <div 
                    class="food-card"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="${(index % 4) * 150}"
                    data-aos-offset="100"
                    data-aos-easing="ease-in-out"
                    data-aos-once="true"
                >

                    <img src="${food.image}" alt="${food.name}">

                    <h2>${food.name}</h2>

                    <p>₦${food.price.toLocaleString()}</p>

                    <button
                        class="add-to-cart-btn"
                        data-id="${food.id}"
                        data-name="${food.name}"
                        data-price="${food.price}"
                        data-image="${food.image}"
                    >
                        ${food.button}
                    </button>

                </div>
            `;

        });

        AOS.refresh();

    })
    .catch(error => {
        console.log("Error loading menu:", error);
    });