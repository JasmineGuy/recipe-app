

const mealsEl = document.getElementById('meals');
const faveContainer = document.getElementById('fave-container');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

getRandomMeal();
fetchFaveMeals();

async function getRandomMeal(){
  
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const resData = await res.json();
    const randomMeal = resData.meals[0];

    // console.log(randomMeal)

   addMeal(randomMeal, true);
    
};

async function getMealById(id){
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const resData = await res.json();
    const meal = resData.meals[0];

    return meal;

};

async function getMealsBySearch(term){
   const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term)

   const resData = await res.json();
   const meals = resData.meals
   
   
   return meals

};

 function addMeal(mealData, random = false){

    const meal = document.createElement('div');
    meal.classList.add('meal')
    meal.innerHTML =
    ` <div class="meal-header">
            ${random ? `<span class="random">Random Recipe</span>` : ""}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fave-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>`;
    

    const btn = meal.querySelector('.meal-body .fave-btn')
    btn.addEventListener('click', (e)=> {
       
        if(btn.classList.contains('active')) {
            removeMealFromLS(mealData.idMeal);
            btn.classList.remove('active')

        } else {
            addMealToLS(mealData.idMeal);
            btn.classList.add('active')
        }
            fetchFaveMeals();
        });
        meals.appendChild(meal);
}


function addMealToLS(mealId){
    const mealIds = getMealsFromLS();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealFromLS(mealId){
    const mealIds = getMealsFromLS();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));

}

function getMealsFromLS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'))

    return mealIds === null ? [] : mealIds;
}

 async function fetchFaveMeals(){
     //clean container before fetching
    faveContainer.innerHTML = "";

    const mealIds = getMealsFromLS();

    const meals = [];

    for (let i =0; i< mealIds.length; i++){
        const mealId = mealIds[i];

        let meal = await getMealById(mealId);

        addMealToFave(meal)
    }
};

function addMealToFave(mealData){

    const faveMeal = document.createElement('li');
    faveMeal.innerHTML =
    ` 
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class ="clear"><i class="far fa-window-close"></i></button>
    `;
    
    const btn = faveMeal.querySelector('.clear');
    btn.addEventListener('click', () => {
        removeMealFromLS(mealData.idMeal);

        fetchFaveMeals();
    })
    faveContainer.appendChild(faveMeal);
}


searchBtn.addEventListener('click', async () => {
    mealsEl.innerHTML = '';

    const query = searchTerm.value;
    
    const meals = await getMealsBySearch(query);

    if(meals){
        meals.forEach((meal) => {
            addMeal(meal);
        }) 
    }
})