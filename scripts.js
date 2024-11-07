//topbar toggle and respond
document.getElementById("nav-toggle").addEventListener("click", function () {
  const navLinks = document.querySelector(".nav-links");
  const navRightPart = document.querySelector(".nav-right-part");
  const recipePage = document.querySelector(".recipe-page");

  navLinks.classList.toggle("show");
  navRightPart.classList.toggle("show");

  if (
    (navLinks.classList.contains("show") ||
      navRightPart.classList.contains("show")) &&
    recipePage
  ) {
    recipePage.style.marginTop = "16rem";
  } else if (recipePage) {
    recipePage.style.marginTop = "0";
  }
});

function showInstructions(instructions) {
  return instructions
    .map(
      (instr) => `
    <div class="instruc"> 
      <header>
      <p>step ${instr.step}</p>
      <div></div>
      </header>
      <p>${instr.text}</p>
    </div>
    `
    )
    .join("");
}

function showIngredients(ingredients) {
  return ingredients
    .map(
      (ingredient) => `
          <div class="ingredient">
              <div class="ingredient-item">${ingredient.item}</div>
              <div class="ingredient-amount">${ingredient.amount}</div>
              <div class="ingredient-unit">${ingredient.unit}</div>
          </div>
    `
    )
    .join("");
}

function showRecipe(recipe) {
  let recipePage = document.querySelector(".recipe-page");
  if (!recipePage) {
    recipePage = document.createElement("div");
    recipePage.className = "recipe-page";
    document.body.appendChild(recipePage);
  }
  recipePage.innerHTML = "";
  const recipeHero = document.createElement("section");
  recipeHero.className = "recipe-hero";

  const recipeImage = document.createElement("img");
  recipeImage.src = recipe.image;
  recipeImage.className = "img recipe-hero-img";
  recipeImage.alt = recipe.name;
  recipeHero.appendChild(recipeImage);

  const recipeDetails = document.createElement("div");
  recipeDetails.className = "recipe-details";

  const article = document.createElement("article");
  const nameElement = document.createElement("h1");
  nameElement.className = "cuisine-name";
  nameElement.textContent = recipe.name;
  const categoryElement = document.createElement("h2");
  categoryElement.className = "cuisine-cat";
  categoryElement.textContent = recipe.cuisine;
  const descriptionElement = document.createElement("p");
  descriptionElement.className = "description";
  descriptionElement.textContent = recipe.description;
  article.append(nameElement, categoryElement, descriptionElement);
  recipeDetails.appendChild(article);

  //create container for buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  // Double Serving button
  const doubServButton = document.createElement("button");
  doubServButton.id = "double-servings";
  doubServButton.textContent = "Double Servings";
  doubServButton.onclick = toggleServings;
  buttonContainer.appendChild(doubServButton);

  // unit-convert button
  const unitButton = document.createElement("button");
  unitButton.id = "convert-units";
  unitButton.textContent = "Convert to Imperial";
  unitButton.onclick = convertUnits;
  buttonContainer.appendChild(unitButton);

  recipeDetails.appendChild(buttonContainer);

  const quickFacts = document.createElement("div");
  quickFacts.className = "quick-facts";
  const quickFactsTitle = document.createElement("h4");
  quickFactsTitle.textContent = "Quick Facts";
  quickFacts.appendChild(quickFactsTitle);

  const recipeIcons = document.createElement("div");
  recipeIcons.className = "recipe-icons";
  recipeIcons.innerHTML = `
    
      <article><i class="fas fa-clock"></i><h5>prep time</h5><p>${recipe.prepTime} min.</p></article>
      <article><i class="far fa-clock"></i><h5>cook time</h5><p>${recipe.cookTime} min.</p></article>
      <article><i class="fas fa-user-friends"></i><h5>servings</h5><p id="servings">${recipe.servings}</p></article>
      <article><i class="fas fa-tasks"></i><h5>difficulty</h5><p>${recipe.difficulty}</p></article>
    
    `;
  quickFacts.appendChild(recipeIcons);

  recipeDetails.appendChild(quickFacts);

  const nutritionFacts = document.createElement("div");
  nutritionFacts.className = "nutrition-facts";
  const nutritionFactsTitle = document.createElement("h4");
  nutritionFactsTitle.textContent = "Nutrition Facts";
  nutritionFacts.appendChild(nutritionFactsTitle);

  const nutritionContainer = document.createElement("div");
  nutritionContainer.className = "recipe-nutrition";
  nutritionContainer.innerHTML = `
    
        <div class="nutrition-item"><i class="fas fa-fire"></i><h5>Calories</h5><p>${recipe.nutritionalInfo.calories}</p></div>
        <div class="nutrition-item"><i class="fas fa-drumstick-bite"></i><h5>Protein</h5><p>${recipe.nutritionalInfo.protein}</p></div>
        <div class="nutrition-item"><i class="fas fa-bread-slice"></i><h5>Carbohydrate</h5><p>${recipe.nutritionalInfo.carbohydrates}</p></div>
        <div class="nutrition-item"><i class="fas fa-bacon"></i><h5>Fat</h5><p>${recipe.nutritionalInfo.fat}</p></div>
   
      `;

  nutritionFacts.appendChild(nutritionContainer);
  recipeDetails.appendChild(nutritionFacts);
  recipeHero.appendChild(recipeDetails);
  recipePage.appendChild(recipeHero);

  const recipeContent = document.createElement("section");
  recipeContent.className = "recipe-content";

  const instructions = document.createElement("article");
  instructions.className = "instructions";
  const instructionsTitle = document.createElement("h4");
  instructionsTitle.textContent = "Instructions";
  instructions.appendChild(instructionsTitle);
  instructions.innerHTML += showInstructions(recipe.instructions);
  recipeContent.appendChild(instructions);

  const recipeInfoSection = document.createElement("article");
  recipeInfoSection.className = "recipe-info-section";

  const ingredients = document.createElement("div");
  ingredients.className = "ingredients";
  const ingredientsTitle = document.createElement("h4");
  ingredientsTitle.textContent = "Ingredients";
  ingredients.appendChild(ingredientsTitle);
  ingredients.innerHTML += showIngredients(recipe.ingredients);
  recipeInfoSection.appendChild(ingredients);

  const recipeTags = document.createElement("div");
  recipeTags.className = "recipe-tags";
  const tagsHTML = recipe.tags.map((tag) => `<a href="#">${tag}</a>`).join("");
  recipeTags.innerHTML = `Tags: ${tagsHTML}`;
  recipeInfoSection.appendChild(recipeTags);

  recipeContent.appendChild(recipeInfoSection);
  recipePage.appendChild(recipeContent);

  document.getElementById("dropdown-menu").style.display = "none";

  showTime();
}

