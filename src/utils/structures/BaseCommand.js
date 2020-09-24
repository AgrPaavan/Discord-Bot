module.exports = class BaseCommand {
    constructor(name, options = {
        description,
        usage,
        example,
        category,
        aliases
    }) {
        this.name = name;
        this.description = options.description;
        this.usage = options.usage;
        this.example = options.example;
        this.category = options.category;
        this.aliases = options.aliases;
    }
}
