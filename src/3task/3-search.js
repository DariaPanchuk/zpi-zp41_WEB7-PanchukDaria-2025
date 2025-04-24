import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetch } from "./api.js";
import '../style.css';
import './search.css';

const refs = {
    form:  document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loader: document.querySelector('.loader'),
    loadMore: document.querySelector('.load-more'),
};

let lightbox;
let currentQuery = ''; 
let currentPage = 1;

refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSearch(event) {
    event.preventDefault();

    const query = refs.form.querySelector('input').value.trim();
    currentPage = 1;
    currentQuery = query;

    if (query === '') {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search term!',
            backgroundColor: '#F44336',
            titleColor: '#ffffff',
            messageColor: '#ffffff',
            close: true,
            progressBar: true,
            progressBarColor: '#9C1C1C',
            position: 'topRight',
            timeout: 50000,
            class: 'custom-error-toast',
        });
        return;
    }

    refs.gallery.innerHTML = '';
    refs.loader.classList.remove('hidden');
    refs.loadMore.classList.add('hidden');

    try {
        const data = await fetch(currentQuery, currentPage);
        renderGallery(data.hits, true);
        
        if (data.totalHits > 0) {
            iziToast.success({
                title: 'Success',
                message: `Found ${data.totalHits} images for "${query}"`,
                position: 'topRight',
                backgroundColor: '#59A10D',
                titleColor: '#ffffff',
                messageColor: '#ffffff',
                close: true,
                progressBar: true,
                progressBarColor: '#326101',
                position: 'topRight',
                timeout: 50000,
                class: 'custom-success-toast',
            });

            if (data.totalHits > data.hits.length) {
                refs.loadMore.classList.remove('hidden');
            }
        } else {
            iziToast.error({
                title: 'Error',
                message: `No images found for "${query}"`,
                position: 'topRight',
                backgroundColor: '#F44336',
                titleColor: '#ffffff',
                messageColor: '#ffffff',
                close: true,
                progressBar: true,
                progressBarColor: '#9C1C1C',
                position: 'topRight',
                timeout: 50000,
                class: 'custom-error-toast',
            });
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong. Please try again!',
            backgroundColor: '#F44336',
            titleColor: '#ffffff',
            messageColor: '#ffffff',
            close: true,
            progressBar: true,
            progressBarColor: '#9C1C1C',
            position: 'topRight',
            timeout: 50000,
            class: 'custom-error-toast',
        });
    } finally {
        refs.loader.classList.add('hidden');
    }

    refs.form.reset();
}

async function onLoadMore() {
    currentPage += 1;
    refs.loader.classList.remove('hidden');
    refs.loadMore.classList.add('hidden');

    try {
        const data = await fetch(currentQuery, currentPage);
        renderGallery(data.hits, false);
        
        if (data.hits.length > 0) {
            refs.loadMore.classList.remove('hidden');
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong. Please try again!',
            backgroundColor: '#F44336',
            titleColor: '#ffffff',
            messageColor: '#ffffff',
            close: true,
            progressBar: true,
            progressBarColor: '#9C1C1C',
            position: 'topRight',
            timeout: 50000,
            class: 'custom-error-toast',
        });
    } finally {
        refs.loader.classList.add('hidden');
    }
}

function renderGallery(images, replace = false) {
    const markup = images
        .map(image => {
            return `
            <li class="gallery-item">
                <a href="${image.largeImageURL}">
                    <img class="gallery-img img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                </a>
                <div class="info">
                    <div class="info-details">
                        <p class="info-title">Likes</p>
                        <p>${image.likes}</p>
                    </div>
                    <div class="info-details">
                        <p class="info-title">Views</p>
                        <p>${image.views}</p>
                    </div>
                    <div class="info-details">
                        <p class="info-title">Comments</p>
                        <p>${image.comments}</p>
                    </div>
                    <div class="info-details">
                        <p class="info-title">Downloads</p>
                        <p>${image.downloads}</p>
                    </div>
                </div>
            </li>
            `;
        })
        .join('');

    if (replace) {
        refs.gallery.innerHTML = markup;
    } else {
        refs.gallery.insertAdjacentHTML('beforeend', markup);
    }

    if (lightbox) {
        lightbox.refresh();
    } else {
        lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
        });
    }
}