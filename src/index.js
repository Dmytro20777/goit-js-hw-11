import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from '../src/JS/API.js';

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let currentPage = 1;
let currentQuery = "";
const PER_PAGE = 40;


form.addEventListener("submit", handleFormSubmit);
loadMoreBtn.addEventListener("click", loadMoreImages);

loadMoreBtn.classList.add("hidden");

async function handleFormSubmit(event) {
  event.preventDefault();

  const searchQuery = event.target.elements.searchQuery.value.trim();

  if (searchQuery === "") {
    Notiflix.Notify.failure("Please enter a search query.");
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;
  
  // loadMoreBtn.style.display = "none";
  // loadMoreBtn.classList.add("hidden");

  loadMoreBtn.classList.remove("hidden");

  clearGallery();
  await fetchAndRenderImages();

  // loadMoreBtn.style.display = "block";
  // loadMoreBtn.classList.remove("hidden");
}

let hasDisplayedNotification = false; 

async function fetchAndRenderImages() {
  try {
    const { hits, totalHits } = await fetchImages(currentQuery, currentPage);

    if (hits.length === 0) {
      Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

    if (!hasDisplayedNotification) {      
     Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
     hasDisplayedNotification = true; 
       }

    renderImages(hits);

      if (currentPage * PER_PAGE < totalHits) {
        loadMoreBtn.style.display = "block";
    } else {
        loadMoreBtn.style.display = "none";
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notiflix.Notify.failure("Error fetching images. Please try again.");
  }
}

function renderImages(images) {
  const html = images.map((image) => createImageCardMarkup(image)).join("");
  gallery.insertAdjacentHTML("beforeend", html);

 
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function createImageCardMarkup(image) {
  const { webformatURL, likes, views, comments, downloads, tags } = image;
  return `
    <div class="photo-card">
      <a href="${webformatURL}" title="${tags}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>
  `;
}

function clearGallery() {
  gallery.innerHTML = "";
}

async function loadMoreImages() {
  currentPage += 1;
  await fetchAndRenderImages();
}

































// import axios from 'axios';
// import Notiflix from 'notiflix';

// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";

// const BASE_URL = "https://pixabay.com/api/"
// const API_KEY = "41176155-9be796c939d7e3f0a6537aedf"
// const PER_PAGE = 40; 

// const form = document.querySelector(".search-form")
// const gallery = document.querySelector(".gallery");
// const loadMoreBtn = document.querySelector(".load-more")

// let currentPage = 1;
// let currentQuery = "";

// form.addEventListener("submit", handleFormSubmit);
// loadMoreBtn.addEventListener("click", loadMoreImages);

// async function handleFormSubmit(event) {
//     event.preventDefault();

//     const searchQuery = event.target.elements.searchQuery.value.trim();

//     if (searchQuery === "") {
//         Notiflix.Notify.failure("Please enter a search query.");
//         return;
//     }

//     currentQuery = searchQuery;
//     currentPage = 1;
    
//     clearGallery();
//     await fetchAndRenderImages();
// }

// async function fetchAndRenderImages() {
//     try {
//         const response = await axios.get(buildApiUrl());
//         const { hits, totalHits } = response.data;

//         if (hits.length === 0) {
//             Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
//             return;
//         }

//         Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

//         renderImages(hits);

//         if (hits.length < totalHits) {
//             loadMoreBtn.style.display = "block";
//         } else {
//             loadMoreBtn.style.display = "none";
//             Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//         }
//     } catch (error) {
//         console.error("Error fetching images: ", error);
//         Notiflix.Notify.failure("Error fetching images. Please try again.");
//     }
// }

// function renderImages(images) {
//     const html = images.map((image) => createImageCardMarkup(image)).join("");
//     gallery.insertAdjacentHTML("beforeend", html);
// }

// function createImageCardMarkup(image) {
//     const { webformatURL, likes, views, comments, downloads, tags } = image;
//     return `
//     <div class="photo-card">
//         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//         <div class="info">
//             <p class="info-item"><b>Likes:</b> ${likes}</p>
//             <p class="info-item"><b>Views:</b> ${views}</p>
//             <p class="info-item"><b>Comments:</b> ${comments}</p>
//             <p class="info-item"><b>Downloads:</b> ${downloads}</p>
//         </div>
//     </div>
//     `;
// }


// function clearGallery() {
//     gallery.innerHTML = "";
// }

// async function loadMoreImages() {
//     currentPage += 1;
//     await fetchAndRenderImages();
// }

// function buildApiUrl() {
//     const queryParams = {
//         key: API_KEY,
//         q: currentQuery,
//         image_type: "photo",
//         orientation: "horizontal",
//         safesearch: true,
//         page: currentPage,
//         per_page: PER_PAGE,
//     };

//     const queryString = new URLSearchParams(queryParams).toString();
//     return `${BASE_URL}?${queryString}`;
// }