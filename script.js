const apiKey = '53e81641d3264b599390409e59595600';

//Add & Remove Ingredients

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

//Recipe By Ingredients

async function getRecipes() {
    
    const inputs = document.querySelectorAll('.ingredient');
    const ingredients = Array.from(inputs).map(input => input.value.trim()).filter(value => value.length > 0);

    const inputString = ingredients.join(',');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${inputString}&number=2&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const recipeList = document.getElementById('recipeList');
            recipeList.innerHTML = '';

            if (data && data.length > 0) {
                for (const recipe of data) {
                    const recipeDiv = document.createElement('div');
                    recipeDiv.classList.add('recipe-item');

                    const title = document.createElement('h3');
                    const link = document.createElement('a');
                    link.href = `recipe.html?id=${recipe.id}`;
                    link.textContent = recipe.title;
                    title.appendChild(link);

                    const image = document.createElement('img');
                    image.src = recipe.image;
                    image.alt = recipe.title;
                    image.width = 400;

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

                    
                    recipeDiv.appendChild(title);
                    recipeDiv.appendChild(image);
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


//Recipe By Ingredients & Random Recipes Page: Recipe.HTML

async function fetchRecipeData() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const mealType = urlParams.get('mealType');
    
    let url;

    if (recipeId) {
        url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;   
    } else if (mealType) {
        url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&type=${mealType}`;
    } else {
        console.error('No recipe ID or meal type provided');
        return;
    }

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.recipes) {
            displayRecipe(data.recipes[0]);
            } else {
                displayRecipe(data);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
}  

//Display Page for both functions

function displayRecipe(recipe) {
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
}
    

// Function to toggle favorites

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

//Function to display recipes on favorites page

function displaySavedRecipes() {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const favoritesList = document.getElementById('favoritesList');

    if (savedRecipes.length > 0) {
        favoritesList.innerHTML = ''; 

        savedRecipes.forEach(recipe => {
            const listItem = document.createElement('li');

            listItem.innerHTML = `
                <h3>${recipe.title}</h3>
                <a href="recipe.html?id=${recipe.id}">
                    <img class="favpic" src="${recipe.image}" alt="${recipe.title}" width="300px" height="200px">
                </a>
            `;

            favoritesList.appendChild(listItem);
        });
    } else {
        favoritesList.innerHTML = '<li>No saved recipes found</li>';
    }
    
}

//Function to update like button

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







