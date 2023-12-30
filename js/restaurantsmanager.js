import {
  BaseException,
  EmptyValueException,
  InvalidValueException,
} from "./exceptions.js";

import {
  Dish,
  Category,
  Allergen,
  Menu,
  Restaurant,
  Coordinate,
} from "./objects.js";

// Excepción que heredad de Base para crear excepciones propias del Manager de Restaurantes
class ManagerException extends BaseException {
  constructor(message = "Error: Manager Exception.", fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = "ManagerException";
  }
}

// Excepción que se da cuando un objeto no es una instancia de la solicitada
class ObjecManagerException extends ManagerException {
  constructor(param, className, fileName, lineNumber) {
    super(`Error: The ${param} is not a ${className}`, fileName, lineNumber);
    this.param = param;
    this.param = className;
    this.name = "ObjecManagerException";
  }
}

// Excepción que se da cuando una categoría ya existe
class ObjectExistsException extends ManagerException {
  constructor(object, fileName, lineNumber) {
    super(
      `Error: The ${object.name} already exists in the manager.`,
      fileName,
      lineNumber
    );
    this.object = object;
    this.name = "ObjectExistsException";
  }
}

// Excepción que se da cuando una objeto no existe
class ObjectNotExistException extends ManagerException {
  constructor(object, fileName, lineNumber) {
    super(
      `Error: The ${object.name} doesn't exist in the manager.`,
      fileName,
      lineNumber
    );
    this.object = object;
    this.name = "objectNotExistException";
  }
}

// Excepción que se da cuando un plato ya está asignado
class DishExistException extends ManagerException {
  constructor(dish, category, fileName, lineNumber) {
    super(
      `Error: The ${dish.name} already exist in ${category.name}.`,
      fileName,
      lineNumber
    );
    this.category = category;
    this.dish = dish;
    this.name = "DishExistException";
  }
}

