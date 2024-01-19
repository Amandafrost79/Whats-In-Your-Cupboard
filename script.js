const apiKey = 'e8d16b2bccde4b5b85e8739327d12742';

//Functions to Add & Remove Ingredients

function addIngredient() {
    const container = document.getElementById('ingredientsContainer');
    const newIngredient = document.createElement('div');
    newIngredient.classList.add('ingredientInput');
    newIngredient.innerHTML = `
        <input type="text" class="ingredient">
        <button class="add" type="button" onclick="addIngredient()">+</button>
        <button class="remove" type="button" onclick="removeIngredient(this)">-</button>
    `;
    container.appendChild(newIngredient);
}

function removeIngredient(button) {
    const container = document.getElementById('ingredientsContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('At least one ingredient is required.');
    }
}

//Function to get Recipe By Ingredients

async function getRecipes() {
    
    const inputs = document.querySelectorAll('.ingredient');
    const ingredients = Array.from(inputs).map(input => input.value.trim()).filter(value => value.length > 0);

    const inputString = ingredients.join(',');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${inputString}&number=5&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const recipeList = document.getElementById('recipeList');

            recipeList.innerHTML = '';

            if (data && data.length > 0) {
                for (const recipe of data) {
                    const recipeDiv = document.createElement('div');
                    recipeDiv.classList.add('recipe-item');

                    const recipeLink = document.createElement('a');
                    recipeLink.href = `recipe.html?id=${recipe.id}`;

                    const title = document.createElement('h3');
                    title.textContent = recipe.title;

                    const image = document.createElement('img');
                    image.src = recipe.image;
                    image.alt = recipe.title;
                    image.width = 400;

                    recipeLink.appendChild(title);
                    recipeLink.appendChild(image);

                    let ingredientsText = '';
                    if (recipe.usedIngredients && recipe.usedIngredients.length > 0) {
                        ingredientsText = `Ingredients: ${recipe.usedIngredients.map(ingredient => ingredient.name).join(', ')}`;
                    } else {
                        ingredientsText = 'No ingredients available';
                    }

                    const usedIngredients = recipe.usedIngredients.map(ingredient => ingredient.name).join(', ');
                    const missedIngredients = recipe.missedIngredients.map(ingredient => ingredient.name).join(', ');

                    const ingredients = document.createElement('p');
                    ingredients.innerHTML = 
                    `<strong>Used Ingredients:</strong> ${usedIngredients}<br>
                    <strong>Missed Ingredients:</strong> ${missedIngredients || 'None'}<br>`;

                    recipeDiv.appendChild(recipeLink);
                    recipeDiv.appendChild(ingredients);
                    recipeList.appendChild(recipeDiv);
                }

            } else {
                recipeList.innerHTML = 'No recipes found.';
            }
            
        }
        catch (error) {
            console.error('Error fetching data:', error);
            const recipeList = document.getElementById('recipeList');
            recipeList.innerHTML = 'An error occurred while fetching data.';
        }
}

//Function to get Recipes by Ingredients & Random

async function fetchRecipeData() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const mealType = urlParams.get('mealType');
    
    let url;
    
    if (recipeId) {
        url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayRecipe(data, null, false); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
           
    } else if (mealType) {
        url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&include-tags=${mealType}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayRecipe(data.recipes[0], mealType, true); 
        } catch (error) {
            console.error('Error fetching new recipe:', error);
            
        }
    }
} 

//Shuffle Function for Random Recipes

async function shuffleRecipe(mealType) {
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1${mealType ? '&include-tags=' + mealType:''}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayRecipe(data.recipes[0], mealType, true);
    } catch (error) {
        console.error('Error fetching new recipe:', error);
    }
}

//Function to Display all Recipes Fetched

function displayRecipe(recipe, mealType, isRandom) {
    const recipeTitle = document.getElementById('recipeTitle');
    const recipeImage = document.getElementById('recipeImage');
    const ingredientList = document.getElementById('ingredientList');
    const instructions = document.getElementById('instructions');
    
    recipeTitle.innerHTML = `<h2>${recipe.title}</h2>`;

    recipeImage.innerHTML = `<img class="recipePic" src="${recipe.image}" alt="${recipe.title}" width="500px" height="300px">`;

    const ingredients = recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('');
    ingredientList.innerHTML = `<h3>Ingredients:</h3><ul>${ingredients}</ul>`;

    const recipeInstructions = recipe.instructions || 'No instructions available';
    instructions.innerHTML = `<h3>Instructions:</h3><p>${recipeInstructions}</p>`;

    localStorage.setItem('currentRecipe', JSON.stringify(recipe));

    updateLikeButton();

    let shuffleButton = document.getElementById('shuffleButton');

    if (!shuffleButton) {
        shuffleButton = document.createElement('button');
        shuffleButton.textContent = 'Try Again';
        shuffleButton.id = 'shuffleButton';
        shuffleButton,style.display = 'none';
        document.body.appendChild(shuffleButton);
    }

    shuffleButton.onclick = () => shuffleRecipe(mealType);
    shuffleButton.style.display = isRandom ? 'block' : 'none';
}

//Trivia Function

async function getFoodTrivia() {
    const triviaUrl = `https://api.spoonacular.com/food/trivia/random?apiKey=${apiKey}`;

    try {
        const response = await fetch(triviaUrl);
        const data = await response.json();
        document.getElementById('triviaDisplay').innerText = data.text;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to Toggle Favorites

function toggleFavorite() {
    const currentRecipe = JSON.parse(localStorage.getItem('currentRecipe'));
    if (!currentRecipe) {
        alert('No recipe is currently loaded.');
        return;
    }
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const recipeIndex = savedRecipes.findIndex(recipe => recipe.id === currentRecipe.id);
    const likeButton = document.querySelector('.like-button');


    if (recipeIndex === -1) {
    
        savedRecipes.push(currentRecipe);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        likeButton.innerHTML = `<span class="heart-icon">❤️</span> Liked`;
        alert('Recipe added to favorites!');

    } else {
        
        savedRecipes.splice(recipeIndex, 1);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        likeButton.innerHTML = `<span class="heart-icon">❤️</span> Like`;
        alert('Recipe removed from favorites!');
    }
}

//Function to Display Recipes on Favorites Page

function displaySavedRecipes() {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const favoritesList = document.getElementById('favoritesList');
    
    if (favoritesList && savedRecipes.length > 0) {
        favoritesList.innerHTML = ''; 

        savedRecipes.forEach(recipe => {
            const listItem = document.createElement('li');

            listItem.innerHTML = `
                <h2>${recipe.title}</h2>
                <a href="recipe.html?id=${recipe.id}">
                    <img class="favpic" src="${recipe.image}" alt="${recipe.title}" width="300px" height="200px">
                </a>
            `;
            
            favoritesList.appendChild(listItem);
        });
    } else {
        if (favoritesList) {
        favoritesList.innerHTML = '<li>No saved recipes found</li>';
        }
    }
}


//Function to Update Like Button

function updateLikeButton() {
    const currentRecipe = JSON.parse(localStorage.getItem('currentRecipe'));
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const likeButton = document.querySelector('.like-button');

    if (currentRecipe && savedRecipes.some(recipe => recipe.id === currentRecipe.id)) {
        likeButton.innerHTML = `<span class="heart-icon">❤️</span> Liked`;
    } else {
        likeButton.innerHTML = `<span class="heart-icon">❤️</span> Like`;
    }
}

window.onload = function() {
    fetchRecipeData();
    displaySavedRecipes();
};





