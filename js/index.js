let people = document.querySelector(".People");
let planets = document.querySelector(".Planets");
let films = document.querySelector(".Films");
let vehicles = document.querySelector(".Vehicles");
let starships = document.querySelector(".Starships");
let species = document.querySelector(".Species");

let main_content = document.querySelector(".main-content");
let curentPage = 1;
species.value = 1;
starships.value = 1;
people.value = 1;
planets.value = 1;
films.value = 1;
vehicles.value = 1;

species.addEventListener("click", GetSpecies);
starships.addEventListener("click", GetStarships);
people.addEventListener("click", GetPeople);
planets.addEventListener("click", GetPlanets);
films.addEventListener("click", GetFilms);
vehicles.addEventListener("click", GetVehicles);

//#region Person
function GetPeople() {
  curentPage = this.value;
  let data = JSON.parse(localStorage.getItem(`people/?page=${this.value}`));
  if (data === null) Request(`people/?page=${this.value}`, CreatePeoplesTable);
  else {
    CreatePeoplesTable(data);
  }
}
async function ShowPerson(data) {
  let text = [
    { text: `Height: ${data.height}` },
    { text: `Mass: ${data.mass}` },
    { text: `Gender: ${data.gender}` },
    { text: `Hair Color: ${data.hair_color}` }
  ];
  let urls = [
    {
      text: `Homeworld: `,
      url: data.homeworld
    },
    { text: `Species: `, url: data.species[0] }
  ];
  RemoveChildren();

  let idRegex = /\/([0-9]*)\/$/;
  let id = data.url.match(idRegex)[1];

  localStorage.setItem(`people/${id}/`, JSON.stringify(data));
  let information_block = document.createElement("div");
  information_block.setAttribute("class", "information_block");
  let src = `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
  information_block.innerHTML = `<img class="image" src=${src}></img>`;
  let block = document.createElement("div");
  block.setAttribute("class", "additionally_information");
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "name");
  h2.innerHTML = data.name;
  let additionally_div = document.createElement("div");
  additionally_div.setAttribute("class", "additionally_information");
  text.map(el => {
    additionally_div.appendChild(CreateAdditionallyInformationText(el.text));
  });

  let item = await CreateAdditionallyInformationURL(
    urls[0].text,
    urls[0].url,
    GetPlanet
  );
  additionally_div.appendChild(item);
  item = await CreateAdditionallyInformationURL(
    urls[1].text,
    urls[1].url,
    GetSpecie
  );
  additionally_div.appendChild(item);
  block.appendChild(h2);
  block.appendChild(additionally_div);
  information_block.appendChild(block);
  let information_block_additional = [];
  RemoveChildren();

  if (data.vehicles.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.vehicles, "vehicles", GetVehicle)
    );
  }
  if (data.films.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.films, "films", GetFilm)
    );
  }
  if (data.starships.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.starships, "starships", GetStarship)
    );
  }
  RemoveChildren();

  await main_content.appendChild(information_block);

  information_block_additional.map(el => {
    main_content.appendChild(el);
  });
}

function GetPerson() {
  let id = this.value;
  let data = JSON.parse(localStorage.getItem(`people/${id}/`));
  if (data === null) Request(`people/${id}/`, ShowPerson);
  else {
    ShowPerson(data);
  }
}
async function CreatePeoplesTable(data) {
  await RemoveChildren();

  localStorage.setItem(`people/?page=${curentPage}`, JSON.stringify(data));
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML = `<th>Name</th><th>Height</th><th>Mass</th><th>Gender</th>`;
  table.appendChild(row);
  let idRegex = /\/([0-9]*)\/$/;
  for (let i = 0; i < data.results.length; i++) {
    row = document.createElement("tr");
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "#";
    a.addEventListener("click", GetPerson);
    a.innerHTML = data.results[i].name;
    let id = data.results[i].url.match(idRegex)[1];
    a.value = id;
    td.appendChild(a);
    td.setAttribute("width", "20%");
    row.appendChild(td);
    row.appendChild(CreateTD(data.results[i].height, 350));
    row.appendChild(CreateTD(data.results[i].mass, 350));
    row.appendChild(CreateTD(data.results[i].gender, 350));
    table.appendChild(row);
  }
  await RemoveChildren();
  Pagination(data.count, GetPeople);
  main_content.appendChild(table);
}
//#endregion Person
//#region Planets
function GetPlanets() {
  curentPage = this.value;
  let data = JSON.parse(localStorage.getItem(`planets/?page=${this.value}`));
  if (data === null) Request(`planets/?page=${this.value}`, CreatePlanetsTable);
  else {
    CreatePlanetsTable(data);
  }
}
async function ShowPlanet(data) {
  let text = [
    { text: `Population: ${data.population}` },
    { text: `Rotation Period: ${data.rotation_period}` },
    { text: `Orbital Period: ${data.orbital_period}` },
    { text: `Diameter: ${data.diameter}` },
    { text: `Gravity: ${data.gravity}` },
    { text: `Terrain: ${data.terrain}` },
    { text: `Climate: ${data.climate}` }
  ];
  RemoveChildren();
  let idRegex = /\/([0-9]*)\/$/;
  let id = data.url.match(idRegex)[1];

  localStorage.setItem(`planets/${id}/`, JSON.stringify(data));
  let information_block = document.createElement("div");
  information_block.setAttribute("class", "information_block");
  let src = `https://starwars-visualguide.com/assets/img/planets/${id}.jpg`;
  let img = document.createElement("img");
  img.src = src;
  img.setAttribute("class", "image");
  img.onerror = function() {
    this.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
  };

  information_block.appendChild(img);
  let block = document.createElement("div");
  block.setAttribute("class", "additionally_information");
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "name");
  h2.innerHTML = data.name;
  let additionally_div = document.createElement("div");
  additionally_div.setAttribute("class", "additionally_information");
  text.map(el => {
    additionally_div.appendChild(CreateAdditionallyInformationText(el.text));
  });
  block.appendChild(h2);
  block.appendChild(additionally_div);
  RemoveChildren();
  information_block.appendChild(block);
  let information_block_additional = [];
  RemoveChildren();

  if (data.residents.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.residents, "characters", GetPerson)
    );
  }
  if (data.films.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.films, "films", GetFilm)
    );
  }
  RemoveChildren();

  await main_content.appendChild(information_block);

  information_block_additional.map(el => {
    main_content.appendChild(el);
  });
}
function GetPlanet() {
  let id = this.value;
  let data = JSON.parse(localStorage.getItem(`planets/${id}/`));
  if (data === null) Request(`planets/${id}/`, ShowPlanet);
  else {
    ShowPlanet(data);
  }
}
function CreatePlanetsTable(data) {
  RemoveChildren();
  localStorage.setItem(`planets/?page=${curentPage}`, JSON.stringify(data));
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML = `<th>Name</th><th>Climate</th><th>Population</th>`;
  table.appendChild(row);
  let idRegex = /\/([0-9]*)\/$/;
  for (let i = 0; i < data.results.length; i++) {
    row = document.createElement("tr");
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.addEventListener("click", GetPlanet);
    a.innerHTML = data.results[i].name;
    a.href = "#";
    let id = data.results[i].url.match(idRegex)[1];
    a.value = id;
    td.appendChild(a);
    td.setAttribute("width", "20%");
    row.appendChild(td);
    row.appendChild(CreateTD(data.results[i].climate, 450));
    row.appendChild(CreateTD(data.results[i].population, 450));
    table.appendChild(row);
  }
  RemoveChildren();
  Pagination(data.count, GetPlanets);
  main_content.appendChild(table);
}
//#endregion Planets
//#region Films
function GetFilms() {
  curentPage = this.value;
  let data = JSON.parse(localStorage.getItem(`films/?page=${this.value}`));
  if (data === null) Request(`films/?page=${this.value}`, CreateFilmsTable);
  else {
    CreateFilmsTable(data);
  }
}
async function ShowFilm(data) {
  let text = [
    { text: `Director: ${data.director}` },
    { text: `Producer: ${data.producer}` },
    { text: `Date Created: ${data.release_date}` }
  ];
  RemoveChildren();
  let idRegex = /\/([0-9]*)\/$/;
  let id = data.url.match(idRegex)[1];

  localStorage.setItem(`films/${id}/`, JSON.stringify(data));
  let information_block = document.createElement("div");
  information_block.setAttribute("class", "information_block");
  let src = `https://starwars-visualguide.com/assets/img/films/${id}.jpg`;
  let img = document.createElement("img");
  img.src = src;
  img.setAttribute("class", "image");

  information_block.appendChild(img);
  img.onerror = function() {
    this.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
  };
  let block = document.createElement("div");
  block.setAttribute("class", "additionally_information");
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "name");
  h2.innerHTML = data.title;
  let additionally_div = document.createElement("div");
  additionally_div.setAttribute("class", "additionally_information");
  text.map(el => {
    additionally_div.appendChild(CreateAdditionallyInformationText(el.text));
  });
  block.appendChild(h2);
  block.appendChild(additionally_div);
  RemoveChildren();

  information_block.appendChild(block);
  let information_block_additional = [];
  RemoveChildren();

  if (data.characters.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.characters, "characters", GetPerson)
    );
  }
  if (data.planets.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.planets, "planets", GetPlanet)
    );
  }
  if (data.starships.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.starships, "starships", GetStarship)
    );
  }
  if (data.vehicles.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.vehicles, "vehicles", GetVehicle)
    );
  }
  if (data.species.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.species, "species", GetSpecie)
    );
  }
  RemoveChildren();
  await main_content.appendChild(information_block);

  information_block_additional.map(el => {
    main_content.appendChild(el);
  });
}
function GetFilm() {
  let id = this.value;
  let data = JSON.parse(localStorage.getItem(`films/${id}/`));
  if (data === null) Request(`films/${id}/`, ShowFilm);
  else {
    ShowFilm(data);
  }
}
function CreateFilmsTable(data) {
  RemoveChildren();
  var sort_data = _.sortBy(data.results, "episode_id");
  data.results = sort_data;
  localStorage.setItem(`films/?page=${curentPage}`, JSON.stringify(data));
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML = `<th>Title</th><th>Date Created</th><th>Director</th><th>Producer(s)</th>`;
  table.appendChild(row);
  let idRegex = /\/([0-9]*)\/$/;
  for (let i = 0; i < data.results.length; i++) {
    row = document.createElement("tr");
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.addEventListener("click", GetFilm);
    a.innerHTML = data.results[i].title;
    a.href = "#";
    let id = data.results[i].url.match(idRegex)[1];
    a.value = id;
    td.appendChild(a);
    td.setAttribute("width", "20%");
    row.appendChild(td);
    row.appendChild(CreateTD(data.results[i].release_date, 15));
    row.appendChild(CreateTD(data.results[i].director, 15));
    row.appendChild(CreateTD(data.results[i].producer, 15));

    table.appendChild(row);
  }
  RemoveChildren();
  Pagination(data.count, GetFilms);
  main_content.appendChild(table);
}
//#endregion Films
//#region Vehicles

