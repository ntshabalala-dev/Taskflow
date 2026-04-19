import Projects from "../Models/Projects.js";

export default class Project {
    constructor(name, description) {
        this.id = crypto.randomUUID();
        console.log(typeof this.id);
        this.name = name;
        this.description = description;
        this.createdAt = new Date().toISOString();
        this.modifiedAt = null;
        this.store();
    }

    store() {
        let items = Projects.findAll();
        items.push(this.serialize());
        localStorage.setItem('projects', JSON.stringify(items));
    }

    edit(newName, newDescription) {
        if (newName.trim().length === 0) {
            throw new Error("Project name cannot be empty");
        }
        if (newDescription.trim().length === 0) {
            throw new Error("Project description cannot be empty");
        }

        this.name = newName.trim();
        this.description = newDescription.trim();
        this.modifiedAt = new Date().toISOString();

        // Update the stored project
        let items = Projects.findAll();
        const index = items.findIndex(item => item.id === this.id);
        if (index !== -1) {
            items[index] = this.serialize();
            localStorage.setItem('projects', JSON.stringify(items));
        }
    }

    // store() {
    //     let items = Projects.findAll();
    //     items.push(this.serialize());
    //     localStorage.setItem('projects', JSON.stringify(items));
    // }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt
        };
    }

    static fromSerialized(data) {
        const project = Object.create(Project.prototype);
        project.id = data.id;
        project.name = data.name;
        project.description = data.description;
        project.createdAt = data.createdAt;
        project.modifiedAt = data.modifiedAt;
        return project;
    }

    delete() {
        let items = Projects.findAll();
        items = items.filter(item => item.id !== this.id);
        localStorage.setItem('projects', JSON.stringify(items));
    }
}
