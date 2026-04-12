import Todo from "../Entities/todo.js";

class Todos {
    static findAll() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        return todos.map(todo => Todo.fromSerialized(todo));
    }

    static findById(id) {
        const todos = this.findAll();
        const todo = todos.find(todo => todo.id === id);
        if (!todo) {
            throw new Error(`Todo with id ${id} not found`);
        }

        return Todo.fromSerialized(todo);
    }
}

export default Todos;