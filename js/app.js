function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

initNavigation();
initLicenseFilter();
setCurrentYear();
initSchedule();
