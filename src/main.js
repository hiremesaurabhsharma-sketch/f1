const moneyFormatter = new Intl.NumberFormat("en-US");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

const counter = document.querySelector("[data-counter]");
if (counter) {
  const target = Number(counter.dataset.counter);
  const counterObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    const start = performance.now();
    const duration = 1800;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = moneyFormatter.format(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    counterObserver.disconnect();
  });
  counterObserver.observe(counter);
}

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
let ringX = 0;
let ringY = 0;
let dotX = 0;
let dotY = 0;

window.addEventListener("pointermove", (event) => {
  dotX = event.clientX;
  dotY = event.clientY;
  if (cursorDot) cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
});

const animateCursor = () => {
  ringX += (dotX - ringX) * 0.18;
  ringY += (dotY - ringY) * 0.18;
  if (cursorRing) cursorRing.style.transform = `translate(${ringX - 17}px, ${ringY - 17}px)`;
  requestAnimationFrame(animateCursor);
};
animateCursor();

document.querySelectorAll("a, button, .tilt-card").forEach((element) => {
  element.addEventListener("pointerenter", () => cursorRing?.classList.add("is-hovering"));
  element.addEventListener("pointerleave", () => cursorRing?.classList.remove("is-hovering"));
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) translateY(0)";
  });
});

document.querySelectorAll("[data-marquee]").forEach((marquee) => {
  marquee.innerHTML += marquee.innerHTML;
});

const testimonials = [...document.querySelectorAll(".testimonial-card")];
let activeTestimonial = 0;
const showTestimonial = (index) => {
  testimonials[activeTestimonial]?.classList.remove("active");
  activeTestimonial = (index + testimonials.length) % testimonials.length;
  testimonials[activeTestimonial]?.classList.add("active");
};
document.querySelector("[data-next]")?.addEventListener("click", () => showTestimonial(activeTestimonial + 1));
document.querySelector("[data-prev]")?.addEventListener("click", () => showTestimonial(activeTestimonial - 1));
setInterval(() => showTestimonial(activeTestimonial + 1), 5200);

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
menuToggle?.addEventListener("click", () => {
  const isOpen = mobileMenu?.classList.toggle("is-open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});
