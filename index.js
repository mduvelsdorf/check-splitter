//declaring all global variables

var subtotal, total, percent, pay, tip, guests, split, guestsByItem, additional;
var dynamicGuests = [];
var itemArray = [];
var priceArray = [];
var guestArray = [];
var pricePerGuest = [];
var itemPerGuest = [];
var totalPerGuest = [];
var addlPerGuest = [];
var chartData = [];
var guestSum = 0;
var guestItem = '';

//tooltip for headers: subtotal, tip percent, and total

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({trigger: "hover", placement: "right"});
});

//function to unhide HTML output

function unhide() {
  document.getElementById("hide").style.display = 'block';
}

function hideAll() {
  document.getElementById("hide").style.display = 'none';
  document.getElementById("getGuests").style.display = 'none';
  document.getElementById("getItems").style.display = 'none';
  document.getElementById("splitHide").style.display = 'none';
  document.getElementById("perPerson").style.display = 'none';
  document.getElementById("requestMoney").style.display = 'none';
}

//function used later to output HTML - tip and total after tip

function displayTip() {
  unhide();
  document.getElementById('tip').innerHTML = "Tip: $" + tip.toFixed(2);
  document.getElementById('pay').innerHTML = 
"Total After Tip: $" + pay.toFixed(2);
}

//function used to assign variables based on HTML input from user

function getValues() {
  subtotal = parseFloat(document.getElementById('subtotal').value);
  percent = parseFloat(document.getElementById('percent').value);
  total = parseFloat(document.getElementById('total').value);
}

//function to throw error if there is no user input or total is less than subtotal

function checkInput() {
  getValues();
  if (isNaN(subtotal) == true || subtotal < 0 || isNaN(total) == true || isNaN(percent) == true || percent < 0) {
    $("#missingValues").html("<strong>Warning:</strong> Fill in missing values and correct any negative numbers").fadeIn().delay(1500).fadeOut();
    throw new Error("Need user input");
  }
  else if (subtotal > total) {
    $("#fixSubtotal").html("<strong>Warning:</strong> Subtotal cannot be larger than Total").fadeIn().delay(1500).fadeOut();
    throw new Error("Subtotal greater than total");
  }
}

//Prevent runtime error

function tooManyGuests() {
    $("#excessiveGuests").html("<strong>Warning:</strong> Too many guests. Limit 10 guests.").fadeIn().delay(1500).fadeOut();
    throw new Error("Too many guests");
}

//function - pulls variables, calculates, output to HTML

function calculateTip() {
  tip = subtotal * percent / 100;
  pay = tip + total;
}

//function to display basic calculate

function calculateBasic() {
  checkInput();
  hideAll();
  calculateTip();
  displayTip();
}

//function used later to output HTML - check split evenly total per person

function displaySplitEven() {
  document.getElementById("perPerson").innerHTML = "Each Person Pays: $" + split.toFixed(2);
  document.getElementById("perPerson").style.display = 'block';
  document.getElementById("requestMoney").style.display = 'block';
}

//function - uses calculateTip function, pulls guest variables from user input, calculates, output to HTML

function calculateEven() {
  checkInput();
  guests = parseInt(document.getElementById("guests").value);
  if (guests < 11) {
  calculateTip();
  displayTip();
  split = pay / guests;
  displaySplitEven();
  }
  else {
    tooManyGuests();
  }
}

//displays user input options on button click - Split Evenly

function displayGuests() {
  checkInput();
  hideAll();
  document.getElementById('getGuests').style.display='block';
}

//displays user input options on button click - Split by Item

function displayItems() {
  checkInput();
  hideAll();
  document.getElementById('getItems').style.display='block';
}

//function - creates dynamic variables for each person (split by item)

function createGuests() {
  document.getElementById('guestDropdown').innerHTML = '';
  dynamicGuests = [];
  guestsByItem = parseInt(document.getElementById('guestsByItem').value);
  if (guestsByItem < 11) {
    for (var i = 1; i < guestsByItem + 1; i++) {
  dynamicGuests.push("guest" + i);
    var option = document.createElement('option')
    option.text = "Guest " + i;
    option.value = "guest" + i;
  document.getElementById('guestDropdown').appendChild(option);
  }
  document.getElementById('splitHide').style.display='block';
  }
  else {
    tooManyGuests();
  }
}

//connected to add new item button - creates row to input a new item

