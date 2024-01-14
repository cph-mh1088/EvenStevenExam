// En higher-order function, der returnerer en funktion
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const multiplyByTwo = createMultiplier(2);

console.log(multiplyByTwo(5)); // Dette vil logge: 10

// En higher-order function, der accepterer en funktion som parameter
function executeFunction(callback) {
  callback();
}

function greet() {
  console.log("Hello World");
}

executeFunction(greet); // log: Hello World