function GetVehicles() {
  curentPage = this.value;
  let data = JSON.parse(localStorage.getItem(`vehicles/?page=${this.value}`));
  if (data === null)
    Request(`vehicles/?page=${this.value}`, CreateVehiclesTable);
  else {
    CreateVehiclesTable(data);
  }
}
async function ShowVehicle(data) {
  let text = [
    { text: `Model: ${data.model}` },
    { text: `Manufacturer: ${data.manufacturer}` },
    { text: `Class: ${data.vehicle_class}` },
    { text: `Cost: ${data.cost_in_credits}` },
    { text: `Speed: ${data.max_atmosphering_speed}` },
    { text: `Length: ${data.length}` },
    { text: `Cargo Capacity: ${data.cargo_capacity}` },
    { text: `Mimimum Crew: ${data.crew}` },
    { text: `Passengers: ${data.passengers}` }
  ];
  RemoveChildren();
  let idRegex = /\/([0-9]*)\/$/;
  let id = data.url.match(idRegex)[1];

  localStorage.setItem(`vehicles/${id}/`, JSON.stringify(data));
  let information_block = document.createElement("div");
  information_block.setAttribute("class", "information_block");
  let src = `https://starwars-visualguide.com/assets/img/vehicles/${id}.jpg`;
  let img = document.createElement("img");
  img.src = src;
  img.setAttribute("class", "image");

  information_block.appendChild(img);
  img.onerror = function() {
    this.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
  };
  let block = document.createElement("div");
  block.setAttribute("class", "additionally_information");
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "name");
  h2.innerHTML = data.name;
  let additionally_div = document.createElement("div");
  additionally_div.setAttribute("class", "additionally_information");
  text.map(el => {
    additionally_div.appendChild(CreateAdditionallyInformationText(el.text));
  });
  block.appendChild(h2);
  block.appendChild(additionally_div);
  RemoveChildren();

  information_block.appendChild(block);
  let information_block_additional = [];
  RemoveChildren();

  if (data.films.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.films, "films", GetFilm)
    );
  }
  if (data.pilots.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.pilots, "characters", GetPerson)
    );
  }
  RemoveChildren();
  await main_content.appendChild(information_block);

  information_block_additional.map(el => {
    main_content.appendChild(el);
  });
}
function GetVehicle() {
  let id = this.value;
  let data = JSON.parse(localStorage.getItem(`vehicles/${id}/`));
  if (data === null) Request(`vehicles/${id}/`, ShowVehicle);
  else {
    ShowVehicle(data);
  }
}
function CreateVehiclesTable(data) {
  RemoveChildren();

  localStorage.setItem(`vehicles/?page=${curentPage}`, JSON.stringify(data));
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML = `<th>Name</th><th>Model</th><th>Manufacturer</th><th>Class</th>`;
  table.appendChild(row);
  let idRegex = /\/([0-9]*)\/$/;
  for (let i = 0; i < data.results.length; i++) {
    row = document.createElement("tr");
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.addEventListener("click", GetVehicle);
    a.innerHTML = data.results[i].name;
    a.href = "#";
    let id = data.results[i].url.match(idRegex)[1];
    a.value = id;
    td.appendChild(a);
    td.setAttribute("width", "20%");
    row.appendChild(td);
    row.appendChild(CreateTD(data.results[i].model, 255));
    row.appendChild(CreateTD(data.results[i].manufacturer, 255));
    row.appendChild(CreateTD(data.results[i].vehicle_class, 255));

    table.appendChild(row);
  }
  RemoveChildren();
  Pagination(data.count, GetVehicles);
  main_content.appendChild(table);
}
//#endregion Venicles
//#region Starships

