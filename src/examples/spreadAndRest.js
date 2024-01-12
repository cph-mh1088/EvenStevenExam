// simple spread example
const arr = [1, 2, 3];
const arr2 = [...arr, 4, 5, 6];
console.log(arr2); // [1, 2, 3, 4, 5, 6]

// spread with objects
const obj = { name: "John", age: 30 };
const obj2 = { ...obj, city: "New York" };
console.log(obj2); // { name: 'John', age: 30, city: 'New York' }

// rest parameter example
const sum = (...args) => {
  return args.reduce((a, b) => a + b, 0);
};
console.log(sum(1, 2, 3, 4)); // 10
