function test() {
  try {
    console.log("--- Testeando Dish ---");

    let dish = new Dish("Cosido");

    dish.name = "Cocido";
    dish.description = "Cocido de Parla";
    dish.ingredients = ["Garbanzos", "Pollo", "Codillo", "Patata"];
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

    let category = new Category("Categoria");
    category.description = "Descripción de la categoría";

    console.log(category.toString());
  } catch (error) {
    console.log(error.message);
  }

  try {
    console.log("--- Testeando Allergen ---");

    let allergen = new Allergen("Alérgeno");
    allergen.description = "Descripción del alérgeno";

    console.log(allergen.toString());
  } catch (error) {
    console.log(error.message);
  }

  try {
    console.log("--- Testeando Menú ---");

    let menu = new Menu("Menú");
    menu.description = "Descripción del menú";

    console.log(menu.toString());
  } catch (error) {
    console.log(error.message);
  }

  try {
    console.log("--- Testeando Restaurant y Coordinate ---");
    let coords = new Coordinate(60, 90);
    let rest = new Restaurant(
      "Casa Pepe",
      "Restaurante familiar para bodas y eventos"
    );

    rest.location = coords;

    console.log("Coordenadas: " + coords.toString());
    console.log("Restaurante: " + rest.toString());
  } catch (error) {
    console.log(error.message);
  }
}

test();