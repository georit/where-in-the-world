/* ******variables****** */
const themeLink = document.getElementById("theme-link");
const themeSwitch = document.getElementById("toggle-switch");
const themeSwitchIcon = document.getElementById("toggle-switch-icon");
const themeSwitchText = document.getElementById("toggle-switch-text");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const filterToggle = document.getElementById("filter-instruction");
const filterToggleIcon = document.getElementById("icon-filter-instruction");
const filterOptions = document.getElementById("filter-options");
const countriesEl = document.getElementById("countries");

/* ******on load****** */
getAllCountriesData();

/* ******functions****** */
function showFilterOptions() {
  if (filterOptions.classList.contains("hidden")) {
    //show filter options
    filterOptions.classList.remove("hidden");
    // change toggle icon
    filterToggleIcon.className = "fas fa-chevron-down icon-filter-instruction";
  } else {
    //hide filter options
    filterOptions.classList.add("hidden");
    // change toggle icon
    filterToggleIcon.className = "fas fa-chevron-up icon-filter-instruction";
  }
}

async function getAllCountriesData() {
  try {
    const resp = await fetch("https://restcountries.eu/rest/v2/all");
    const data = await resp.json();

    data.forEach((item) => createCountryEL(item));
  } catch (error) {
    console.log(error);
  }
}

async function searchCountryByName(name) {
  try {
    const resp = await fetch(`https://restcountries.eu/rest/v2/name/${name}`);
    const data = await resp.json();

    if (data) {
      data.forEach((item) => createCountryEL(item));
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCountriesByRegion(region) {
  try {
    const resp = await fetch(
      `https://restcountries.eu/rest/v2/region/${region}`
    );
    const data = await resp.json();

    if (data) {
      data.forEach((item) => createCountryEL(item));
    }
  } catch (error) {
    console.log(error);
  }
}

function createCountryEL(info) {
  let country = document.createElement("div");
  country.classList.add("country");

  country.innerHTML = `
  <div class="country-flag-container" style="background: url('${
    info.flag
  }') 0 0 / cover no-repeat;"></div>
  <div class="country-info">
	<p class="country-name">${info.name}</p>
	<p class="country-population">
	  <span class="population-data country-data">Population:</span>
	  ${info.population.toLocaleString()}
	</p>
	<p class="country-region">
	  <span class="region-data country-data">Region:</span>
	  ${info.region}
	</p>
	<p class="country-capital">
	  <span class="capital-data country-data">Capital:</span>
	  ${info.capital}
	</p>
  </div>`;

  countriesEl.appendChild(country);
}

function filterCountries(option) {
  let countries = [...document.querySelectorAll(".country")];

  countries.forEach((country) => {
    if (!country.classList.contains(option)) {
      country.classList.add("hidden");
    } else {
      country.classList.remove("hidden");
    }
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* ******event listeners****** */
// switch theme
themeSwitch.addEventListener("click", () => {
  if (themeLink.getAttribute("href") === "./dist/css/styles_light.css") {
    // change stylesheet
    themeLink.setAttribute("href", "./dist/css/styles_dark.css");
    // change switch text
    themeSwitchText.innerText = "Light Mode";
    //change switch icon
    themeSwitchIcon.className = "fas fa-moon toggle-switch-icon";
  } else {
    // change stylesheet
    themeLink.setAttribute("href", "./dist/css/styles_light.css");
    // change switch text
    themeSwitchText.innerText = "Dark Mode";
    //change switch icon
    themeSwitchIcon.className = "far fa-moon toggle-switch-icon";
  }
});

// show filter options
filterToggle.addEventListener("click", () => {
  showFilterOptions();
});

// filter countries
filterOptions.addEventListener("click", (e) => {
  let clickedEl = e.target;

  if (clickedEl.className === "filter-option") {
    // clean up countries
    countriesEl.innerHTML = "";
    // display filtered countries
    clickedEl.id === "all"
      ? getAllCountriesData()
      : getCountriesByRegion(clickedEl.id);
    // hide filter options
    showFilterOptions();
  }
});

// search for country
searchForm.addEventListener("submit", (e) => {
  if (searchInput.value.length > 0) {
    // clear countries
    countriesEl.innerHTML = "";
    searchCountryByName(searchInput.value);
  }
  e.preventDefault();
});

// event listener to display country details
countriesEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("country")) {
    let countryName = e.target.children[1].firstElementChild.innerText;

    // hide homepage
    document.getElementById("search-filter-countries-container").style.display =
      "none";
    // display country details
    getCountryDetailsByName(countryName).then((countryData) =>
      displayCountryDetails(countryData)
    );
  }
});
