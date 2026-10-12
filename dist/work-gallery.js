(() => {
  const gallery = document.querySelector('.overview-gallery');
  if (gallery) {
    gallery.querySelectorAll('.gallery-group').forEach(group => {
      const copy = group.cloneNode(true);
      copy.classList.add('is-loop-copy');
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('img').forEach(img => img.alt = '');
      group.parentElement.append(copy);
    });
    // Pause off screen; duplicate groups make the end of each loop seamless.
    new IntersectionObserver(([entry]) => {
      gallery.classList.toggle('is-offscreen', !entry.isIntersecting);
    }).observe(gallery);
    gallery.classList.add('is-ready');
  }
})();
