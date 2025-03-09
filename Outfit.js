class Outfit {
    // Fields (Attributes)
    outfit_ID;
    Name;
    Color;
    Size;
    Description;
    Condition;
    Category;

    constructor() {
        if (new.target === Outfit) {
            throw new Error("Cannot instantiate an interface");
        }
    }

    // Methods (Abstract-like)
    addToInventory() {
        throw new Error("Method 'addToInventory' must be implemented.");
    }

    addCategory(category) {
        throw new Error("Method 'addCategory' must be implemented.");
    }

    inspectItem() {
        throw new Error("Method 'inspectItem' must be implemented.");
    }
}

// Export the interface-like class
module.exports = Outfit;
