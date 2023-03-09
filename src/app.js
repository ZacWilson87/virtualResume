
const socialIconLinks = document.querySelector('.socialIcons').children;

[...socialIconLinks].forEach((icon) => {
  icon.addEventListener('mouseover', () => {
    icon.classList.toggle('socialIcons_icon--hover');
  });
    icon.addEventListener('mouseout', () => {
    icon.classList.toggle('socialIcons_icon--hover');
    });
});