export default class Project {
    constructor(name, description) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.store();
    }

    store() {
        let items = JSON.parse(localStorage.getItem('projects') || '[]');
        if (!items.includes(this.name)) {
            items.push(this.name);
            localStorage.setItem('projects', JSON.stringify(items));
        }
    }

    // static getProject() {
    //     const projectData = localStorage.getItem('project');
    //     if (projectData) {
    //         const { name } = JSON.parse(projectData);
    //         return new Project(name);
    //     }
    //     return null;
    // }
}