document.addEventListener("DOMContentLoaded", function () {
  const recipeList = document.getElementById("recipe-list");
  const dropdownMenu = document.getElementById("dropdown-menu");

  dropdownMenu.style.display = "none";

  recipeList.addEventListener("click", async function (event) {
    event.preventDefault();

    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
      return;
    }

    const response = await fetch("recipes.json");
    const recipes = await response.json();

    dropdownMenu.innerHTML = "";
    recipes.forEach((recipe) => {
      const item = document.createElement("a");
      item.href = "#";
      item.textContent = recipe.name;
      item.addEventListener("click", function () {
        showRecipe(recipe);
      });
      dropdownMenu.appendChild(item);
    });
    dropdownMenu.style.display = "block";
  });
});

//change time format if over 60 min
function showTime() {
  document.querySelectorAll(".recipe-icons article p").forEach((duration) => {
    const text = duration.textContent;
    if (text.includes("min")) {
      const minutes = parseInt(text);
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        duration.textContent = `${hours} hour${
          hours > 1 ? "s" : ""
        } ${remainingMinutes} min.`;
      }
    }
  });
}

// Double serving function
let isDouble = false;
function toggleServings() {
  const servingsElement = document.getElementById("servings");
  const currentServings = parseInt(servingsElement.textContent);

  if (isDouble) {
    servingsElement.textContent = currentServings / 2;
    document.getElementById("double-servings").textContent = "Double Servings";

    document.querySelectorAll(".ingredient-amount").forEach((amountElement) => {
      const currentAmount = parseFloat(amountElement.textContent);
      if (!isNaN(currentAmount)) {
        amountElement.textContent = currentAmount / 2;
      }
    });
  } else {
    servingsElement.textContent = currentServings * 2;
    document.getElementById("double-servings").textContent = "Single Servings";

    document.querySelectorAll(".ingredient-amount").forEach((amountElement) => {
      const currentAmount = parseFloat(amountElement.textContent);
      if (!isNaN(currentAmount)) {
        amountElement.textContent = currentAmount * 2;
      }
    });
  }
  isDouble = !isDouble;
}

// unit-convert function
let isMetric = true;
function convertUnits() {
  const ingredientElements = document.querySelectorAll(".ingredient");
  ingredientElements.forEach((ingredient) => {
    const amountElement = ingredient.querySelector(".ingredient-amount");
    const unitElement = ingredient.querySelector(".ingredient-unit");

    let amount = parseFloat(amountElement.textContent);
    let unit = unitElement.textContent.trim();

    if (isMetric) {
      if (unit === "grams") {
        amount = (amount * 0.00220462).toFixed(2);
        unit = "pounds";
      }
    } else {
      if (unit === "pounds") {
        amount = (amount / 0.00220462).toFixed(2);
        unit = "grams";
      }
    }
    amountElement.textContent = amount;
    unitElement.textContent = unit;
  });
  isMetric = !isMetric;
  document.getElementById("convert-units").textContent = isMetric
    ? "Convert to Imperial"
    : "Convert to Metric";
}