function GetStarships() {
  curentPage = this.value;
  let data = JSON.parse(localStorage.getItem(`starships/?page=${this.value}`));
  if (data === null)
    Request(`starships/?page=${this.value}`, CreateStarshipsTable);
  else {
    CreateStarshipsTable(data);
  }
}
async function ShowStarship(data) {
  let text = [
    { text: `Model: ${data.model}` },
    { text: `Manufacturer: ${data.manufacturer}` },
    { text: `Class: ${data.vehicle_class}` },
    { text: `Cost: ${data.cost_in_credits}` },
    { text: `Speed: ${data.max_atmosphering_speed}` },
    { text: `Length: ${data.length}` },
    { text: `Cargo Capacity: ${data.cargo_capacity}` },
    { text: `Mimimum Crew: ${data.crew}` },
    { text: `Passengers: ${data.passengers}` }
  ];
  RemoveChildren();
  let idRegex = /\/([0-9]*)\/$/;
  let id = data.url.match(idRegex)[1];

  localStorage.setItem(`starships/${id}/`, JSON.stringify(data));
  let information_block = document.createElement("div");
  information_block.setAttribute("class", "information_block");
  let src = `https://starwars-visualguide.com/assets/img/starships/${id}.jpg`;
  let img = document.createElement("img");
  img.src = src;
  img.setAttribute("class", "image");

  information_block.appendChild(img);
  img.onerror = function() {
    this.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
  };
  let block = document.createElement("div");
  block.setAttribute("class", "additionally_information");
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "name");
  h2.innerHTML = data.name;
  let additionally_div = document.createElement("div");
  additionally_div.setAttribute("class", "additionally_information");
  text.map(el => {
    additionally_div.appendChild(CreateAdditionallyInformationText(el.text));
  });
  block.appendChild(h2);
  block.appendChild(additionally_div);
  RemoveChildren();

  information_block.appendChild(block);
  let information_block_additional = [];
  RemoveChildren();

  if (data.films.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.films, "films", GetFilm)
    );
  }
  if (data.pilots.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.pilots, "characters", GetPerson)
    );
  }
  RemoveChildren();
  await main_content.appendChild(information_block);

  information_block_additional.map(el => {
    main_content.appendChild(el);
  });
}
function GetStarship() {
  let id = this.value;
  let data = JSON.parse(localStorage.getItem(`starships/${id}/`));
  if (data === null) Request(`starships/${id}/`, ShowStarship);
  else {
    ShowStarship(data);
  }
}
function CreateStarshipsTable(data) {
  RemoveChildren();
  localStorage.setItem(`starships/?page=${curentPage}`, JSON.stringify(data));
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML = `<th>Name</th><th>Model</th><th>Manufacturer</th><th>Class</th>`;
  table.appendChild(row);
  let idRegex = /\/([0-9]*)\/$/;
  for (let i = 0; i < data.results.length; i++) {
    row = document.createElement("tr");
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.addEventListener("click", GetStarship);
    a.innerHTML = data.results[i].name;
    a.href = "#";
    let id = data.results[i].url.match(idRegex)[1];
    a.value = id;
    td.appendChild(a);
    td.setAttribute("width", "20%");
    row.appendChild(td);
    row.appendChild(CreateTD(data.results[i].model, 255));
    row.appendChild(CreateTD(data.results[i].manufacturer, 255));
    row.appendChild(CreateTD(data.results[i].starship_class, 255));

    table.appendChild(row);
  }
  RemoveChildren();
  Pagination(data.count, GetStarships);

  main_content.appendChild(table);
}
//#endregion Starships
//#region Species

