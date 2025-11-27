// Год в футере
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Бургер-меню
const burger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("nav__links--open");
  });
}

// Плавный скролл по кнопкам меню
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-scroll");
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // закрываем меню на мобилке
    if (navLinks && navLinks.classList.contains("nav__links--open")) {
      navLinks.classList.remove("nav__links--open");
    }
  });
});

// Фильтр галереи
const galleryButtons = document.querySelectorAll(".chip");
const galleryCards = document.querySelectorAll(".gallery-card");

galleryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter") || "all";

    galleryButtons.forEach((b) => b.classList.remove("chip--active"));
    btn.classList.add("chip--active");

    galleryCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (!category) return;
      if (filter === "all" || category === filter) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Cookie banner
const cookieBanner = document.getElementById("cookieBanner");
const cookieAccept = document.getElementById("cookieAccept");
const COOKIE_KEY = "whiphound_cookie_accepted";

if (cookieBanner) {
  try {
    const accepted = localStorage.getItem(COOKIE_KEY) === "true";
    if (!accepted) {
      cookieBanner.classList.remove("hidden");
    }
  } catch (e) {
    // localStorage может быть недоступен — тихо игнорируем
  }
}

if (cookieAccept && cookieBanner) {
  cookieAccept.addEventListener("click", () => {
    cookieBanner.classList.add("hidden");
    try {
      localStorage.setItem(COOKIE_KEY, "true");
    } catch (e) {}
  });
}

// Обработка формы
const contactForm = document.getElementById("contactForm");
const formToast = document.getElementById("formToast");

if (contactForm && formToast) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get("name") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!name || !phone || !message) {
      showFormToast(
        "Пожалуйста, заполните обязательные поля.",
        true
      );
      return;
    }

    // Здесь могла бы быть отправка на сервер / в бота.
    // Для учебного статика — просто "успех".
    contactForm.reset();
    showFormToast(
      "Спасибо за заявку! Я свяжусь с вами в ближайшее время.",
      false
    );
  });

  function showFormToast(text, isError) {
    formToast.textContent = text;
    formToast.style.color = isError ? "var(--danger)" : "var(--primary)";
  }
}
