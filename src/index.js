import { ImageFetchservice } from './imageFetchServise';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import "fontawesome-4.7/css/font-awesome.min.css";
import Notiflix from 'notiflix';


const imageService = new ImageFetchservice();
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let searchTerm;
let page = 1;
let imgeCount = 0;

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', loadMore);

async function handleSubmit(event) {
    event.preventDefault();
    if (searchTerm !== event.target.searchQuery.value.trim() && searchTerm !== undefined) {
        cleareOldSerch();
    };
    searchTerm = event.target.searchQuery.value.trim();
    if (searchTerm.length > 0) {
        loadMore();
    } else  {
        Notiflix.Notify.warning('Search criteria is empty. Please correct your request', { showOnlyTheLastOne: true });
    }
};

async function loadMore() {
    let result = await fetchImages(searchTerm, page); 
	gallery.insertAdjacentHTML("beforeend", createGalleryMarckup(result.data.hits));
	if (page === 1 && result.data.totalHits > 0) {
		Notiflix.Notify.success(`Hooray! We found ${result.data.totalHits} images.`);
	} 
	page += 1;
	imgeCount += result.data.hits.length;
	lightbox.refresh();

	if (imgeCount >= imageService.MAX_RESULTS_LIMIT) {
		loadMoreBtn.classList.add('is-hidden');
		Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.", { showOnlyTheLastOne: true });
	} else if (imgeCount === 0) {
		Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
	} else if (imgeCount > 0 && imgeCount < result.data.totalHits && imgeCount === 1) { 
		loadMoreBtn.classList.remove('is-hidden');    
	}
}

async function fetchImages(searchTerm, page) { 
    try {
        const response = await imageService.getImages(searchTerm, page);
        return response;
    } catch (error) {
        console.error(error);
    }
};

function cleareOldSerch() {
    page = 1;
    searchTerm = '';
    gallery.innerHTML = '';
    imgeCount = 0;
}

function createGalleryMarckup(response) {
    return response
        .map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
            <li class="photo-card">
                <a href="${largeImageURL}">
                    <img class="card-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                </a>
                <div class="info">
                    <p class="info-item">
                    <b >Likes: ${likes}</b>
                    </p>
                    <p class="info-item">
                    <b>Views: ${views}</b>
                    </p>
                    <p class="info-item">
                    <b>Comments: ${comments}</b>
                    </p>
                    <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                    </p>
                </div>
            </li>
        `}).join('');    
};

const option = {
    captionsData: 'alt',
}

let lightbox = new SimpleLightbox('.gallery a', option);