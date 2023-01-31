import '../css/styles.css';
import { createMarkup } from './createpicturemarkup';
import Notiflix from 'notiflix';
import picturesApiSer from './fetchpictures';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoad = document.querySelector('.load-more');

formEl.addEventListener('submit', onFormSubmit);
buttonLoad.addEventListener('click', onButtonLoadMore);

async function onFormSubmit(evt) {
  evt.preventDefault();
  picturesApiSer.newQuery(formEl.elements.searchQuery.value.trim());
  if (picturesApiSer.searchQuery === '') {
    removeButtonClass();
    removeMarkup();
    return;
  }
  try {
    picturesApiSer.resetPage();
    const pictures = await picturesApiSer.fetchPictures();
    removeMarkup();
    showNotifixSuccess(pictures.hits.length, pictures);
    accessShowButton(pictures.totalHits);
    buttonLoad.classList.add('show');
    showNotifixFailure(pictures.hits.length);
    addMarkup(pictures.hits);
  } catch (error) {
    console.log(error);
  }
}

async function onButtonLoadMore() {
  const pictures = await picturesApiSer.fetchPictures();
  console.log(pictures.totalHits);
  accessShowButton(pictures.totalHits);
  addMarkup(pictures.hits);
}

function addMarkup(pictures) {
  galleryEl.insertAdjacentHTML('beforeend', createMarkup(pictures));
}

function removeMarkup() {
  galleryEl.innerHTML = '';
}

function removeButtonClass() {
  buttonLoad.classList.remove('show');
}

function accessShowButton(totalPictures) {
  if (totalPictures - 40 <= 0) {
    removeButtonClass();
  }
}

function showNotifixFailure(picturesCount) {
  if (picturesCount === 0) {
    removeButtonClass();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function showNotifixSuccess(picturesCount, pictures) {
  if (picturesCount !== 0) {
    Notiflix.Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
  }
}

var lightbox = new SimpleLightbox('.gallery__item', {
  captionsData: 'alt',
  captionDelay: 250,
});