function GetSpecies() {
  curentPage = this.value;
  let data = JSON.parse(localStorage.getItem(`species/?page=${this.value}`));
  if (data === null) Request(`species/?page=${this.value}`, CreateSpeciesTable);
  else {
    CreateSpeciesTable(data);
  }
}
async function ShowSpecie(data) {
  let text = [
    { text: `Classification: ${data.classification}` },
    { text: `Designation: ${data.designation}` },
    { text: `Language: ${data.language}` },
    { text: `Avg Lifespan: ${data.average_lifespan}` },
    { text: `Avg Height: ${data.average_height}` },
    { text: `Hair Color(s):: ${data.hair_colors}` },
    { text: `Skin Color(s): ${data.skin_colors}` },
    { text: `Eye Color(s): ${data.eye_colors}` }
  ];
  RemoveChildren();
  let idRegex = /\/([0-9]*)\/$/;
  let id = data.url.match(idRegex)[1];
  localStorage.setItem(`species/${id}/`, JSON.stringify(data));
  let information_block = document.createElement("div");
  information_block.setAttribute("class", "information_block");
  let src = `https://starwars-visualguide.com/assets/img/species/${id}.jpg`;
  let img = document.createElement("img");
  img.src = src;
  img.setAttribute("class", "image");

  information_block.appendChild(img);
  img.onerror = function() {
    this.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
  };
  let block = document.createElement("div");
  block.setAttribute("class", "additionally_information");
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "name");
  h2.innerHTML = data.name;
  let additionally_div = document.createElement("div");
  additionally_div.setAttribute("class", "additionally_information");
  text.map(el => {
    additionally_div.appendChild(CreateAdditionallyInformationText(el.text));
  });
  block.appendChild(h2);
  block.appendChild(additionally_div);
  RemoveChildren();

  information_block.appendChild(block);
  let information_block_additional = [];
  RemoveChildren();

  if (data.films.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.films, "films", GetFilm)
    );
  }
  if (data.people.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.people, "characters", GetPerson)
    );
  }
  RemoveChildren();
  await main_content.appendChild(information_block);

  information_block_additional.map(el => {
    main_content.appendChild(el);
  });
}
function GetSpecie() {
  let id = this.value;
  let data = JSON.parse(localStorage.getItem(`species/${id}/`));
  if (data === null) Request(`species/${id}/`, ShowSpecie);
  else {
    ShowSpecie(data);
  }
}
function CreateSpeciesTable(data) {
  RemoveChildren();
  localStorage.setItem(`species/?page=${curentPage}`, JSON.stringify(data));
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML = `<th>Name</th><th>Designation</th><th>Language</th><th>Skin Color(s)</th>`;
  table.appendChild(row);
  let idRegex = /\/([0-9]*)\/$/;
  for (let i = 0; i < data.results.length; i++) {
    row = document.createElement("tr");
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.addEventListener("click", GetSpecie);
    a.innerHTML = data.results[i].name;
    a.href = "#";
    let id = data.results[i].url.match(idRegex)[1];
    a.value = id;
    td.appendChild(a);
    td.setAttribute("width", "20%");
    row.appendChild(td);
    row.appendChild(CreateTD(data.results[i].designation, 255));
    row.appendChild(CreateTD(data.results[i].language, 255));
    row.appendChild(CreateTD(data.results[i].skin_colors, 255));

    table.appendChild(row);
  }
  RemoveChildren();
  Pagination(data.count, GetSpecies);

  main_content.appendChild(table);
}
//#endregion Species

