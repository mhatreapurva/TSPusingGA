
sample_coords = [[280, 300], [408, 310], [301, 207], [120, 260], [140, 800], [170, 209], [450, 310], [370, 440], [600, 220], [480, 100], [180, 170], [800, 101], [500, 390], [600, 300], [150, 800], [750, 490], [210, 300], [550, 180], [240, 110], [220, 600]]
sample_coords_1 = [[400,800],[600,200],[200,600],[600,800],[400,200],[200,400],[800,600],[800,400]]
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

    for (let i=0; i < total_cities; i = i + 2 ){
        let cityA = population[route][i]
        let cityB = population[route][i+1]
        total_distance = total_distance + Math.sqrt(Math.pow((cities[cityB][0] - cities[cityA][0]), 2) + Math.pow((cities[cityB][1] - cities[cityA][1]), 2 ) );
    }

    testRoute = population[route]
    if (total_distance < recordDistance){
        recordDistance = total_distance;
        bestRoute = population[route];
    }
    return Math.round(total_distance);
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

function nextGeneration(){
    let new_population = []
    let j = []
    let parentA = []
    let parentB = []

    new_population.length = 0
    for (let i = 0; i < population_size;i++) {
        parentA = matingPoolSelection(population, fitness)
        parentB = matingPoolSelection(population, fitness)
        
        j = orderedCrossover(parentA, parentB)
        new_population[i] = swapMutate(j)
       
    }
    population = new_population.slice()
    calculateFitness()
}
    


function setup() {
    createCanvas(1000,900)
    background(255,251,247)

    cities.length = 0

    // cities = sample_coords_1
    total_cities = cities.length
    make_order()
    bestRoute = order
    testRoute = order
    generate_init_pop();
  
}

function show() {
    fill('red');
    noStroke()
    circle(cities[0][0], cities[0][1], 10);

    fill(255);
    stroke(0)
    circle(cities[0][0], cities[0][1], 13);
    
    for(let i = 1; i < total_cities; i++){
        fill(0)
        noStroke()
        circle(cities[i][0], cities[i][1], 6);
    }
    
    for(let i = 0; i < total_cities; i++){
        stroke(221,8,69);    
        strokeWeight(2);
        line(cities[bestRoute[i]][0],cities[bestRoute[i]][1],cities[bestRoute[i+1]][0],cities[bestRoute[i+1]][1]);
    }

    for(let i = 0; i < total_cities; i++){
        stroke(216,216,216);    
        strokeWeight(1);
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
    if(cities.indexOf(x) === -1)
    {cities.push([x[0],x[1]])
    total_cities = cities.length
    console.log(cities)}
}


function draw() {
    
    population_size = document.getElementById('population_size').value;
    mutation_rate = document.getElementById('mutation_rate').value;

    if(addCity == true){
        
       
        if(mouseIsPressed && pmouseX > 0 && pmouseY > 0){
           x = [pmouseX, pmouseY] 
            
        }
        if(x.length > 0)
       { addToCity(x)              
        make_order()
        testRoute = order
        bestRoute = order
        clear()
        show()
        x.length = 0
        }
            
    }
    
  
    if(start_sim === true && population_size > 0 && mutation_rate > 0){
        clear()  
        show()
        if(initialize == true){
            generate_init_pop()
            initialize = false
        }
        nextGeneration();
        console.log(recordDistance)
    } 
}



function Toggle_btn() {
    if(start_sim === true)
    {
        start_sim = false;
        document.getElementById('sim_btn').innerHTML = "Start Sim"
    }
    else{
        start_sim = true;
        document.getElementById('sim_btn').innerHTML = "Stop Sim"
    }
}

function AddCity_btn() {
    if(addCity === true)
    {
        addCity = false;
        document.getElementById('add_city_btn').innerHTML = "EDIT"   }
    else{
        addCity = true;
        document.getElementById('add_city_btn').innerHTML = "ADD CITY"
    }
}

function Reset_btn() {
    cities.length = 0
    clear()
    initialize = true

}


    
    