function addNewItem() {
  if ($(".duplicate").length === 0) {
  $("#itemInput").clone().find("input").val("").end().attr("class","duplicate").insertAfter("#itemInput"); 
  }
  else {
  $(".duplicate:last").after($("#itemInput").clone().find("input").val("").end().attr("class","duplicate"));
  }
}

//removes last row of items - never removes original(first) row

function removeItem() {
  $(".duplicate").last(".duplicate").remove();
}

//function to create arrays from split by item user input (elements by name)

function getSplitItems() {
  itemArray = [];
  priceArray = [];
  guestArray = [];
  var x = document.getElementsByName("description");
  var y = document.getElementsByName("price");
  var z = document.getElementsByName("guestId");
  for (var i = 0; i < x.length; i++) {
  itemArray.push(x[i].value);
  priceArray.push(y[i].value);
  guestArray.push(z[i].value);
}
}

//function to total item prices for each guest and push into array

function getGuestPrices() {
  pricePerGuest = [];
  for (var i = 0; i < dynamicGuests.length; i++) {
  guestSum = 0;
  for (var j = 0; j < guestArray.length; j++) {
    if (dynamicGuests[i] == guestArray[j]) {
      guestSum += parseFloat(priceArray[j]);
    };
  }; 
  pricePerGuest.push(guestSum);
}
}

//function to push guest items with price into array

function getGuestItems() {
  itemsPerGuest = [];
  for (var i = 0; i < dynamicGuests.length; i++) {
  guestItem = '';
  for (var j = 0; j < guestArray.length; j++) {
    if (dynamicGuests[i] == guestArray[j]) {
      guestItem += (itemArray[j] + ": $" + parseFloat(priceArray[j]).toFixed(2) + "<br>");
    };
  }; 
  itemsPerGuest.push(guestItem);
}
}

//function to check subtotal by item against subtotal, throws error if not equal

function checkSubtotal() {
  var subtotalByItem = 0;
  for (var i = 0; i < pricePerGuest.length; i++) {
    subtotalByItem += parseFloat(pricePerGuest[i]);
  }
  if (subtotalByItem == parseFloat(window.subtotal)) {
    calculateTip();
  }
  else {
    $("#unequal").html("<strong>Warning:</strong> Prices per guest do not equal subtotal.").fadeIn().delay(1500).fadeOut();
    throw new Error("Unequal subtotal and price per guest");
  }
}

//function to calculate total including tax and tip for each guest, push into array

function getGuestTotals() {
  addlPerGuest = [];
  totalPerGuest = [];
  chartData = [];
  chartData.push(["Guest", "Total"]);
  for (var i = 0; i < pricePerGuest.length; i++) {
    var guestData = [];
    var guestTotal = 0;
    additional = 0;
    additional = pricePerGuest[i] * (pay - subtotal) / subtotal;
    addlPerGuest.push(parseFloat(additional).toFixed(2));
    guestTotal = parseFloat(additional) + parseFloat(pricePerGuest[i]);
    totalPerGuest.push(guestTotal);
    guestData.push("Guest " + (i + 1));
    guestData.push(guestTotal);
    chartData.push(guestData);
  }
}

//function to display totals per guest

function outputTotals() {
  document.getElementById("perPerson").innerHTML = '';
  displayTip();
  for (var i = 0; i < totalPerGuest.length; i++) {
    var title = '';
    title = itemsPerGuest[i] + "Tax and Tip: " + addlPerGuest[i];
    document.getElementById("perPerson").innerHTML += "<div>Guest " + (i + 1) + " owes <a href='#' data-toggle='tooltip' data-html='true' title='" + title + "'>$" + parseFloat(totalPerGuest[i]).toFixed(2) + "</a></div>";
  }
  $('[data-toggle="tooltip"]').tooltip({trigger: "hover", placement: "right"});
  document.getElementById("perPerson").style.display = 'block';
  document.getElementById("requestMoney").style.display = 'block';
}

//google chart - guest totals displayed in pie chart

function drawChart() {
  var data = google.visualization.arrayToDataTable(chartData);
  var options = {'title':'Guest Total Breakdown', 'backgroundColor':'transparent', 'fontName':'Montserrat', 'fontSize':11, 'allowHtml': true, 'is3D': true};
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  var formatter = new google.visualization.NumberFormat(
    {prefix: '$'});
  formatter.format(data, 1);
  chart.draw(data, options);
}

//calculates split by item using above functions

function calculateItemSplit() {
  getSplitItems();
  getGuestPrices();
  getGuestItems();
  checkSubtotal();
  getGuestTotals();
  unhide();
  drawChart();
  outputTotals();
}