async function CreateInformation(url, who, callback) {
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "name");
  h2.innerHTML = who.toUpperCase();
  let information_block = document.createElement("div");
  information_block.setAttribute("class", "information_blockAdd");
  let idRegex = /\/([0-9]*)\/$/;
  information_block.appendChild(h2);

  for (let i = 0; i < url.length; i++) {
    let div = document.createElement("div");
    div.setAttribute("class", "  smallImageDiv");
    let id = url[i].match(idRegex)[1];
    let data = JSON.parse(localStorage.getItem(url[i]));
    if (data === null) {
      data = await Request1(url[i]);
      localStorage.setItem(url[i], JSON.stringify(data));
    }

    let src = `https://starwars-visualguide.com/assets/img/${who}/${id}.jpg`;
    let img = document.createElement("img");
    img.src = src;
    img.setAttribute("class", "smallImage");
    if (who === "films")
      div.appendChild(CreateAdditionallyInformationText(data.title));
    else div.appendChild(CreateAdditionallyInformationText(data.name));

    div.appendChild(img);
    div.addEventListener("click", callback);
    div.value = id;
    information_block.appendChild(div);
    img.onerror = function() {
      this.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
    };
  }
  return information_block;
}

function CreateTD(text, width) {
  let td = document.createElement("td");
  td.innerHTML = text;
  td.setAttribute("width", `${width}px`);
  return td;
}

