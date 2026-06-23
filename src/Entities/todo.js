import todos from '../Models/Todos.js';

export default class Todo {
    constructor(title, description, projectId, dueDate = null, priority = 'Low', id = null) {
        this.id = id || crypto.randomUUID();
        this.title = title.trim();
        this.description = description.trim();
        this.projectId = projectId;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.createdAt = new Date().toISOString();
        this.modifiedAt = null;
        this.store();
    }

    toggleComplete() {
        this.completed = !this.completed;
        this.modifiedAt = new Date().toISOString();

        let items = todos.findAll();
        const index = items.findIndex(item => item.id === this.id);
        if (index !== -1) {
            items[index] = this.serialize();
            localStorage.setItem('todos', JSON.stringify(items));
        }
    }

    edit(DataObject) {
        const newTitle = DataObject.newTitle;
        const newDescription = DataObject.newDescription;
        const newProjectId = DataObject.newProjectId;
        const newDueDate = DataObject.newDueDate ?? null;
        const newPriority = DataObject.newPriority ?? null;

        if (newTitle !== undefined && newTitle.trim().length === 0) {
            throw new Error("Todo title cannot be empty");
        }
        if (newDescription !== undefined && newDescription.trim().length === 0) {
            throw new Error("Todo description cannot be empty");
        }
        if (newProjectId !== undefined && newProjectId.trim().length === 0) {
            throw new Error("Todo project cannot be empty");
        }

        console.log(newTitle, newDescription, newProjectId, newPriority);

        this.title = newTitle !== undefined ? newTitle.trim() : this.title;
        this.description = newDescription !== undefined ? newDescription.trim() : this.description;
        this.projectId = newProjectId !== undefined ? newProjectId.trim() : this.projectId;
        this.dueDate = newDueDate ? newDueDate : this.dueDate;
        this.priority = newPriority ? newPriority : this.priority;
        this.modifiedAt = new Date().toISOString();

        // Update the stored todo
        let items = todos.findAll();
        const index = items.findIndex(item => item.id === this.id);
        if (index !== -1) {
            items[index] = this.serialize();
            localStorage.setItem('todos', JSON.stringify(items));
            console.log('Todo updated', this.serialize());
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
            projectId: this.projectId,
            dueDate: this.dueDate,
            priority: this.priority,
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
        todo.projectId = data.projectId;
        todo.dueDate = data.dueDate ?? null;
        todo.priority = data.priority ?? 'medium';
        todo.completed = data.completed;
        todo.createdAt = data.createdAt;
        todo.modifiedAt = data.modifiedAt ?? null;
        return todo;
    }

    delete() {
        console.log('Deleting todo with id:', this.id);
        let items = todos.findAll();
        items = items.filter(item => item.id !== this.id);
        localStorage.setItem('todos', JSON.stringify(items));
    }
}