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
}