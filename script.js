//Recipe By Ingredients

function getRecipes() {
    const apiKey = 'e8d16b2bccde4b5b85e8739327d12742';
    const input = document.getElementById('ingredientInput').value;
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${input}&number=2&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const recipeList = document.getElementById('recipeList');
            recipeList.innerHTML = '';

            if (data && data.length > 0) {
                data.forEach(recipe => {
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

                    const ingredients = document.createElement('p');
                    ingredients.textContent = `Ingredients: ${recipe.usedIngredients.map(ingredient => ingredient.name).join(', ')}`;

                    recipeDiv.appendChild(title);
                    recipeDiv.appendChild(image);
                    recipeDiv.appendChild(ingredients);
                    recipeList.appendChild(recipeDiv);
                });
            } else {
                recipeList.innerHTML = 'No recipes found.';
            }
            document.getElementById('ingredientInput').value = '';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const recipeList = document.getElementById('recipeList');
            recipeList.innerHTML = 'An error occurred while fetching data.';
        });
}


//Recipe By Ingredients Display Page Recipe.HTML

const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const apiKey = 'e8d16b2bccde4b5b85e8739327d12742';

    
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const ingredientList = document.getElementById('ingredientList');
            const instructions = document.getElementById('instructions');

            
            const ingredients = data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('');
            ingredientList.innerHTML = `<h2>Ingredients:</h2><ul>${ingredients}</ul>`;

            
            instructions.innerHTML = `<h2>Instructions:</h2><p>${data.instructions || 'No instructions available'}</p>`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const recipeDetails = document.querySelector('.recipe-details');
            recipeDetails.innerHTML = 'An error occurred while fetching data.';
        });



//Random Recipe Generator

async function getRandomRecipe(mealType) {
    const apiKey = 'e8d16b2bccde4b5b85e8739327d12742';
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&type=${mealType}`
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.recipes[0];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
        
async function displayRandomRecipe(mealType) {
    const recipeDetails = document.getElementById('recipeDetails');
    const recipe = await getRandomRecipe(mealType);
        
    if (recipe) {
        recipeDetails.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${mealType}" width="300px" height="300px">
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

