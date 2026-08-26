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
                      data-aos-duration = "1000"
                    data-aos-delay="${index * 150}"
                >

                    <img src="${food.image}" alt="${food.name}">

                    <h2>${food.name}</h2>

                    <p>₦${food.price.toLocaleString()}</p>

                    <button>${food.button}</button>

                </div>
            `;

        });

        // Refresh AOS after creating the cards
        AOS.refresh();

    })
    .catch(error => {
        console.log("Error:", error);
    });

// why choose us
fetch("whychoose.json")
    .then(response => response.json())
    .then(data => {

        const container = document.getElementById("whyContainer");

        data.forEach((item, index) => {

            container.innerHTML += `
                <div 
                    class="why-card"
                    data-aos="zoom-in"
                    data-aos-duration = "1000"
                    data-aos-delay="${index * 100}"
                >

                    <div class="why-icon">
                        ${item.icon}
                    </div>

                    <h3>${item.title}</h3>

                    <p>
                        ${item.description}
                    </p>

                </div>
            `;

        });

        AOS.refreshHard();

    })
    .catch(error => {
        console.log("Error loading JSON:", error);
    });
// services
fetch("services.json")
    .then(response => response.json())
    .then(data => {

        const container = document.getElementById("servicesContainer");

        data.forEach(service => {

            container.innerHTML += `
                <div class="service-card">

                    <div class="service-icon">
                        ${service.icon}
                    </div>

                    <h2>${service.title}</h2>

                    <p>
                        ${service.description}
                    </p>

                </div>
            `;

        });

    })
    .catch(error => {
        console.log("Error loading services:", error);
    });


const galleryItems = document.querySelectorAll(".gallery a");

galleryItems.forEach((item, index) => {
    item.setAttribute("data-aos", "fade-up");
    item.setAttribute("data-aos-delay", index * 100);
});

AOS.refresh();

document.addEventListener("DOMContentLoaded", function () {

    let reviews = [];
    let currentIndex = 0;

    const reviewContainer = document.getElementById("reviewContainer");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");


    fetch("reviews.json")
        .then(response => {

            if (!response.ok) {
                throw new Error("reviews.json could not be found");
            }

            return response.json();
        })

        .then(data => {

            reviews = data;

            showReview();

        })

        .catch(error => {

            console.log("Error loading reviews:", error);

            reviewContainer.innerHTML = `
                <p>Unable to load reviews.</p>
            `;

        });


    function showReview() {

        const review = reviews[currentIndex];

        reviewContainer.innerHTML = `
            <div class="review-card">

                <div class="rating">
                    ${review.rating}
                </div>

                <p>
                    "${review.review}"
                </p>

                <h3>
                    — ${review.name}
                </h3>

            </div>
        `;
    }


    nextBtn.addEventListener("click", function () {

        currentIndex++;

        if (currentIndex >= reviews.length) {
            currentIndex = 0;
        }

        showReview();

    });


    prevBtn.addEventListener("click", function () {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = reviews.length - 1;
        }

        showReview();

    });

});