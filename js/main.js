
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

const burger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("nav__links--open");
  });
}

// Плавный скролл
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-scroll");
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      card.style.display =
        filter === "all" || category === filter ? "" : "none";
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
    if (!accepted) cookieBanner.classList.remove("hidden");
  } catch (e) {}
}

if (cookieAccept) {
  cookieAccept.addEventListener("click", () => {
    cookieBanner.classList.add("hidden");
    try {
      localStorage.setItem(COOKIE_KEY, "true");
    } catch (e) {}
  });
}

// ============================
//         TELEGRAM FORM
// ============================

const BOT_TOKEN = "8462308885:AAGKw5H6dRBKB4bUxbwxdHTPZbjeuwmyPzI";
const CHAT_ID = "317425235";
const TG_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

const contactForm = document.getElementById("contactForm");
const formToast = document.getElementById("formToast");

if (contactForm && formToast) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const dog = formData.get("dog")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !phone || !message) {
      showFormToast("Пожалуйста, заполните обязательные поля.", true);
      return;
    }

    const text = `
📩 *Новая заявка — Whiphound.ru*

👤 Имя: ${name}
☎️ Контакт: ${phone}
🐶 Собака: ${dog || "не указано"}

💬 Сообщение:
${message}
    `;

    try {
      await fetch(TG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "Markdown",
        }),
      });

      contactForm.reset();
      showFormToast("Спасибо! Заявка отправлена 💬", false);
    } catch (e) {
      showFormToast("Ошибка отправки. Попробуйте позже.", true);
    }
  });
}

function showFormToast(text, isError) {
  formToast.textContent = text;
  formToast.style.color = isError ? "var(--danger)" : "var(--accent-teal)";
}