function CreateAdditionallyInformationText(text) {
  let p = document.createElement("p");
  p.setAttribute("class", "additionally_information_text");

  p.innerHTML = text;
  return p;
}
async function CreateAdditionallyInformationURL(text, url, callback) {
  let p = document.createElement("p");
  let idRegex = /\/([0-9]*)\/$/;
  let id = url.match(idRegex)[1];
  let data = JSON.parse(localStorage.getItem(url));
  if (data === null) {
    data = await Request1(url);
    localStorage.setItem(url, JSON.stringify(data));
  }

  p.innerHTML = `<a href="#">${text + data.name}</a>`;
  p.setAttribute("class", "additionally_information_text");
  p.addEventListener("click", callback);
  p.value = id;
  return p;
}
function RemoveChildren() {
  for (let i = 1; i < main_content.children.length; i++) {
    main_content.removeChild(main_content.children[i]);
  }
  if (main_content.children.length === 1) return;
  else RemoveChildren();
}
function Pagination(count, callback) {
  let totalPages = Math.ceil(count / 10);
  let ul = document.createElement("ul");
  ul.setAttribute("class", "pagination");
  if (totalPages > 1)
    for (let i = 0; i < totalPages; i++) {
      let li = document.createElement("li");
      if (curentPage === i + 1) li.setAttribute("class", "current");
      let a = document.createElement("a");
      a.innerHTML = i + 1;
      a.value = i + 1;
      a.addEventListener("click", callback);
      li.appendChild(a);
      ul.appendChild(li);
    }
  main_content.appendChild(ul);
}
async function Request1(path) {
  RemoveChildren();
  console.log(path);
  Preloader();

  let d;
  await fetch(path, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      d = data;
    })
    .catch(err => {
      console.log("Catch => ", err);
    });
  return d;
}
function Preloader() {
  let preloader = document.createElement("div");
  preloader.innerHTML = " <hr/><hr/><hr/><hr/>";
  preloader.setAttribute("class", "load");
  main_content.append(preloader);
}
function Request(path, callback) {
  const URL = `https://swapi.co/api/${path}`;
  console.log(URL);

  RemoveChildren();
  Preloader();
  fetch(URL, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      callback(data);
    })
    .catch(err => {
      console.log("Catch => ", err);
    });
}
