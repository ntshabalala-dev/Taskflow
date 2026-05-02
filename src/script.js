
import Projects from './Models/Projects.js';
import Project from './Entities/project.js';
import Todos from './Models/Todos.js';
import Todo from './Entities/todo.js';
import main from '../src/main.css'

// let p = new Project('Test', "This is a test project");
// let p2 = new Project('Test2', "This is a test project two");
// let b = new Project('Test2', "This is another test project");

//console.log(localStorage.getItem('projects'));

//console.log(Projects.findAll());


function taskFlowController() {

    const createDefaultData = () => {
        if (Projects.findAll().length === 0) {
            const project = new Project('Default Project', 'This is the default project');
            const todo1 = new Todo('Default Todo 1', 'This is the first default todo', project.id);
        }
    }

    return {
        createDefaultData
    }
}

function linkHelper() {
    const links = document.querySelectorAll('.menu-container__options--section a');
    const firstLink = document.querySelector('.menu-container__options--section:nth-child(1) a');

    firstLink.classList.add('active');

    links.forEach(link => {
        link.addEventListener('click', function () {
            // 1. Find the currently active tag
            const activeTag = document.querySelector('a.active');

            if (activeTag) {
                console.log('Previously active:', activeTag.textContent);
                // Remove the class from the old active tag
                activeTag.classList.remove('active');
            }

            // 2. Add the active class to the clicked tag
            this.classList.add('active');
        });
    });
}

//IIFE for screen controller
(function () {
    const appController = taskFlowController();
    appController.createDefaultData();

    const defaultList = document.querySelector('#projects__list');
    const projectList = document.querySelector('#projects__list');

    const createProjectDialogControls = () => {
        const openCreateProjectDialog = document.querySelector('#open-create-project-dialog-btn');
        const createProjectDialog = document.querySelector('#create-project-dialog');
        const cancelBtn = document.querySelector('#cancel-project-btn');
        const createProjectBtn = document.querySelector('#create-project-btn');


        openCreateProjectDialog.addEventListener('click', () => {
            createProjectDialog.showModal();
        });

        cancelBtn.addEventListener('click', () => {
            createProjectDialog.close();
        });

        createProjectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const nameInput = document.querySelector('#project-name');
            const descriptionInput = document.querySelector('#project-description');

            try {
                (new Project(nameInput.value, descriptionInput.value));
                renderProjects();

                nameInput.value = '';
                descriptionInput.value = ''

                createProjectDialog.close();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const renderProjects = () => {
        const projects = Projects.findAll();
        defaultList.innerHTML = '';
        projects.forEach((project, index) => {
            const projectElement = document.createElement('button');
            if (index == 0) {
                projectElement.classList.add('active');
            }
            projectElement.classList.add('project');
            projectElement.dataset.projectId = project.id;
            projectElement.textContent = project.name;
            defaultList.appendChild(projectElement);
        });
    }

    const renderProjectTitle = (projectId) => {
        const projectSpan = document.querySelector('.project-items__title #project-title');
        projectList.addEventListener('click', (e) => {
            if (e.target.classList.contains('project')) {
                projectSpan.textContent = e.target.textContent;
            }
        });
        const firstProject = Projects.findAll()[0];
        if (projectId) {
            const project = Projects.findById(projectId);
            projectSpan.textContent = project.name;
        } else if (firstProject) {
            projectSpan.textContent = firstProject.name;
        } else {
            projectSpan.textContent = 'No Projects';
        }
    }


    createProjectDialogControls();
    renderProjectTitle();
    renderProjects();
})();


// let a = new Todo('Test', 'This is a test todo', p.id);
// let b = new Todo('Test2', 'This is another test todo', p2.id);
// let c = new Todo('Test3', 'This is a third test todo', p.id);

// console.log(p.id);
// console.log(a.project);


// console.log(Todos.findAllByProject(p.id));

/*

//console.log(localStorage.getItem('todos'));
let s = localStorage.getItem('todos');
console.log(JSON.parse(s));

b.edit('Test3 Edited', 'This is an edited test todo', 'Test Project Edited');

s = localStorage.getItem('todos');
console.error(JSON.parse(s));

b.delete();

s = localStorage.getItem('todos');
console.log(JSON.parse(s));

 */
//localStorage.clear();
