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

// loadMoreBtn.classList.add("hidden")
loadMoreBtn.style.display = "none";

async function handleFormSubmit(event) {
  event.preventDefault();

  const searchQuery = event.target.elements.searchQuery.value.trim();

  if (searchQuery === "") {
    Notiflix.Notify.failure("Please enter a search query.");
    // loadMoreBtn.classList.add("hidden")
    loadMoreBtn.style.display = "none";
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;
  
  // loadMoreBtn.classList.add("hidden");
  loadMoreBtn.style.display = "none";

  clearGallery();
  await fetchAndRenderImages();
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
        //  loadMoreBtn.classList.remove("hidden");
        loadMoreBtn.style.display = "block";
    } else {
        // loadMoreBtn.classList.add("hidden");
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
