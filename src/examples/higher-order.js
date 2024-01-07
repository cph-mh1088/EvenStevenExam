// En higher-order function, der returnerer en funktion
function createMultiplier(factor) {
  // Returner en funktion, der multiplicerer et tal med det givne faktor
  return function (number) {
    return number * factor;
  };
}

const multiplyByTwo = createMultiplier(2);

console.log(multiplyByTwo(5)); // Dette vil logge: 10

// En higher-order function, der accepterer en funktion som parameter
function executeFunction(callback) {
  // Udfør den modtagne funktion
  callback();
}

// En simpel funktion, som vi kan bruge som argument
function greet() {
  console.log("Hello World");
}

// Anvend higher-order function til at udføre funktionen
executeFunction(greet); // Dette vil logge: Hej verden!
