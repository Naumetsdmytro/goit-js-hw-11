import '../css/styles.css';
import { createMarkup } from './createpicturemarkup';
import Notiflix from 'notiflix';
import { picturesApiSer } from './fetchpictures';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import simpleLightbox from 'simplelightbox';

var lightbox = new SimpleLightbox('.gallery .gallery__item', {
  captionDelay: 250,
});

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

    buttonLoad.classList.add('show');
    if (pictures.totalHits <= (picturesApiSer.page - 1) * 40) {
      removeButtonClass();
    }

    showNotifixFailure(pictures.hits.length);
    addMarkup(pictures.hits);
    lightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}

async function onButtonLoadMore() {
  const pictures = await picturesApiSer.fetchPictures();

  if (pictures.hits.length < 40) {
    removeButtonClass();
  }
  addMarkup(pictures.hits);
  lightbox.refresh();
}

function removeButtonClass() {
  buttonLoad.classList.remove('show');
}

function addMarkup(pictures) {
  galleryEl.insertAdjacentHTML('beforeend', createMarkup(pictures));
}

function removeMarkup() {
  galleryEl.innerHTML = '';
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
