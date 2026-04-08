class Todos {
    findAll() {
        return JSON.parse(localStorage.getItem('todos')) || [];
    }

    findById(id) {
        const todos = this.findAll();
        return todos.find(todo => todo.id === id);
    }
}

export default Todos;