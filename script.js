
//Recipe By Ingredients

async function getRecipes() {
    const apiKey = '53e81641d3264b599390409e59595600';
    const input = document.getElementById('ingredientInput').value;
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${input}&number=2&apiKey=${apiKey}`;

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
            document.getElementById('ingredientInput').value = '';
        }
        catch (error) {
            console.error('Error fetching data:', error);
            const recipeList = document.getElementById('recipeList');
            recipeList.innerHTML = 'An error occurred while fetching data.';
        }
}


//Recipe By Ingredients Display Page Recipe.HTML

async function fetchRecipeData() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const apiKey = '53e81641d3264b599390409e59595600';
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            const recipeDetails = {
                id: data.id,
                title: data.title,
                image: data.image,
            };

            const storedRecipes = JSON.parse(localStorage.getItem('storedRecipes')) || [];

            const recipeIndex = storedRecipes.findIndex(recipe => recipe.id === recipeDetails.id);

            if (recipeIndex === -1) {
                
                storedRecipes.push(recipeDetails);
                localStorage.setItem('storedRecipes', JSON.stringify(storedRecipes));
            }

            const recipeTitle = document.getElementById('recipeTitle');
            const recipeImage = document.getElementById('recipeImage');
            const ingredientList = document.getElementById('ingredientList');
            const instructions = document.getElementById('instructions');
           

            recipeTitle.innerHTML = `<h2>${data.title}</h2>`;

            recipeImage.innerHTML = `<img src="${data.image}" alt="${data.title}" width="500px" height="300px">`;
            
            const ingredients = data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('');

            ingredientList.innerHTML = `<h2>Ingredients:</h2><ul>${ingredients}</ul>`;


            instructions.innerHTML = `<h2>Instructions:</h2><p>${data.instructions || 'No instructions available'}</p>`;

            
        } catch (error) {
            console.error('Error fetching data:', error);
            const recipeDetails = document.querySelector('.recipe-details');
            recipeDetails.innerHTML = 'An error occurred while fetching data.';
        }
    }

    fetchRecipeData();



//Random Recipe Generator

async function getRandomRecipe(mealType) {
    const apiKey = '53e81641d3264b599390409e59595600';
    let url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&type=${mealType}`;
    

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.recipes[0];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//Display Random Recipe

async function displayRandomRecipe(mealType) {
    const recipeDetails = document.getElementById('recipeDetails');
    const recipe = await getRandomRecipe(mealType);


    if (recipe) {
        const storedRecipes = JSON.parse(localStorage.getItem('storedRecipes')) || [];
        storedRecipes.push(recipe);
        localStorage.setItem('storedRecipes', JSON.stringify(storedRecipes));
        
        recipeDetails.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${mealType}" width="600px" height="300px">
            <div class="Ingredients">
                <h3>Ingredients:</h3>
                <ul>
                    ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
                </ul>
            </div>
            <p>Instructions: ${recipe.instructions}</p>
            
        `;
    }
}
        
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const mealType = params.get('mealType');

    if (mealType) {
        displayRandomRecipe(mealType);
    }
    
};


// Function to toggle favorites

function toggleFavorite(recipeId, button) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const recipeIndex = savedRecipes.findIndex(recipe => recipe.id === recipeId);

    if (recipeIndex === -1) {
    
        savedRecipes.push({ id: recipeId });
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        button.classList.add('liked');
        button.innerHTML = '<span class="heart-icon">❤️</span> Liked';
        alert('Recipe liked!');

    } else {
        
        savedRecipes.splice(recipeIndex, 1);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        button.classList.remove('liked');
        button.innerHTML = '<span class="heart-icon">❤️</span> Like';
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
                    <img src="${recipe.image}" alt="${recipe.title}" width="200px" height="150px">
                </a>
                <p>Recipe ID: ${recipe.id}</p>
            `;

            favoritesList.appendChild(listItem);
        });
    } else {
        favoritesList.innerHTML = '<li>No saved recipes found</li>';
    }
    
}
displaySavedRecipes()






