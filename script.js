/* ============================================================
   script.js
   Здесь собрана вся логика:
   1) Плавный скролл по якорям
   2) Анимация появления секций при прокрутке
   3) Подсветка активного пункта меню
   4) Работа карусели (фотогалереи)
   5) Куки-баннер
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------------
  // 1. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРНЫМ ССЫЛКАМ
  // ----------------------------------------------------------
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      // Если ссылка вида "#about" и элемент с таким id есть на странице —
      // плавно прокручиваем к нему.
      if (href && href.startsWith("#") && href.length > 1) {
        const targetId = href.substring(1); // отрезаем # -> "about"
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // ----------------------------------------------------------
  // 2. АНИМАЦИЯ СЕКЦИЙ + ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
  // ----------------------------------------------------------
  const sections = document.querySelectorAll("section[id]"); // берем только секции с id
  const navLinks = document.querySelectorAll(".nav a");

  // Для начала задаём базовое состояние: секции спрятаны и чуть сдвинуты вниз.
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  // Функция подсветки активного пункта меню
  function highlightNav(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${id}`) {
        // Активный пункт — красим в teal и даем свечение
        link.style.color = "#17c9b4";
        link.style.textShadow = "0 0 10px rgba(23,201,180,0.8)";
      } else {
        // Остальные возвращаем к стилям по умолчанию из CSS
        link.style.color = "";
        link.style.textShadow = "";
      }
    });
  }

  // IntersectionObserver следит, какая секция сейчас видима на экране
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        const id = section.getAttribute("id");

        if (entry.isIntersecting) {
          // Когда секция попала в зону видимости — плавно отображаем её
          section.style.opacity = "1";
          section.style.transform = "translateY(0)";

          // И подсвечиваем соответствующий пункт меню
          if (id) highlightNav(id);
        }
      });
    },
    {
      threshold: 0.35, // Секция считается активной, когда примерно на 35% видна
    }
  );

  // Подключаем наблюдение за каждой секцией
  sections.forEach((section) => observer.observe(section));

  // ----------------------------------------------------------
  // 3. КАРУСЕЛЬ (ФОТОГАЛЕРЕЯ)
  // ----------------------------------------------------------
  const carouselTrack = document.querySelector(".carousel-track");
  const carouselSlides = document.querySelectorAll(".carousel-img");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  let currentSlide = 0;

  // Если галерея есть на странице, настраиваем её
  if (carouselTrack && carouselSlides.length > 0) {
    // Добавляем плавное смещение
    carouselTrack.style.transition = "transform 0.5s ease";

    // Функция показа конкретного слайда по индексу
    function showSlide(index) {
      const slideWidth = carouselSlides[0].clientWidth + 20; // ширина + отступ (gap ≈ 20px)
      const total = carouselSlides.length;

      // Зацикливаем индексы: -1 -> последний, последний+1 -> 0
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      currentSlide = index;

      const offset = -currentSlide * slideWidth;
      carouselTrack.style.transform = `translateX(${offset}px)`;
    }

    // Обработчики кнопок влево/вправо
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        showSlide(currentSlide - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        showSlide(currentSlide + 1);
      });
    }

    // Автоматическая прокрутка каждые 5 секунд
    setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);

    // При загрузке страницы показываем первый слайд
    showSlide(0);

    // На всякий случай пересчитываем ширину при изменении размера окна
    window.addEventListener("resize", () => {
      showSlide(currentSlide);
    });
  }

  // ----------------------------------------------------------
  // 4. COOKIE-БАННЕР
  // ----------------------------------------------------------
  const cookieBanner = document.getElementById("cookieBanner");
  const cookieAcceptBtn = document.getElementById("cookieAccept");

  // Ключ в localStorage, чтобы помнить, что пользователь уже согласился
  const COOKIE_KEY = "whiphound_cookies_accepted";

  // Функция показа баннера (если ещё не принимали)
  function maybeShowCookieBanner() {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted && cookieBanner) {
      cookieBanner.style.display = "block";
    }
  }

  // При клике — сохраняем флаг в localStorage и скрываем баннер
  if (cookieAcceptBtn && cookieBanner) {
    cookieAcceptBtn.addEventListener("click", () => {
      localStorage.setItem(COOKIE_KEY, "yes");
      cookieBanner.style.display = "none";
    });
  }

  // Показываем баннер при первой загрузке (если пользователь ещё не принимал)
  maybeShowCookieBanner();
});

