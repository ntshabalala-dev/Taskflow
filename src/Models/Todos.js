class Todos {
    static findAll() {
        return JSON.parse(localStorage.getItem('todos')) || [];
    }

    static findById(id) {
        const todos = this.findAll();
        return todos.find(todo => todo.id === id);
    }
}

export default Todos;