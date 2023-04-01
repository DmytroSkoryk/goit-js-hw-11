import { fetchPhoto } from './js/fetchPhoto';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
  searchForm: document.querySelector('#search-form'),
  searchQuery: document.querySelector('input[name="searchQuery"]'),
  createGallery: document.querySelector('.gallery'),
  loadButton: document.querySelector('.load-more'),
  currentPage: 1,
};

const lightbox = new SimpleLightbox('.gallery a');

refs.loadButton.style.display = 'none';
refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadButton.addEventListener('click', onLoadMoreClick);

function onSearchFormSubmit(event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  refs.currentPage = 1;
  const searchName = refs.searchQuery.value.trim();
  if(!searchName){
    return;
  }
  fetchPhotos(searchName, refs.currentPage);
}

function onLoadMoreClick() {
  refs.currentPage += 1;
  const searchName = refs.searchQuery.value.trim();
  fetchPhotos(searchName, refs.currentPage);
}

let hasShownTotalHitsMessage = false;

async function fetchPhotos(searchName, page) {
  try {
    const data = await fetchPhoto(searchName, page);
    if (data) {
      const hits = data.hits;
      const totalHits = data.totalHits;
      const itemsPerPage = 40;
      const totalPages = Math.ceil(totalHits / itemsPerPage);
      
      if (refs.currentPage === 1) {
        hasShownTotalHitsMessage = false;
        refs.createGallery.innerHTML = '';
      }
      refs.createGallery.insertAdjacentHTML('beforeend', onCreatePhotoList(hits));
      if (hits.length === 0) {
        refs.loadButton.style.display = 'none';
        Notiflix.Notify.failure('No images found. Please try a different search query.');
      } else if (refs.currentPage >= totalPages) {
        refs.loadButton.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
        else {
        refs.loadButton.style.display = 'block';
      }
      if (!hasShownTotalHitsMessage && totalHits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        hasShownTotalHitsMessage = true;
      }
      
      lightbox.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}


function onCreatePhotoList(hits) {
  return hits
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `
        <div class="photo-card">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img-card" />
          </a>
          <div class="info">
            <p class="info-item">
              <b><span>Likes:</span><span>${likes}</span></b>
            </p>
            <p class="info-item">
              <b><span>Views:</span><span>${views}</span></b>
            </p>
            <p class="info-item">
              <b><span>Comments:</span><span>${comments}</span></b>
            </p>
            <p class="info-item">
              <b><span>Downloads:</span><span>${downloads}</span></b>
            </p>
          </div>
        </div>
      `;
    })
    .join('');
}
