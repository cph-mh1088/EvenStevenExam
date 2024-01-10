// tager en funktion som argument bestående af resolve og reject
let p = new Promise((resolve, reject) => {
  let a = 1 + 2;

  if (a == 2) {
    resolve("Success");
  } else {
    reject("Fejl");
  }
});

// brug af promise

// resolve
p.then((message) => {
  console.log("This is in the then " + message);
})
  // reject
  .catch((message) => {
    console.log("This is in the catch " + message);
  });
