import {
  Dish,
  Category,
  Allergen,
  Menu,
  Restaurant,
  Coordinate,
} from "./objects.js";

import { RestaurantsManager } from "./restaurantsmanager.js";
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

  try {
    let rm = RestaurantsManager.getInstance();
    console.log(rm);

    let cat1 = new Category("Categoria 1");
    let cat2 = new Category("Categoria 2");
    let men1 = new Menu("Menu 1");
    let men2 = new Menu("Menu 2");
    let all1 = new Allergen("Allergen 1");
    let all2 = new Allergen("Allergen 2");
    let dish1 = new Dish("Lentejas con arroz");
    let dish2 = new Dish("Tortilla de patatas");
    let res1 = new Restaurant("Restaurant 1");
    let res2 = new Restaurant("Restaurant 2");

    rm.addCategory(cat1, cat2);
    rm.removeCategory(cat1);
    rm.addCategory(cat1);

    rm.addMenu(men1).addMenu(men2);
    rm.removeMenu(men1);

    rm.addAllergen(all1, all2);
    rm.removeAllergen(all2);

    rm.addDish(dish1, dish2);
    rm.removeDish(dish2);

    rm.addRestaurant(res1).addRestaurant(res2);
    rm.removeRestaurant(res1);

    rm.assignCategoryToDish(cat1, dish2, dish1);
    rm.assignCategoryToDish(cat2, dish2, dish1);

    console.log(rm);
  } catch (error) {
    console.log(error.message);
  }
}

test();
