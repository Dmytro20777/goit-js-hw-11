import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "41176155-9be796c939d7e3f0a6537aedf";
const PER_PAGE = 40;

export async function fetchImages(query, page) {
  const queryParams = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page: page,
    per_page: PER_PAGE,
  };

  try {
    const response = await axios.get(`${BASE_URL}?${new URLSearchParams(queryParams).toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching images: ", error);
    throw error;
  }
}
