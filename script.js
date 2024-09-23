const SELECTED_CLASS = "selected";
const CAROUSEL_SHOW_CLASS = "carousel-show";


const filterButtons = document.querySelectorAll(".filter-items");
const carouselButtons = document.querySelectorAll("[data-carousel-button]");
const portfolioContainer = document.querySelector(".portfolio-container");


const toggleClass = ({ element, className, add = true }) => {
    if (add) {
        element.className += ` ${className}`;
    } else {
        element.className = element.className
            .replace(new RegExp(`\\b${className}\\b`, "g"), "")
            .trim();
    }
};


const updateCarouselButtonVisibility = ({ newIndex, visibleSlides }) => {
    carouselButtons.forEach((button) => {
        const isHidden =
            (button.dataset.carouselButton === "prev" && newIndex === 0) ||
            (button.dataset.carouselButton === "next" &&
                newIndex >= visibleSlides.length - 1);
        button.classList[isHidden ? "add" : "remove"]("disable");
    });
};


const filterPortfolioItems = ({ filterCategory }) => {
    const portfolioItems = document.querySelectorAll(".portfolio-items");
    let firstActive = true;


    portfolioItems.forEach((item) => {
        const isVisible =
            filterCategory === "All" ||
            item.dataset.portfolioCategory === filterCategory;
        item.style.display = isVisible ? "block" : "none";
        toggleClass({ element: item, className: CAROUSEL_SHOW_CLASS, add: false });


        if (isVisible && firstActive) {
            toggleClass({ element: item, className: CAROUSEL_SHOW_CLASS });
            firstActive = false;
        }
    });


    const visibleItems = [...portfolioItems].filter(
        (item) => item.style.display !== "none"
    );
    updateCarouselButtonVisibility({ newIndex: 0, visibleSlides: visibleItems });
};


// Event Listeners
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const activeButton = document.querySelector(
            `.filter-items.${SELECTED_CLASS}`
        );
        toggleClass({ element: activeButton, className: SELECTED_CLASS, add: false });
        toggleClass({ element: button, className: SELECTED_CLASS });
        filterPortfolioItems({ filterCategory: button.textContent.trim() });
    });
});


carouselButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1;
        const visibleSlides = [...portfolioContainer.children].filter(
            (slide) => slide.style.display !== "none"
        );
        const activeSlide = visibleSlides.find((slide) =>
            slide.className.includes(CAROUSEL_SHOW_CLASS)
        );


        if (!activeSlide) return;


        let newIndex = visibleSlides.indexOf(activeSlide) + offset;
        if (newIndex < 0 || newIndex >= visibleSlides.length) return;


        // Re-enable both buttons (in case they were disabled)
        carouselButtons.forEach((btn) => {
            btn.style.display = "block";
        });


        toggleClass({ element: activeSlide, className: CAROUSEL_SHOW_CLASS, add: false });
        toggleClass({ element: visibleSlides[newIndex], className: CAROUSEL_SHOW_CLASS });

        updateCarouselButtonVisibility({ newIndex: newIndex, visibleSlides: visibleSlides });
    });
});