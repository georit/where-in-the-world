/* ******variables****** */
const btnBack = document.getElementById("btn-back");

/* ******on load****** */
getCountryDetailsByName("south africa").then((countryData) =>
  displayCountryDetails(countryData)
);

/* ******functions****** */
async function getCountryDetailsByName(name) {
  const resp = await fetch(`https://restcountries.eu/rest/v2/name/${name}`);
  const data = await resp.json();

  let countryData = data[0];
  return countryData;
}

async function getCountryDetailsByCode(code) {
  const resp = await fetch(`https://restcountries.eu/rest/v2/alpha/${code}`);
  const data = await resp.json();

  let countryData = data;
  return countryData;
}

function displayCountryDetails(data) {
  let countryDetails = document.createElement("div");
  countryDetails.classList.add("country-details");

  countryDetails.innerHTML = `
  <div class="country-details-container">
  <button class="btn-back" id="btn-back">
	<i class="far fa-long-arrow-left"></i> Back
  </button>
  <div class="country-flag-container" style="background: url('${
    data.flag
  }') 0 0 / cover
	no-repeat;"></div>
  <div class="country-details">
	<p class="country-name">${data.name}</p>
	<div class="country-main-details">
	  <p class="country-detail">
		<span class="detail-title">Native Name:</span> ${data.nativeName}
	  </p>
	  <p class="country-detail population">
		<span class="detail-title">Population:</span> ${data.population.toLocaleString()}
	  </p>
	  <p class="country-detail">
		<span class="detail-title">Region:</span> ${data.region}
	  </p>
	  <p class="country-detail">
		<span class="detail-title">Sub Region:</span> ${data.subregion}
	  </p>
	  <p class="country-detail">
		<span class="detail-title">Capital:</span> ${data.capital}
	  </p>
	</div>
	<div class="country-other-details">
	  <p class="country-detail">
		<span class="detail-title">Top Level Domain:</span> ${data.topLevelDomain}
	  </p>
	  <p class="country-detail">
		<span class="detail-title">Currencies:</span>  ${getCurrencies(data).join(", ")}
	  </p>
	  <p class="country-detail">
		<span class="detail-title">Languages:</span> ${getLanguages(data).join(", ")}
	  </p>
	</div>
	<div class="border-countries-container">
	  <p class="border-countries-heading">Border Countries</p>
	  <div class="border-countries" id="border-countries"></div>
	</div>
  </div>
</div>
  `;

  document.querySelector(".wrapper").append(countryDetails);

  // border countries
  data.borders.forEach(async function (border) {
    let details = await getCountryDetailsByCode(border);

    let button = document.createElement("button");
    button.classList.add("btn-border-country");
    button.innerHTML = details.name;
    document.querySelector(".border-countries").appendChild(button);
  });

  // listen for border country button clicks
  document.querySelector(".border-countries").addEventListener("click", (e) => {
    if (e.target.className === "btn-border-country") {
      // clear country details
      countryDetails.remove();
      // display new country data
      getCountryDetailsByName(e.target.innerText).then((countryData) =>
        displayCountryDetails(countryData)
      );
    }
  });
}

function getCurrencies(data) {
  let monies = [];
  data.currencies.forEach((currency) => {
    monies.push(currency.name);
  });
  return monies;
}

function getLanguages(data) {
  let lingos = [];
  data.languages.forEach((currency) => {
    lingos.push(currency.name);
  });
  return lingos;
}

/* ******event listeners****** */
