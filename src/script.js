
import Projects from './Models/Projects.js';
import Project from './Entities/project.js';
import Todos from './Models/Todos.js';
import Todo from './Entities/todo.js';
import '../src/main.css'
import editSvg from './Assets/icons/edit.svg';
import deleteSvg from './Assets/icons/trash-2.svg';
import chevronDownSvg from './Assets/icons/chevron-down.svg';
import chevronUpSvg from './Assets/icons/chevron-up.svg';


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
    const projectsList = document.querySelector('#projects__list');

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
            //console.log([...formData]);
            // console.log(formData.get('project-user-choice'));
            try {
                const title = formData.get('todo-title');
                const description = formData.get('todo-description');
                const projectId = formData.get('project-user-choice');
                const dueDate = formData.get('todo-due-date') || null;
                const priority = formData.get('priority-user-choice');

                const todo = new Todo(title, description, projectId, dueDate, priority);
                console.log(todo);

                // Clear form inputs
                form.reset();

                // Re-render project items if the new todo belongs to the currently viewed project
                const activeProjectButton = document.querySelector('#projects__list button.active');
                if (activeProjectButton && activeProjectButton.dataset.projectId === projectId) {
                    renderProjectItems(projectId);
                    console.log('show items');
                }

            } catch (error) {
                alert(error.message);
                return;
            }
            createTodoDialog.close();
        });


    }

    const renderProjects = () => {
        const projects = Projects.findAll();
        projectsList.innerHTML = '';
        projects.forEach((project, index) => {
            const projectElement = document.createElement('button');
            if (index == 0) {
                projectElement.classList.add('active');
            }
            projectElement.classList.add('project');
            projectElement.dataset.projectId = project.id;
            projectElement.textContent = project.name;
            applicationControlButtons(projectElement);
            projectsList.appendChild(projectElement);
        });
    }

    const applicationControlButtons = (controlElement) => {

        const isProject = controlElement.classList.contains('project');
        const controlSpan = document.createElement('span');
        controlElement.appendChild(controlSpan);
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');

        const chevronBtn = document.createElement('button');
        const chevronIcon = document.createElement('img');

        const editIcon = document.createElement('img');
        editIcon.src = editSvg;
        editIcon.alt = 'Edit';
        editBtn.appendChild(editIcon);

        const deleteIcon = document.createElement('img');
        deleteIcon.src = deleteSvg;
        deleteIcon.alt = 'Delete';
        deleteBtn.appendChild(deleteIcon);

        if (!isProject) {
            controlSpan.classList.add('todo-controls');

            chevronIcon.src = chevronDownSvg;
            chevronIcon.alt = 'expand';
            chevronBtn.appendChild(chevronIcon);
            controlSpan.appendChild(chevronBtn);
        }


        controlSpan.append(editBtn, deleteBtn);

        controlSpan.addEventListener('click', (e) => {
            // Prevent the click from propagating to the project button
            e.stopPropagation();
            console.log(controlElement.classList.contains('project'));


            if (isProject) {
                const projectId = controlElement.dataset.projectId;
                if (e.target === editBtn || e.target === editIcon) {
                    // Handle edit project
                    console.log('Edit project', projectId);
                } else if (e.target === deleteBtn || e.target === deleteIcon) {
                    // Handle delete project
                    console.log('Delete project', projectId);
                }
            } else {
                const todoId = controlElement.dataset.todoId;
                if (e.target === chevronBtn || e.target === chevronIcon) {
                    // Handle edit todo
                    const expandedCard = document.createElement('div');
                    expandedCard.classList.add('expanded-card', 'open');

                    const myInput = document.createElement("input");
                    myInput.type = "text";
                    myInput.placeholder = "test";
                    myInput.style.marginRight = "0.5rem";

                    const myInput2 = document.createElement("input");
                    myInput.type = "text";
                    myInput.placeholder = "test";

                    const myInput3 = document.createElement("select");

                    const newOption = document.createElement('option');
                    newOption.value = 'option_value';
                    newOption.textContent = 'Display Text';

                    myInput3.appendChild(newOption);

                    const hiddenCheckbox = document.createElement("input");
                    hiddenCheckbox.id = "expanded-card-checkbox";
                    hiddenCheckbox.type = "checkbox";
                    hiddenCheckbox.style.visibility = "hidden";

                    expandedCard.append(hiddenCheckbox, myInput, myInput2, myInput3);

                    controlElement.appendChild(expandedCard);

                    console.log(controlElement);



                    console.log('Edit todo', todoId);
                } else if (e.target === deleteBtn || e.target === deleteIcon) {
                    // Handle delete todo
                    console.log('Delete todo', todoId);
                }
            }

        });
    }

    const renderProjectItems = (projectId) => {
        const todos = Todos.findAllByProject(projectId);
        const projectItemsContainer = document.querySelector('.project-items__todos');
        projectItemsContainer.innerHTML = '';


        if (todos.length <= 0) {
            return
        }

        console.log(todos);

        // projectItemsContainer.style.visibility = 'visible';

        todos.forEach((todo) => {
            const projectItem = document.createElement('div');
            projectItem.dataset.todoId = todo.id;
            projectItem.classList.add('todo', 'project-items__todo', 'todo-grid');

            const projectItemCheckBox = document.createElement('input');
            projectItemCheckBox.type = 'checkbox';
            projectItemCheckBox.id = 'project-item__select';
            projectItemCheckBox.dataset.todoId = todo.id;
            projectItemCheckBox.name = 'project-item__select';

            const projectItemTitle = document.createElement('span');
            projectItemTitle.textContent = todo.title;

            const projectItemDueDate = document.createElement('span');
            projectItemDueDate.textContent = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';

            const projectItemPriority = document.createElement('span');
            projectItemPriority.textContent = todo.priority;

            // const projectItemControls = document.createElement('span');

            projectItem.append(
                projectItemCheckBox,
                projectItemTitle,
                projectItemDueDate,
                projectItemPriority
            );

            applicationControlButtons(projectItem);

            projectItemsContainer.appendChild(projectItem);
        })
    }

    const renderProjectTitle = (projectId) => {
        const projectSpan = document.querySelector('.project-items__title #project-title');
        projectsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('project')) {
                const target = e.target;
                projectSpan.textContent = target.textContent;
                renderProjectItems(target.dataset.projectId);
            }
        });
        const firstProject = Projects.findAll()[0];
        console.log(firstProject);

        if (projectId) {
            const project = Projects.findById(projectId);
            projectSpan.textContent = project.name;
        } else if (firstProject) {
            projectSpan.textContent = firstProject.name;
            renderProjectItems(firstProject.id);
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
