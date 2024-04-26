const buildListButton = document.querySelector('button');

buildListButton.addEventListener('click', function() {
  const list = document.querySelector('ol');
  

  let ingredientsElements = document.querySelectorAll('strong');
  let ingredients = Array.from(ingredientsElements).map(ingredient => ingredient.textContent);

  console.log(ingredients);

  ingredients.forEach(ingredient => {
    let listItem = document.createElement('li');
    //Checkbox
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    listItem.appendChild(checkbox);
    //Text
    listItem.appendChild(document.createTextNode(ingredient));

    checkboxListener(checkbox);
    list.appendChild(listItem);
  });

});

function checkboxListener(checkbox) {
  checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
      checkbox.parentElement.style.textDecoration = 'line-through';
    } else {
      checkbox.parentElement.style.textDecoration = 'none';
    }
  });
}