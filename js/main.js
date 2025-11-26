/**
 * main.js
 * Здесь собран "расширенный, но понятный" JavaScript:
 * 1) Карусель галереи
 * 2) Плавный скролл по якорям меню
 * 3) Валидация формы и сообщение о статусе
 * 4) Куки-баннер (сохранение согласия в localStorage)
 */

/* ============================
   1. КАРУСЕЛЬ ГАЛЕРЕИ
   ============================ */

(function setupGalleryCarousel() {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const prevBtn = document.querySelector(".gallery-prev");
  const nextBtn = document.querySelector(".gallery-next");

  if (!items.length) return;

  let currentIndex = 0;

  function updateActiveSlide() {
    items.forEach((item, index) => {
      item.classList.toggle("active", index === currentIndex);
    });
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    updateActiveSlide();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateActiveSlide();
  }

  prevBtn?.addEventListener("click", showPrev);
  nextBtn?.addEventListener("click", showNext);

  // Автопрокрутка раз в 6 секунд (можно отключить)
  setInterval(showNext, 6000);
})();

/* ============================
   2. ПЛАВНЫЙ СКРОЛЛ ДЛЯ МЕНЮ
   ============================ */

(function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const headerOffset = 70; // высота фиксированной шапки
      const rect = targetElement.getBoundingClientRect();
      const offsetTop = window.scrollY + rect.top - headerOffset;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });
})();

/* ============================
   3. ВАЛИДАЦИЯ ФОРМЫ
   ============================ */

(function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusBox = document.getElementById("formStatus");

  function setError(fieldId, message) {
    const errorBox = document.querySelector(
      `.input-error[data-error-for="${fieldId}"]`
    );
    if (errorBox) errorBox.textContent = message || "";
  }

  form.addEventListener("submit", function (e) {
    // Базовая проверка полей
    const name = form.querySelector("#name");
    const phone = form.querySelector("#phone");
    const message = form.querySelector("#message");

    let hasError = false;
    setError("name", "");
    setError("phone", "");
    setError("message", "");

    if (!name.value.trim()) {
      setError("name", "Введите ваше имя");
      hasError = true;
    }
    if (!phone.value.trim()) {
      setError("phone", "Укажите номер телефона");
      hasError = true;
    }
    if (!message.value.trim()) {
      setError("message", "Напишите хотя бы пару слов 🙂");
      hasError = true;
    }

    if (hasError) {
      e.preventDefault();
      statusBox.textContent = "Проверьте, пожалуйста, выделенные поля.";
      statusBox.style.color = "#ff6b6b";
      return;
    }

    // Если всё ОК — даём пользователю понятный отклик.
    // Здесь можно либо:
    // 1) дать форме отправиться как обычно (formsubmit сам всё сделает),
    // 2) либо перехватить и отправить через fetch.
    //
    // Для простоты учебного задания оставим вариант №1.

    statusBox.textContent = "Отправляем сообщение...";
    statusBox.style.color = "#b3b3b3";
    // дальше форма отправится стандартным способом (e.preventDefault мы НЕ вызываем)
  });
})();

/* ============================
   4. COOKIES-БАННЕР
   ============================ */

(function setupCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("cookieAcceptBtn");
  if (!banner || !acceptBtn) return;

  const STORAGE_KEY = "whiphound_cookies_accepted";

  // Если пользователь уже соглашался — баннер не показываем
  const alreadyAccepted = localStorage.getItem(STORAGE_KEY);
  if (alreadyAccepted === "yes") {
    banner.classList.add("hidden");
    return;
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEY, "yes");
    banner.classList.add("hidden");
  });
})();
