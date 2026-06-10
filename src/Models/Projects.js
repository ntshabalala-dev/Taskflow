import Project from "../Entities/project.js";

export default class Projects {
    static findAll() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        return projects.map(project => Project.fromSerialized(project));
    }

    static findById(id) {
        const projects = this.findAll();
        const project = projects.find(project => project.id === id);
        if (!project) {
            throw new Error(`Project with id ${id} not found`);
        }

        return Project.fromSerialized(project);
    }

    /**
     * @param {string} name - user project name
     * @returns {Projects}
     */
    static findByName(name) {
        const projects = this.findAll();
        const searchTerm = name.toLowerCase();
        const found = projects.filter(project => project.name.toLowerCase().includes(searchTerm));
        if (!found) {
            throw new Error(`Project with name ${name} not found`);
        }

        return found.map(project => Project.fromSerialized(project));
    }
}