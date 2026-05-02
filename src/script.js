
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

function buttonHelper() {
    const projects = document.querySelectorAll('#projects__list .project');

    projects.forEach(project => {
        project.addEventListener('click', function () {
            // 1. Find the currently active button
            const activeButton = document.querySelector('#projects__list button.active');

            if (activeButton) {
                console.log('Previously active:', activeButton.textContent);
                // Remove the class from the old active button
                activeButton.classList.remove('active');
            }

            // 2. Add the active class to the clicked button
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
                // Re-render projects list
                renderProjects();

                nameInput.value = '';
                descriptionInput.value = ''

                createProjectDialog.close();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const createTodoDialogControls = () => {
        const openCreateTodoDialog = document.querySelector('#project-items__create-todo-btn');
        const cancelTodoDialogBtn = document.querySelector('#cancel-todo-btn');
        const createTodoDialog = document.querySelector('#create-todo-dialog');
        const createTodoBtn = document.querySelector('#create-todo-btn');
        const projectSelect = document.querySelector('#project-select');

        // Populate project select options
        const projects = Projects.findAll();
        projects.forEach(project => {
            const option = document.createElement('option');
            option.name = project.name;
            option.value = project.id;
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });

        openCreateTodoDialog.addEventListener('click', () => {
            createTodoDialog.showModal();
        });

        cancelTodoDialogBtn.addEventListener('click', () => {
            createTodoDialog.close();
        });

        const form = document.querySelector('#create-todo-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            // console.log([...formData]);
            // console.log(formData.get('project-user-choice'));
            createTodoDialog.close();
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
    createTodoDialogControls();
    renderProjectTitle();
    renderProjects();
    buttonHelper();
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
