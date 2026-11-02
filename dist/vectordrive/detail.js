// The project page has no homepage canvas or project-list dependency.
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const revealItems = document.querySelectorAll('.reveal');
if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealItems.forEach(item => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .08 });
  revealItems.forEach(item => observer.observe(item));
}
