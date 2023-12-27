function test() {
  try {
    console.log("--- Testeando Dish ---");

    let dish = new Dish(
      "Cosido",
      "Cocido madrileño",
      ["Garbanzos", "Pollo", "Codillo", "Patata"],
      " "
    );

    dish.name = "Cocido";
    console.log(dish.name);

    console.log(dish.toString());

    let iterable = dish.ingredients; // Obtenemos el iterable de la lista.
    const iterator = iterable[Symbol.iterator](); // Obtenemos iterador de iterable;

    let obj = iterator.next();
    while (!obj.done) {
      // Iteramos con while
      let element = obj.value;
      console.log(element);
      obj = iterator.next();
    }
  } catch (error) {
    console.log(error.message);
  }

  try {
    console.log("--- Testeando Category ---");

    let category = new Category("Categoria", "Descripción de la categoría");

    console.log(category.toString());
  } catch (error) {
    console.log(error.message);
  }

  try {
    console.log("--- Testeando Allergen ---");

    let allergen = new Allergen("Alérgeno", "Descripción del alérgeno");

    console.log(allergen.toString());
  } catch (error) {
    console.log(error.message);
  }
}

test();
