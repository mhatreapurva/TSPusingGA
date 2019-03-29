import random
import math 

sample_coords = [[28, 30], [48, 31], [31, 27], [12, 26], [14, 8], [17, 29], [45, 31], [37, 44], [6, 22], [48, 1], [18, 17], [8, 11], [5, 39], [6, 30], [0, 8], [9, 49], [21, 30], [0, 18], [24, 11], [22, 6]]
cities = []

total_cities = 0

order = []
population = []
fitness = []

random_city_counter = 25
population_size = 0
gen_count = 0
mutationRate = 0.0

recordDistance = math.inf
bestRoute = []


def random_city_generator(no_of_cities):
    global total_cities
    cities.clear()
    for i in range(no_of_cities):
        x = random.randint(0,50)
        y = random.randint(0,50)
        coords = [x , y]
        cities.append(coords)
    
    print(cities)


def swap(a , b, arr):
    temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp

def swapMutate(arr, rate):

    r = random.random()
    if r < rate:
        cityA = random.randint(1, total_cities-1)    
        cityB = random.randint(1, total_cities-1)
        swap(cityA,cityB,arr)

def shuffle(arr, rate):

    for i in range(rate):
        cityA = random.randint(1, total_cities-1)    
        cityB = random.randint(1, total_cities-1)
        swap(cityA,cityB,arr)


def generate_init_pop(pop_size, init_order):

    for i in range(pop_size):
        population.append(init_order[:])
        shuffle(population[i], 10)

  
    calculateFitness()



def calculateFitness():
    fitness.clear()

    for i in population:
        s = 1 / calculateDistance(i)
        fitness.append(s)
        
    normalizeFitnes()
    #print(bestRoute, "::Distance:", recordDistance )


def normalizeFitnes():
    total_fitness = 0

    for i in fitness:
        total_fitness += i 

    for i in range(len(fitness)):
        fitness[i] = fitness[i] / total_fitness  
        

  

def calculateDistance(route):
    total_distance = 0
    global recordDistance
    global bestRoute 

    for i in range(total_cities):
        cityA = route[i]
        cityB = route[i+1]

        total_distance = total_distance + math.sqrt( ((cities[cityB][0] - cities[cityA][0]) ** 2) + ((cities[cityB][1] - cities[cityA][1]) ** 2 ) )

    if (total_distance < recordDistance):
            recordDistance = total_distance
            bestRoute = route

    
    return total_distance


def orderedCrossover(a,b):
    start = random.randint(1, total_cities-1)    
    end =   random.randint(1, total_cities-1)
    new = []
    new.append(a[0])
    new.extend(a[start:end]) 
    for i in b:
        if new.count(i) == 0:
            new.append(i)
    new.append(new[0])
    return new

def nextGeneration():
    new_population = []
    j = []
    parentA = []
    parentB = []
    global population

    for i in population: 
        parentA = matingPoolSelection(population, fitness)
        parentB = matingPoolSelection(population, fitness)
        j = orderedCrossover(parentA, parentB)
        swapMutate(j, mutationRate)
        new_population.append(j)

    population = new_population[:]

    calculateFitness()


def matingPoolSelection(arr, probability):
    index = 0
    r = random.random()

    while( r > 0):
        r = r - probability[index]
        index += 1 
    
    index -= 1

    return arr[index]


def GeneticAlgorithm(popSize, genCount, mutationRate, city_db):

    #random_city_generator(random_city_counter)
    global cities
    global total_cities 

    cities.clear()
    cities = city_db[:]
    
    for ind, coords in enumerate(cities): 
        order.append(ind)
    order.append(order[0])

    total_cities = len(cities)

    gen_count = genCount
    mutation_rate = mutationRate
    population_size = popSize


    generate_init_pop(population_size, order)


    for i in range(gen_count):
        print(bestRoute, "Distance:", recordDistance)
        nextGeneration()

    

GeneticAlgorithm(500,1000,0.05,sample_coords)



