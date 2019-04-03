cities = []

var total_cities = 0

var order = []
var population = []
var fitness = []

var population_size = 0
var gen_count = 0
var mutation_rate = 0.0

var recordDistance = Infinity
var bestRoute = []

var testRoute = []

var start_sim = false
var initialize = true
var addCity = false

var x = []
var graphBR = []

function swapp (a,b, arr) {
   
    let temp = 0
    temp = order[a]
    order[a] = order[b]
    order[b] = temp

}

function sshuffle(array){
    for(let i = 0; i < 10; i++){

        max = total_cities
        min = 1
        cityA = Math.floor(Math.random() * (max - min)) + min;    
        cityB = Math.floor(Math.random() * (max - min)) + min;    
        swapp(cityA,cityB, array)
    } 
      
}


function normalizeFitness(){
    var total_fitness = 0

    for(let i=0; i < population_size; i++){
        total_fitness = total_fitness + fitness[i]
    }

    for( let i=0; i < population_size; i++){
        fitness[i] = fitness[i] / total_fitness;
    }
}


function calculateFitness(){

    fitness.length = 0;
    for( let k=0; k < population_size; k++){
        fitness[k] = 1 / calculateDistance(k);
    }   
    normalizeFitness()


}

function generate_init_pop(){
    for (let i=0; i < population_size; i++){
        population[i] = order.slice()
        sshuffle(population[i])
    }
    calculateFitness()
}

function calculateDistance(route){

    var total_distance = 0

    for (let i=0; i < total_cities; i++ ){
        let cityA = population[route][i]
        let cityB = population[route][i+1]
        total_distance = total_distance + Math.sqrt(Math.pow((cities[cityB][0] - cities[cityA][0]), 2) + Math.pow((cities[cityB][1] - cities[cityA][1]), 2 ) );
    }

    testRoute = population[route]

    if (total_distance < recordDistance){
        recordDistance = total_distance;
        graphBR.push(recordDistance)
        bestRoute = population[route];
    }
    return (total_distance);
}

function matingPoolSelection(arr, probability){
    var index = 0;
    var r = Math.random();

    while( r > 0){
        r = r - probability[index];
        index += 1 ;
    }    
    index -= 1;
    return arr[index]
}

function swapMutate (arr) {
    var r = Math.random()
    if (r < mutation_rate){
        let cityA = Math.floor(Math.random() * (total_cities-1)+1);   
        let cityB = Math.floor(Math.random() * (total_cities-1)+1); 

        let temp = arr[cityA]
        arr[cityA] = arr[cityB]
        arr[cityB] = temp
    }    
    return arr;  
}

function orderedCrossover(a,b){
    let start = Math.floor((Math.random() * (total_cities) + 1));  
    let end =   Math.floor((Math.random() * (total_cities) + 1)); 

    let breed = []

    breed[0]=(a[0])
    breed.concat(a.slice(start,end)) 

    for(let i = 0; i < b.length; i++){
        if(breed.indexOf(b[i]) === -1){
            breed.push(b[i]);
        }
    }
    breed.push(breed[0])
   
    return breed
}

function orderedCrossover2(a,b){
    let cutoff = Math.floor((Math.random() * (total_cities) + 1));  

    let breed = []

    breed.concat(a.slice(0,cutoff)) 

    for(let i = 0; i < b.length; i++){
        if(breed.indexOf(b[i]) === -1){
            breed.push(b[i]);
        }
    }
    breed.push(breed[0])
   
    return breed
}

function nextGeneration(){
    let new_population = []
    let j = []
    let parentA = []
    let parentB = []

    new_population.length = 0
    for (let i = 0; i < population_size;i++) {
        parentA = matingPoolSelection(population, fitness)
        parentB = matingPoolSelection(population, fitness)
        
        j = orderedCrossover2(parentA, parentB)
        new_population[i] = swapMutate(j)
       
    }
    population = new_population.slice()
    calculateFitness()
}
    


function setup() {
    let can = createCanvas(1000,800)
    can.parent('city_map');    
        cities.length = 0
}

function show() {
    fill(255);
    stroke(0)
    circle(cities[0][0], cities[0][1], 13);
    fill(10)
    text('STARTING CITY',cities[0][0]+10, cities[0][1]+10)
    
    noStroke()
    for(let i = 0; i < total_cities; i++){
        fill(0)
        circle(cities[i][0], cities[i][1], 6);
        fill(10)
        if(i != 0)
        {text('City '+i,cities[i][0]+8, cities[i][1]+8)}
    }
    
    stroke(221,8,69);    
    strokeWeight(2);
    if(bestRoute.length>0)
    {for(let i = 0; i < total_cities; i++){
        line(cities[bestRoute[i]][0],cities[bestRoute[i]][1],cities[bestRoute[i+1]][0],cities[bestRoute[i+1]][1]);
    }}

    stroke(216,216,216);    
    strokeWeight(1);
    for(let i = 0; i < total_cities; i++){
        line(cities[testRoute[i]][0],cities[testRoute[i]][1],cities[testRoute[i+1]][0],cities[testRoute[i+1]][1]);
    }
}

