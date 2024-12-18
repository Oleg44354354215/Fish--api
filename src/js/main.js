import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const KEY = "47415256-2dfc8fe63cf3afc0ab872a04e";
const URL = "https://pixabay.com/api/";

const form = document.querySelector(".form");
const list = document.querySelector(".gallery");
const deleteBtn = document.querySelector(".but-delete");
const loadMoreBtn = document.querySelector(".btn-load-more");
const fishListBtn = document.querySelector("#fish-list-btn");
const fishListEl = document.querySelector("#fish-list");

let query = '';
let page = 1;
const perPage = 20;


const fishList = [
  "anchovy", "barracuda", "bass", "bluefish", "bream", "carp", "catfish", 
  "chub", "cod", "dogfish", "eel", "flounder", "grouper", "haddock", 
  "halibut", "herring", "kingfish", "lamprey", "mackerel", "mahi-mahi", 
  "marlin", "minnow", "mullet", "perch", "pike", "pollock", "salmon", 
  "sardine", "shark", "snapper", "sole", "sturgeon", "sunfish", 
  "tarpon", "tilapia", "trout", "tuna", "wahoo", "whitefish", "zander",
];

function renderFishList() {
  fishListEl.innerHTML = fishList.map(fish => `<li class="fish-list-item">${fish}</li>`).join('');
}

fishListBtn.addEventListener("click", () => {
  fishListEl.classList.toggle("active");
});

fishListEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("fish-list-item")) {
    const selectedFish = e.target.textContent;
    document.querySelector(".search-input").value = selectedFish;
    fishListEl.classList.remove("active");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = e.target.elements.query.value.trim().toLowerCase();

  if (!fishList.includes(query)) {
    iziToast.error({ message: "Please enter the name of a fish." });
    return;
  }

  page = 1;
  list.innerHTML = ''; 
  e.target.elements.query.value = ''; 

  try {
    const data = await fetchFishImages(query, page, perPage);
    if (data.hits.length === 0) {
      iziToast.info({ message: "No images found. Try another fish." });
      return;
    }

    createMarkup(data.hits);
    new SimpleLightbox(".gallery a", { captionsData: "alt", captionDelay: 250 });
    loadMoreBtn.style.display = data.totalHits > perPage ? "block" : "none";

    window.scrollTo({ top: list.offsetTop, behavior: "smooth" });
  } catch (error) {
    iziToast.error({ message: "Something went wrong. Please try again later." });
  }
});
deleteBtn.addEventListener("click", () => {
  list.innerHTML = ''; 
  loadMoreBtn.style.display = 'none'; 
  iziToast.info({ message: "Gallery cleared." });
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;

  try {
    const data = await fetchFishImages(query, page, perPage);
    createMarkup(data.hits);
    new SimpleLightbox(".gallery a", { captionsData: "alt", captionDelay: 250 }).refresh();

    if (page * perPage >= data.totalHits) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({ message: "You've reached the end of the results." });
    }
    window.scrollTo({ top: list.offsetTop + list.scrollHeight, behavior: "smooth" });
  } catch (error) {
    iziToast.error({ message: "Error loading more images." });
  }
});

async function fetchFishImages(query, page = 1, perPage = 20) {
  const { data } = await axios.get(URL, {
    params: {
      key: KEY,
      q: query,
      image_type: "photo",
      orientation: "horizontal",
      page,
      per_page: perPage,
    },
  });
  return data;
}
function createMarkup(images) {
  const markup = images.map(({ largeImageURL, webformatURL, tags, likes, views }) => `
    <li class="list-item">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p><strong>Likes:</strong> ${likes}</p>
          <p><strong>Views:</strong> ${views}</p>
          <p><strong>Tags:</strong> ${tags}</p>
        </div>
      </a>
    </li>
  `).join("");

  list.insertAdjacentHTML("beforeend", markup);
}
renderFishList();
