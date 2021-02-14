import { vars } from '../utils/vars';

const imagePreview = document.querySelector('#pwp-settings-push-badge');

if (imagePreview) {
  const img = imagePreview.querySelector('.fileuploader__preview img');
  /*
  if (img) {
    const src = img.getAttribute('src');
    const div = document.createElement('div');
    console.log('SRC', src);
    div.style.backgroundImage = src;
    img.replaceWith(div);
  }*/
}