function make_order(){
    order.length = 0
    for (i = 0 ; i < total_cities;i++ ){
        order.push(i)
    }
    order.push(0);
}

function addToCity(x){
    cities.push([x[0],x[1]])
    total_cities = cities.length
    make_order()
    console.log("City Added:", cities[total_cities-1])
    testRoute = order
    bestRoute = order
    
}

function init_ui(){
    if(cities.length == 0 ){
        document.getElementById ('sim_btn').style.display = "none";
        document.getElementById('input_params').style.display = "none"
        document.getElementById('rem_city_btn').style.display = "none"
    }
}

function draw() {

    init_ui()

    if(addCity == true){
        document.getElementById('rem_city_btn').style.display = "block"
        if(mouseIsPressed && pmouseX > 0 && pmouseY > 0){
           x = [pmouseX, pmouseY] 
            
        }
        if(x.length > 0)
       { addToCity(x)              
        
        clear()
        show()
        x.length = 0
        }       
    }
    if(document.getElementById('population_size').value > 0 && document.getElementById('mutation_rate').value > 0 && addCity === false && document.getElementById('mutation_rate').value < 1 ){
        document.getElementById('sim_btn').style.display = "block"
    }
    else{
        document.getElementById('sim_btn').style.display = "none"
    }
  
    if(start_sim === true){
        population_size = document.getElementById('population_size').value;
        mutation_rate = document.getElementById('mutation_rate').value;
        clear()  
        show()
        if(initialize == true){
            generate_init_pop()
            initialize = false
        }
        nextGeneration();
        console.log(recordDistance)
        document.getElementById('distance_out').innerHTML = "Distance: "+Math.round(recordDistance)
    } 
}



function Toggle_btn() {
    if(start_sim === true)
    {
        start_sim = false;
        document.getElementById('sim_btn').innerHTML = "EVOLVE"
        document.getElementById('add_city_btn').style.display = "block"
        document.getElementById('population_size').disabled = false;
        document.getElementById('mutation_rate').disabled = false;
        document.getElementById('sim_btn').style.background =  "linear-gradient(to right, #3297e5, #0e4b8c )"
    }
    else{
        start_sim = true;
        initialize = true;
        recordDistance = Infinity
        document.getElementById('sim_btn').innerHTML = "STOP"
        document.getElementById('population_size').disabled = true;
        document.getElementById('mutation_rate').disabled = true;
        document.getElementById('add_city_btn').style.display = "none"
        document.getElementById('sim_btn').style.background =  "linear-gradient(to right, #e53280, #8c0e57 )"
        
    }
}

function AddCity_btn() {
    if(addCity === true)
    {
        addCity = false;
        document.getElementById('add_city_btn').innerHTML = "DRAW MODE"
        document.getElementById('add_city_btn').style.background = "white"
        document.getElementById('add_city_btn').style.color = "black"
        //document.getElementById ('sim_btn').style.display = "block";
        document.getElementById('distance_out').style.display = "block"
        document.getElementById('input_params').style.display = "block"
        document.getElementById('rem_city_btn').style.display = "none"
         }
    else{
        addCity = true;
        document.getElementById('add_city_btn').innerHTML = "EXIT DRAW"
        document.getElementById('add_city_btn').style.background = "red"
        document.getElementById('add_city_btn').style.color = "white"
        document.getElementById ('sim_btn').style.display = "none";
        document.getElementById('distance_out').style.display = "none"
        document.getElementById('input_params').style.display = "none"
        document.getElementById('rem_city_btn').style.display = "block"
    }
}

function Reset_btn() {
    cities.length = 0
    recordDistance = Infinity
    bestRoute.length = 0
    graphBR.length = 0

 population_size = 0

 mutation_rate = 0.0
    clear()
    initialize = true
    document.getElementById('population_size').value = "";
    document.getElementById('mutation_rate').value = "";
    document.getElementById('distance_out').innerHTML = "Distance: "

}

function removeCity_btn(){
    cities.pop()
    total_cities = cities.length
    make_order()
    testRoute = order
    bestRoute = order

}

function showSolve(){
    
}


    
    