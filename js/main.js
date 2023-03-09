$(document).ready(function(){
  
  let listOfIngredients = [];
  $('#cal').keyup(function(){
    this.value = this.value.replace(/[^0-9\.]/g,'');
  });
  $('#addDishForm').on('submit', function(e){
    $("input[type='checkbox']:checked").each(function(){
      listOfIngredients.push(this.checked ? $(this).val() : "");
    });
    let dish = {
      id: guidGen(),
      dishName: $('#dishName').val(),
      cal: $('#cal').val(),
      dishType: $("input[name='dishType']:checked").val(),
      ingredients: listOfIngredients,
      
      description: $('#description').val()
    }
    addDish(dish);
    
    e.preventDefault();
  });
  
});

// populate list of dishes
$(document).on('pagebeforeshow', '#mainPage', function(){
  getDishes();
});

$(document).on('pagebeforeshow', '#dish', function(){
  getDish();
});


// GuID generator
function guidGen(){
  let S4 = () =>{
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()+S4());
}

// store dish to local storage
function addDish(dish)
{
  if(localStorage.getItem('dishes') === null){
    let dishes = [];
    dishes.push(dish);
    localStorage.setItem('dishes', JSON.stringify(dishes));
  }
  else
  {
    let dishes = JSON.parse(localStorage.getItem('dishes'));
    dishes.push(dish);
    localStorage.setItem('dishes', JSON.stringify(dishes));
  }
  // clear form
  $("#addDishForm").trigger("reset"); 
  $.mobile.changePage('#mainPage');
}

// get dishes from local storage
function getDishes(){
  let data= '';
  if(localStorage.getItem('dishes') == null || localStorage.getItem('dishes') == ''){
    data = '<li>There are no dishes</li>';
    $('#dishes').html(data).listview('refresh');
  }
  else
  {
    let dishes = JSON.parse(localStorage.getItem('dishes'));
    $.each(dishes, function(index, dish){
      data += `
        <li data-role="list-divider">
          <li data-icon="delete">
            <a onclick="dishClicked('${dish.id}')">${dish.dishName}</a>
            <a onclick="deleteDish('${dish.id}')">${dish.dishName}</a>
          </li>
        </li><br>
      `;
      
     });
    $('#dishes').html(data).listview('refresh');
    
  }
}

function dishClicked(dishId)
{
  sessionStorage.setItem('dishId',dishId);
  $.mobile.changePage('#dish');
}

function getDish(){
  if(sessionStorage.getItem('dishId') === null)
  {
    $.mobile.changePage('#mainPage');
  }
  else
  {
    let dishes = JSON.parse(localStorage.getItem('dishes'));
    $.each(dishes, function(index, dish){
      if(dish.id === sessionStorage.getItem('dishId'))
      {
        let data = `
                   <h1>${dish.dishName}</h1>
                   <p><b>TYPE:</b> ${dish.dishType}<p>
                   <p><b>CALORIES:</b> ${dish.cal}<p>
                   <p><b>INGREDIENTS:</b> ${dish.ingredients}<p>
                   <p><b>DESCRIPTION:</b> ${dish.description}<p>
                   <br>
                   <button onclick="deleteDish('${dish.id}')" class="ui-btn">DELETE</button>
                 `;
                 $('#dishDetails').html(data);
      }
    });
  }
}

function deleteDish(dishId)
{
  let dishes = JSON.parse(localStorage.getItem('dishes'));
  
  $.each(dishes, function(index, dish)
  {
    if(dish.id === dishId)
    {
      dishes.splice(index, 1);
    }
  });
  localStorage.setItem('dishes', JSON.stringify(dishes));
  location.reload();
  $.mobile.changePage('#mainPage');
}

function deleteAll()
{
  localStorage.clear();
  location.reload();
  $.mobile.changePage('#mainPage');
}