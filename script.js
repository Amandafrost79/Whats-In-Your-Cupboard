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
                    image.width = 200;

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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const recipeList = document.getElementById('recipeList');
            recipeList.innerHTML = 'An error occurred while fetching data.';
        });
}