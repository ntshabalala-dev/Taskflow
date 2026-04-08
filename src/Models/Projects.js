class Projects {
    static findAll() {
        return JSON.parse(localStorage.getItem('projects')) || [];
    }

    static findById(id) {
        const projects = this.findAll();
        return projects.find(project => project.id === id);
    }
}

export default Projects;