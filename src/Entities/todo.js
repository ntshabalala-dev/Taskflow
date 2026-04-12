import todos from '../Models/Todos.js';

export default class Todo {
    constructor(title, description, project, id = null) {
        this.id = id || crypto.randomUUID();
        this.title = title.trim();
        this.description = description.trim();
        this.project = project;
        this.completed = false;
        this.createdAt = new Date().toISOString();
        this.modifiedAt = null;
        this.store();
    }

    toggle() {
        this.completed = !this.completed;
    }

    edit(newTitle, newDescription, newProject) {
        if (newTitle.trim().length === 0) {
            throw new Error("Todo title cannot be empty");
        }
        if (newDescription.trim().length === 0) {
            throw new Error("Todo description cannot be empty");
        }
        if (newProject.trim().length === 0) {
            throw new Error("Todo project cannot be empty");
        }

        this.title = newTitle.trim();
        this.description = newDescription.trim();
        this.project = newProject.trim();
        this.modifiedAt = new Date().toISOString();

        // Update the stored todo
        let items = todos.findAll();
        const index = items.findIndex(item => item.id === this.id);
        if (index !== -1) {
            items[index] = this.serialize();
            localStorage.setItem('todos', JSON.stringify(items));
        }
    }

    store() {
        let items = JSON.parse(localStorage.getItem('todos') || '[]');

        items.push(this.serialize());
        localStorage.setItem('todos', JSON.stringify(items));
    }

    serialize() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            project: this.project,
            completed: this.completed,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt
        };
    }

    static fromSerialized(data) {
        const todo = Object.create(Todo.prototype);
        todo.id = data.id;
        todo.title = data.title;
        todo.description = data.description;
        todo.project = data.project;
        todo.completed = data.completed;
        todo.createdAt = data.createdAt;
        todo.modifiedAt = data.modifiedAt ?? null;
        return todo;
    }

    delete() {
        let items = todos.findAll();
        items = items.filter(item => item.id !== this.id);
        localStorage.setItem('todos', JSON.stringify(items));
    }
}