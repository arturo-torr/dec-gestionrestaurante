// Objeto que identifica los datos de un plato
class Dish {
  #name;
  #description;
  #ingredients;
  #image;

  // En el constructor sólo será obligatorio el nombre del plato
  constructor(name, description = "", ingredients = [], image = "") {
    name = name.trim();

    // Si no introducimos un valor, lanza una excepción
    if (name === "undefined" || name === "")
      throw new EmptyValueException("name");

    this.#name = name;
    this.#description = description;
    this.#ingredients = ingredients;
    this.#image = image;
  }

  // --- Getters & Setters ---
  get name() {
    return this.#name;
  }

  set name(value = "EmptyDish") {
    value = value.trim();
    if (value === "undefined" || value === "EmptyDish" || value === "")
      throw new EmptyValueException("value");

    this.#name = value;
  }

  get description() {
    return this.#description;
  }

  set description(value) {
    if (value === "undefined" || value == null)
      throw new EmptyValueException("description");

    this.#description = value;
  }

  get ingredients() {
    // referencia para habilitar el closure en el objeto
    let array = this.#ingredients;
    return {
      // Objeto iterable
      [Symbol.iterator]() {
        // Propiedad con la función que devuelve el iterador;
        let nextIndex = 0; // Inicialización del índice para cada iterador
        return {
          next: function () {
            return nextIndex < array.length
              ? { value: array[nextIndex++], done: false }
              : { done: true };
          },
        };
      },
    };
  }

  get image() {
    return this.#image;
  }

  set image(url) {
    if (url === "undefined" || url == null)
      throw new EmptyValueException("image");
    if (
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}(\:(\d){2,4})?(\/[a-zA-Z0-9_.$%._\+~#]+)*(\?(\w+=.*)(\&(\w+=.+))*)?$/.test(
        url
      ) === true ||
      /^(\/?[a-zA-Z0-9_.$%._\+~#]+)*(\?(\w+=.*)(\&(\w+=.+))*)?$/.test(url) ===
        true
    )
      this.#image = url;
    else throw new InvalidValueException("url", url);
  }

  // Imprime por pantalla las propiedades del objeto Dish
  toString() {
    return (
      "Dish name: " +
      this.#name +
      ", Description: " +
      this.#description +
      ", Image: " +
      this.#image +
      ", Ingredients: " +
      this.#ingredients.join()
    );
  }
}

// Objeto con la que será creada la estructura de categorías
class Category {
  #name;
  #description;

  // En el constructor sólo será obligatorio el nombre de la categoría
  constructor(name, description = "") {
    name = name.trim();

    // Si no introducimos un valor, lanza una excepción
    if (name === "undefined" || name === "")
      throw new EmptyValueException("name");

    this.#name = name;
    this.#description = description;
  }

  // --- Getters & Setters ---
  get name() {
    return this.#name;
  }

  set name(value = "EmptyCategory") {
    value = value.trim();
    if (value === "undefined" || value === "EmptyCategory" || value === "")
      throw new EmptyValueException("value");

    this.#name = value;
  }

  get description() {
    return this.#description;
  }

  set description(value) {
    if (value === "undefined" || value == null)
      throw new EmptyValueException("description");

    this.#description = value;
  }

  // Imprime por pantalla las propiedades del objeto Category
  toString() {
    return (
      "Category name: " + this.#name + ", Description: " + this.#description
    );
  }
}
