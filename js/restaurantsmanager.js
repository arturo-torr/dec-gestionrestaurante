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

// Excepción que se da cuando una categoría no existe
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

// Excepción que se da cuando un plato ya está asignado en una categoría
class DishExistInCategoryException extends ManagerException {
  constructor(dish, category, fileName, lineNumber) {
    super(
      `Error: The ${dish.name} already exist in ${category.name}.`,
      fileName,
      lineNumber
    );
    this.category = category;
    this.dish = dish;
    this.name = "DishExistInCategoryException";
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
              for (const arrayCat of array) {
                yield arrayCat;
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
          throw new DishExistInCategoryException(dish, category);
        }
      }
      return this;
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
  };
})();

export { RestaurantsManager };
