let globalLaptops;

/**
 * Requests laptops from API
 * @returns Json - laptops
 */
async function getLaptops() {
  let data = await fetch(
    "https://noroff-komputer-store-api.herokuapp.com/computers"
  );
  let response = await data.json();

  return response;
}
/**
 * -- filters out laptop based on id
 * -- sets selected laptop
 * @param {*} id - id of selected laptop
 */
async function selectedLaptop(id) {
  let selectedLaptop = globalLaptops.find((laptop) => laptop.id == id);

  setSpecs(selectedLaptop.specs);

  let laptopBody = generateLaptopHTML(selectedLaptop);

  document.getElementById("selected-laptop").innerHTML = laptopBody;
}

/**
 * sets params for laptop
 * @returns payload - HTML structure for laptop
 */
function generateLaptopHTML({ id, title, description, price, image }) {
  // FIXME: Report bugg
  if (image === "assets/images/5.jpg") {
    image = "assets/images/5.png";
  }

  let payload = `
    <div id="${id}" class="card-body shadow-lg p-3 mb-5 bg-white rounded d-flex justify-content-between">

        <div class="left-section">
            <img class="card-img-top" src="https://noroff-komputer-store-api.herokuapp.com/${image}">
        </div>
        
        <div class="middle-section">
            <h3 class="card-title">${title}</h3>
            <p class="card-text">${description}</p>
        </div>
        
        <div class="right-section">                
            <h3 class="card-text">${price} SEK</h3>
            <a onclick="buy(${price}, '${title}')" id="buy-now" style="color: white;" class="btn btn-primary">BUY NOW</a>
        </div>
  </div>  `;

  return payload;
}

/**
 * Requests API
 */
async function initLaptop() {
  globalLaptops = await getLaptops();

  initLaptopOptions();
}

/**
 * Sets dropdown options list and selected laptop
 */
function initLaptopOptions() {
  globalLaptops.forEach((laptop, i) => {
    // selects init laptop
    if (i === 0) {
      selectedLaptop(laptop.id);
    }

    // adds options to list
    document.getElementById(
      "laptop-options"
    ).innerHTML += `<li><a class="dropdown-item" onclick="selectedLaptop('${laptop.id}')">${laptop.title}</a></li>`;
  });
}

initLaptop();

/**
 * Helper function that sets specifications for selected laptop
 * @param {[]} specs
 */
function setSpecs(specs) {
  let specsDOM = "";

  for (let index = 0; index < specs.length; index++) {
    const spec = specs[index];

    if (index == 0) {
      specsDOM += `<ul> <li><small> ${spec}</small> </li> `;
    } else if (index == specs.length - 1) {
      specsDOM += `<li> <small> ${spec}</small></li> </ul> `;
    } else {
      specsDOM += `<li> <small> ${spec}</small></li>`;
    }
  }

  document.getElementById("specs").innerHTML = specsDOM;
}
