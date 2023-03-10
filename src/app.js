
const socialIconLinksChildren = document.querySelector('.socialIcons').children;

[...socialIconLinksChildren].forEach((icon) => {
  icon.addEventListener('mouseover', () => {
    icon.classList.toggle('socialIcons_icon--hover');
  });
    icon.addEventListener('mouseout', () => {
    icon.classList.toggle('socialIcons_icon--hover');
    });
});