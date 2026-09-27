function initLicenseFilter() {
  const filters = document.querySelectorAll(".class-tab");
  const cards = document.querySelectorAll(".class-card");

  filters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      filters.forEach((button) => {
        const isSelected = button === filterButton;
        button.classList.toggle("active", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });

      const selectedCategory = filterButton.dataset.filter;

      cards.forEach((card) => {
        const shouldHide =
          selectedCategory !== "all" &&
          card.dataset.category !== selectedCategory;

        card.classList.toggle("hidden", shouldHide);
      });
    });
  });
}