// Excepción que se da cuando un plato no existe
class DishNotExistException extends ManagerException {
  constructor(dish, category, fileName, lineNumber) {
    super(
      `Error: The ${dish.name} doesn't exist in ${category.name}.`,
      fileName,
      lineNumber
    );
    this.category = category;
    this.dish = dish;
    this.name = "DishNotExistException";
  }
}
// Patrón Singleton para el objeto de manager de restaurantes
const RestaurantsManager = (function () {
  let instantiated;

  class RestaurantsManager {
    // Propiedades privadas
    #name;
    #categories = [];
    #allergens = [];
    #dishes = [];
    #menus = [];
    #restaurants = [];

    #objectsConstructors = {
      Dish,
      Menu,
      Allergen,
      Category,
      Restaurant,
    };

    // Función interna que permite obtener la posición de una categoría
    #getCategoryPosition(category) {
      return this.#categories.findIndex(
        (x) => x.category.name === category.name
      );
    }

    // Función interna que permite obtener la posición de un menú
    #getMenuPosition(menu) {
      return this.#menus.findIndex((x) => x.menu.name === menu.name);
    }

    // Función interna que permite obtener la posición de un alérgeno
    #getAllergenPosition(allergen) {
      return this.#allergens.findIndex(
        (x) => x.allergen.name === allergen.name
      );
    }

    // Función interna que permite obtener la posición de un plato
    #getDishPosition(dish) {
      return this.#dishes.findIndex((x) => x.dish.name === dish.name);
    }

    // Función interna que permite obtener la posición de un restaurante
    #getRestaurantPosition(restaurant) {
      return this.#restaurants.findIndex(
        (x) => x.restaurant.name === restaurant.name
      );
    }

    // Función interna que permite obtener la posición de un plato en una categoría determinada
    #getDishPositionInCategory(dish, category) {
      return category.dishes.findIndex((x) => x.dish.name === dish.name);
    }

    // Función interna que permite obtener la posición de un plato en un alérgeno determinado
    #getDishPositionInAllergen(dish, allergen) {
      return allergen.dishes.findIndex((x) => x.dish.name === dish.name);
    }

    // Función interna que permite obtener la posición de un plato en un menú determinado
    #getDishPositionInMenu(dish, menu) {
      return menu.dishes.findIndex((x) => x.dish.name === dish.name);
    }

    // Función interna que permite el ordenado de categorías por nombre
    #sortCategoriesFunc = (catA, catB) =>
      catA.category.name.toLocaleLowerCase() <
      catB.category.name.toLocaleLowerCase()
        ? -1
        : 1;

    // Función interna que permite el ordenado de categorías por nombre
    #sortMenusFunc = (catA, catB) =>
      catA.menu.name.toLocaleLowerCase() < catB.menu.name.toLocaleLowerCase()
        ? -1
        : 1;

    // Función interna que permite el ordenado de alérgenos por nombre
    #sortAllergensFunc = (catA, catB) =>
      catA.allergen.name.toLocaleLowerCase() <
      catB.allergen.name.toLocaleLowerCase()
        ? -1
        : 1;

    // Función interna que permite el ordenado de alérgenos por nombre
    #sortDishesFunc = (catA, catB) =>
      catA.dish.name.toLocaleLowerCase() < catB.dish.name.toLocaleLowerCase()
        ? -1
        : 1;

    // Función interna que permite el ordenado de restaurantes por nombre
    #sortRestaurantsFunc = (catA, catB) =>
      catA.restaurant.name.toLocaleLowerCase() <
      catB.restaurant.name.toLocaleLowerCase()
        ? -1
        : 1;

    constructor(name = "Manager de Restaurantes") {
      this.#name = name;

      Object.defineProperty(this, "restaurants", {
        enumerable: true,
        get() {
          const array = this.#restaurants;
          return {
            *[Symbol.iterator]() {
              for (const restaurant of array) {
                yield restaurant;
              }
            },
          };
        },
      });
      Object.defineProperty(this, "categories", {
        enumerable: true,
        get() {
          const array = this.#categories;
          return {
            *[Symbol.iterator]() {
              for (const category of array) {
                yield category;
              }
            },
          };
        },
      });
      Object.defineProperty(this, "allergens", {
        enumerable: true,
        get() {
          const array = this.#allergens;
          return {
            *[Symbol.iterator]() {
              for (const allergen of array) {
                yield allergen;
              }
            },
          };
        },
      });
      Object.defineProperty(this, "menus", {
        enumerable: true,
        get() {
          const array = this.#menus;
          return {
            *[Symbol.iterator]() {
              for (const menu of array) {
                yield menu;
              }
            },
          };
        },
      });
    }

    // Permite añadir una o más categorías siempre y cuando sean una instancia de Category
    addCategory(...categories) {
      for (const category of categories) {
        if (!(category instanceof Category)) {
          throw new ObjecManagerException("category", "Category");
        }
        const position = this.#getCategoryPosition(category);
        if (position === -1) {
          this.#categories.push({
            category,
            dishes: [],
          });
          this.#categories.sort(this.#sortCategoriesFunc);
        } else {
          throw new ObjectExistsException(category);
        }
      }
      return this;
    }

    // Permite eliminar una o más categorías, siempre que sea una instancia de Category y esté registrada
    removeCategory(...categories) {
      for (const category of categories) {
        if (!(category instanceof Category)) {
          throw new ObjecManagerException("category", "Category");
        }
        const position = this.#getCategoryPosition(category);
        if (position !== -1) {
          this.#categories.splice(position, 1);
        } else {
          throw new ObjectNotExistException(category);
        }
      }
      return this;
    }

    // Permite añadir uno o más menús siempre y cuando sean una instancia de Menú
    addMenu(...menus) {
      for (const menu of menus) {
        if (!(menu instanceof Menu)) {
          throw new ObjecManagerException("menu", "Menu");
        }
        const position = this.#getMenuPosition(menu);
        if (position === -1) {
          this.#menus.push({
            menu,
            dishes: [],
          });
          this.#menus.sort(this.#sortMenusFunc);
        } else {
          throw new ObjectExistsException(menu);
        }
      }
      return this;
    }

    // Permite eliminar uno o más menús, siempre que sea una instancia de Menú y esté registrado
    removeMenu(...menus) {
      for (const menu of menus) {
        if (!(menu instanceof Menu)) {
          throw new ObjecManagerException("menu", "Menu");
        }
        const position = this.#getMenuPosition(menu);
        if (position !== -1) {
          this.#menus.splice(position, 1);
        } else {
          throw new ObjectNotExistException(menu);
        }
      }
      return this;
    }

    // Permite añadir uno o más alérgenos siempre y cuando sean una instancia de Allergen
    addAllergen(...allergens) {
      for (const allergen of allergens) {
        if (!(allergen instanceof Allergen)) {
          throw new ObjecManagerException("allergen", "Allergen");
        }
        const position = this.#getAllergenPosition(allergen);
        if (position === -1) {
          this.#allergens.push({
            allergen,
            dishes: [],
          });
          this.#allergens.sort(this.#sortAllergensFunc);
        } else {
          throw new ObjectExistsException(allergen);
        }
      }
      return this;
    }

    // Permite eliminar uno o más alérgenos, siempre que sea una instancia de Allergen y esté registrado
    removeAllergen(...allergens) {
      for (const allergen of allergens) {
        if (!(allergen instanceof Allergen)) {
          throw new ObjecManagerException("allergen", "Allergen");
        }
        const position = this.#getAllergenPosition(allergen);
        if (position !== -1) {
          this.#allergens.splice(position, 1);
        } else {
          throw new ObjectNotExistException(allergen);
        }
      }
      return this;
    }

    // Permite añadir uno o más platos siempre y cuando sean una instancia de Dish
    addDish(...dishes) {
      for (const dish of dishes) {
        if (!(dish instanceof Dish)) {
          throw new ObjecManagerException("dish", "Dish");
        }
        const position = this.#getDishPosition(dish);
        if (position === -1) {
          this.#dishes.push({
            dish,
          });
          this.#dishes.sort(this.#sortDishesFunc);
        } else {
          throw new ObjectExistsException(dish);
        }
      }
      return this;
    }

    // Permite eliminar uno o más platos, siempre que sea una instancia de Dish y esté registrado
    removeDish(...dishes) {
      for (const dish of dishes) {
        if (!(dish instanceof Dish)) {
          throw new ObjecManagerException("dish", "Dishes");
        }
        const position = this.#getDishPosition(dish);
        if (position !== -1) {
          this.#dishes.splice(position, 1);
        } else {
          throw new ObjectNotExistException(dish);
        }
      }
      return this;
    }

    // Permite añadir uno o más restaurantes siempre y cuando sean una instancia de Restaurant
    addRestaurant(...restaurants) {
      for (const restaurant of restaurants) {
        if (!(restaurant instanceof Restaurant)) {
          throw new ObjecManagerException("restaurant", "Restaurant");
        }
        const position = this.#getRestaurantPosition(restaurant);
        if (position === -1) {
          this.#restaurants.push({
            restaurant,
          });
          this.#restaurants.sort(this.#sortRestaurantsFunc);
        } else {
          throw new ObjectExistsException(restaurant);
        }
      }
      return this;
    }

    // Permite eliminar uno o más restaurantes, siempre que sea una instancia de Restaurant y esté registrado
    removeRestaurant(...restaurants) {
      for (const restaurant of restaurants) {
        if (!(restaurant instanceof Restaurant)) {
          throw new ObjecManagerException("restaurant", "Restaurant");
        }
        const position = this.#getRestaurantPosition(restaurant);
        if (position !== -1) {
          this.#restaurants.splice(position, 1);
        } else {
          throw new ObjectNotExistException(restaurant);
        }
      }
      return this;
    }

    // Función que permite asignar platos a una categoría determinada
    assignCategoryToDish(category, ...dishes) {
      if (!(category instanceof Category)) {
        throw new ObjecManagerException("category", "Category");
      }

      // Obtenemos la posición de la categoría
      let posCategory = this.#getCategoryPosition(category);

      // Si no existe, la añadimos y volvemos a obtener la posición
      if (posCategory === -1) {
        this.addCategory(category);
        posCategory = this.#getCategoryPosition(category);
      }

      // Recorre el spread
      for (const dish of dishes) {
        if (!(dish instanceof Dish)) {
          throw new ObjecManagerException("dish", "Dish");
        }

        // Obtiene la posición del plato
        let posDish = this.#getDishPosition(dish);

        // Si el plato no existe, lo añade y vuelve a obtener la posición
        if (posDish === -1) {
          this.addDish(dish);
          posDish = this.#getDishPosition(dish);
        }

        // Obtenemos la posición del plato en la categoría
        const position = this.#getDishPositionInCategory(
          dish,
          this.#categories[posCategory]
        );

        // Si el plato no existe, se añade y se ordena
        if (position === -1) {
          this.#categories[posCategory].dishes.push(this.#dishes[posDish]);
          this.#categories[posCategory].dishes.sort(this.#sortDishesFunc);
        } else {
          // Si existe, lanza una excepción
          throw new DishExistException(dish, category);
        }
      }
      return this;
    }

    // Función que permite desasignar platos de una categoría concreta
    desassignCategoryToDish(category, ...dishes) {
      if (!(category instanceof Category)) {
        throw new ObjecManagerException("category", "Category");
      }

      // Se obtiene la posición de la categoría
      let posCategory = this.#getCategoryPosition(category);

      // Si existe, se realizan las acciones
      if (posCategory !== -1) {
        for (const dish of dishes) {
          if (!(dish instanceof Dish)) {
            throw new ObjecManagerException("dish", "Dish");
          }
          // Se obtiene la posición del plato en la categoría
          let posDish = this.#getDishPositionInCategory(
            dish,
            this.#categories[posCategory]
          );

          // Si existe, se elimina, y si no, lanza una excepción
          if (posDish !== -1) {
            this.#categories[posCategory].dishes.splice(posDish, 1);
          } else {
            throw new DishNotExistException(
              dish,
              this.#categories[posCategory].category
            );
          }
        }
      } else {
        // Si no existe lanza una excepción
        throw new ObjectNotExistException(category);
      }
      return this;
    }

    // Función que permite asignar platos a una alérgeno determinado
    assignAllergenToDish(allergen, ...dishes) {
      if (!(allergen instanceof Allergen)) {
        throw new ObjecManagerException("allergen", "Allergen");
      }

      // Obtenemos la posición del alérgeno
      let posAllergen = this.#getAllergenPosition(allergen);

      // Si no existe, lo añadimos y volvemos a obtener la posición
      if (posAllergen === -1) {
        this.addAllergen(allergen);
        posAllergen = this.#getAllergenPosition(allergen);
      }

      // Recorre el spread
      for (const dish of dishes) {
        if (!(dish instanceof Dish)) {
          throw new ObjecManagerException("dish", "Dish");
        }

        // Obtiene la posición del plato
        let posDish = this.#getDishPosition(dish);

        // Si el plato no existe, lo añade y vuelve a obtener la posición
        if (posDish === -1) {
          this.addDish(dish);
          posDish = this.#getDishPosition(dish);
        }

        // Obtenemos la posición del plato en el alérgeno
        const position = this.#getDishPositionInAllergen(
          dish,
          this.#allergens[posAllergen]
        );

        // Si el plato no existe, se añade y se ordena
        if (position === -1) {
          this.#allergens[posAllergen].dishes.push(this.#dishes[posDish]);
          this.#allergens[posAllergen].dishes.sort(this.#sortDishesFunc);
        } else {
          // Si existe, lanza una excepción
          throw new DishExistException(dish, allergen);
        }
      }
      return this;
    }

    // Función que permite desasignar platos de una categoría concreta
    desassignAllergenToDish(allergen, ...dishes) {
      if (!(allergen instanceof Allergen)) {
        throw new ObjecManagerException("allergen", "Allergen");
      }

      // Se obtiene la posición del alérgeno
      let posAllergen = this.#getAllergenPosition(allergen);

      // Si existe, se realizan las acciones
      if (posAllergen !== -1) {
        for (const dish of dishes) {
          if (!(dish instanceof Dish)) {
            throw new ObjecManagerException("dish", "Dish");
          }
          // Se obtiene la posición del plato en el alérgeno
          let posDish = this.#getDishPositionInAllergen(
            dish,
            this.#allergens[posAllergen]
          );

          // Si existe, se elimina, y si no, lanza una excepción
          if (posDish !== -1) {
            this.#allergens[posAllergen].dishes.splice(posDish, 1);
          } else {
            throw new DishNotExistException(
              dish,
              this.#allergens[posAllergen].allergen
            );
          }
        }
      } else {
        // Si no existe lanza una excepción
        throw new ObjectNotExistException(allergen);
      }
      return this;
    }

    // Función que permite asignar platos a un menú determinado
    assignDishToMenu(menu, ...dishes) {
      if (!(menu instanceof Menu)) {
        throw new ObjecManagerException("menu", "Menu");
      }

      // Obtenemos la posición del menú
      let posMenu = this.#getMenuPosition(menu);

      // Si no existe, lo añadimos y volvemos a obtener la posición
      if (posMenu === -1) {
        this.addMenu(menu);
        posMenu = this.#getMenuPosition(menu);
      }

      // Recorre el spread
      for (const dish of dishes) {
        if (!(dish instanceof Dish)) {
          throw new ObjecManagerException("dish", "Dish");
        }

        // Obtiene la posición del plato
        let posDish = this.#getDishPosition(dish);

        // Si el plato no existe, lo añade y vuelve a obtener la posición
        if (posDish === -1) {
          this.addDish(dish);
          posDish = this.#getDishPosition(dish);
        }

        // Obtenemos la posición del plato en el menú
        const position = this.#getDishPositionInMenu(
          dish,
          this.#menus[posMenu]
        );

        // Si el plato no existe, se añade y se ordena
        if (position === -1) {
          this.#menus[posMenu].dishes.push(this.#dishes[posDish]);
          this.#menus[posMenu].dishes.sort(this.#sortDishesFunc);
        } else {
          // Si existe, lanza una excepción
          throw new DishExistException(dish, menu);
        }
      }
      return this;
    }

    // Función que permite desasignar platos de un menú concreto
    desassignDishToMenu(menu, ...dishes) {
      if (!(menu instanceof Menu)) {
        throw new ObjecManagerException("menu", "Menu");
      }

      // Se obtiene la posición del menú
      let posMenu = this.#getMenuPosition(menu);

      // Si existe, se realizan las acciones
      if (posMenu !== -1) {
        for (const dish of dishes) {
          if (!(dish instanceof Dish)) {
            throw new ObjecManagerException("dish", "Dish");
          }
          // Se obtiene la posición del plato en el menú
          let posDish = this.#getDishPositionInMenu(dish, this.#menus[posMenu]);

          // Si existe, se elimina, y si no, lanza una excepción
          if (posDish !== -1) {
            this.#menus[posMenu].dishes.splice(posDish, 1);
          } else {
            throw new DishNotExistException(dish, this.#menus[posMenu].menu);
          }
        }
      } else {
        // Si no existe lanza una excepción
        throw new ObjectNotExistException(menu);
      }
      return this;
    }

    // Función que permite intercambiar las posiciones de dos platos en un menú
    changeDishesPositionsInMenu(menu, dish1, dish2) {
      if (!(menu instanceof Menu)) {
        throw new ObjecManagerException("menu", "Menu");
      }
      if (!(dish1 instanceof Dish)) {
        throw new ObjecManagerException("dish1", "Dish");
      }
      if (!(dish2 instanceof Dish)) {
        throw new ObjecManagerException("dish2", "Dish");
      }

      // Se obtiene la posición del menú
      let posMenu = this.#getMenuPosition(menu);

      if (posMenu !== -1) {
        // Se obtiene la posición del plato 1 en el menú
        let posDish1 = this.#getDishPositionInMenu(dish1, this.#menus[posMenu]);
        // Si no existe, lanza una excepción
        if (posDish1 === -1)
          throw new DishNotExistException(dish1, this.#menus[posMenu].menu);
        // Se obtiene la posición del plato 2 en el menú
        let posDish2 = this.#getDishPositionInMenu(dish2, this.#menus[posMenu]);
        // Si no existe, lanza una excepción
        if (posDish2 === -1)
          throw new DishNotExistException(dish2, this.#menus[posMenu].menu);

        // Guardamos en variables temporales los objetos
        let tempDish1 = this.#menus[posMenu].dishes[posDish1];
        let tempDish2 = this.#menus[posMenu].dishes[posDish2];

        // Realizamos el intercambio usando las variables temporales para no afectar a las referencias originales
        this.#menus[posMenu].dishes.splice(posDish1, 1, tempDish2);
        this.#menus[posMenu].dishes.splice(posDish2, 1, tempDish1);
      } else {
        // Si no existe lanza una excepción
        throw new ObjectNotExistException(menu);
      }
    }

    // Generador que recibe una categoría por parámetro y una función de ordenación por parámetro
    // Devolverá un iterador con los platos de esa categoría
    *getDishesInCategory(category, order = this.#sortDishesFunc) {
      if (!(category instanceof Category)) {
        throw new ObjecManagerException("category", "Category");
      }

      // Se obtiene la posición de la categoría
      let posCategory = this.#getCategoryPosition(category);

      // Asignamos a una variable la categoría con los platos para no alterar la referencia original del array de categorías
      const array = [].concat(this.#categories[posCategory].dishes);

      // Lo ordenamos, si hemos recibido una función, la utilizará, si no, ordena los platos por defecto
      array.sort(order);

      // Iterador
      for (const dish of array) {
        yield dish;
      }
    }

    // Generador que recibe una categoría por parámetro y una función de ordenación por parámetro
    // Devolverá un iterador con los platos de esa categoría
    *getDishesWithAllergen(allergen, order = this.#sortDishesFunc) {
      if (!(allergen instanceof Allergen)) {
        throw new ObjecManagerException("allergen", "Allergen");
      }

      // Se obtiene la posición del alérgeno
      let posAllergen = this.#getAllergenPosition(allergen);

      // Asignamos a una variable los alérgenos con los platos para no alterar la referencia original del array de alérgenos
      const array = [].concat(this.#allergens[posAllergen].dishes);

      // Lo ordenamos, si hemos recibido una función, la utilizará, si no, ordena los platos por defecto
      array.sort(order);

      // Iterador
      for (const dish of array) {
        yield dish;
      }
    }

    // Función interna para ordenar ingredientes
    #sortIngredients = (a, b) => {
      return a < b ? -1 : 1;
    };

    // Función interna de callback que devuelve aquellos valores que empiecen con P
    #searchIngredientsWithP(value) {
      return value.startsWith("P");
    }

    *findDishes(
      dish,
      order = this.#sortIngredients,
      search = this.#searchIngredientsWithP
    ) {
      if (!(dish instanceof Dish)) {
        throw new ObjecManagerException("dish", "Dish");
      }

      // Obtenemos en un array los ingredientes del plato
      let array = dish.getIngredients();

      // Modificamos el array con la función de callback, en este caso filtrará con aquellos ingredientes que empiecen con P
      array = array.filter(search);
      // Lo ordenamos, si hemos recibido una función, la utilizará, si no, ordena los ingredientes por defecto
      array.sort(order);

      // Iterador
      for (const ingredient of array) {
        yield ingredient;
      }
    }

    // Función que permite crear un plato siempre y cuando no exista. Si el plato existe,
    // Devuelve la instancia de ese plato.
    createDish(name, type) {
      let dish = this.#dishes.find((element) => element.dish.name === name);

      if (!dish) {
        dish = new this.#objectsConstructors[type](name);
        // Añade el plato a la colección para que quede registrado
        this.addDish(dish);
      } else {
        dish = dish.dish;
      }
      return dish;
    }

    // Función que permite crear un menú siempre y cuando no exista. Si el menú existe,
    // Devuelve la instancia de ese menú.
    createMenu(name, type) {
      let menu = this.#menus.find((element) => element.menu.name === name);

      if (!menu) {
        menu = new this.#objectsConstructors[type](name);
        // Añade el menú a la colección para que quede registrado
        this.addMenu(menu);
      } else {
        menu = menu.menu;
      }
      return menu;
    }

    // Función que permite crear un alérgeno siempre y cuando no exista. Si el alérgeno existe,
    // Devuelve la instancia de ese alérgeno.
    createAllergen(name, type) {
      let allergen = this.#allergens.find(
        (element) => element.allergen.name === name
      );

      if (!allergen) {
        allergen = new this.#objectsConstructors[type](name);
        // Añade el alérgeno a la colección para que quede registrado
        this.addAllergen(allergen);
      } else {
        allergen = allergen.allergen;
      }
      return allergen;
    }

    // Función que permite crear una categoría siempre y cuando no exista. Si la categoría existe,
    // Devuelve la instancia de esa categoría.
    createCategory(name, type) {
      let category = this.#categories.find(
        (element) => element.category.name === name
      );

      if (!category) {
        category = new this.#objectsConstructors[type](name);
        // Añade la categoría a la colección para que quede registrado
        this.addCategory(category);
      } else {
        category = category.category;
      }
      return category;
    }

    // Función que permite crear un restaurante siempre y cuando no exista. Si el restaurante existe,
    // Devuelve la instancia de ese restaurante.
    createRestaurant(name, type) {
      let restaurant = this.#restaurants.find(
        (element) => element.restaurant.name === name
      );

      if (!restaurant) {
        restaurant = new this.#objectsConstructors[type](name);
        // Añade el restaurante a la colección para que quede registrado
        this.addRestaurant(restaurant);
      } else {
        restaurant = restaurant.restaurant;
      }
      return restaurant;
    }
  }

  function init() {
    const restaurantManager = new RestaurantsManager();
    Object.freeze(restaurantManager);
    return restaurantManager;
  }

  return {
    getInstance() {
      if (!instantiated) {
        instantiated = init();
      }
      return instantiated;
    },
    Dish: Dish.name,
    Menu: Menu.name,
    Allergen: Allergen.name,
    Category: Category.name,
    Restaurant: Restaurant.name,
  };
})();

export { RestaurantsManager };
