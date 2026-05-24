
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

function toggleMenu() {
    const navLogo = document.querySelector('#projects__nav-logo span');
    const search = document.querySelector('#projects__search');
    const list = document.querySelector('#projects__list');

    const hamburger = document.querySelector('.hamburger');

    hamburger.addEventListener('click', () => {
        navLogo.classList.toggle('active');
        search.classList.toggle('active');
        list.classList.toggle('active');
        hamburger.classList.toggle('active');
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
            const formControl = document.createElement('div');
            formControl.className = 'form-control';

            // Find all relevant fields (inputs and their labels) to wrap them
            const nameLabel = document.querySelector('#project-name').closest('.form-group'); // Assuming a structure where labels are grouped
            const nameInput = document.querySelector('#project-name');
            const descriptionLabel = document.querySelector('#project-description').closest('.form-group');
            const descriptionInput = document.querySelector('#project-description');

            // For simplicity based on the provided code context, we wrap inputs directly.
            // If labels exist and need wrapping too, this part needs more context.
            // We will wrap the inputs as requested in the existing flow.

            formControl.appendChild(nameInput);
            formControl.appendChild(descriptionInput);

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

        const isProjectContainer = controlElement.classList.contains('project');
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

        if (!isProjectContainer) {
            controlSpan.classList.add('todo-controls');

            chevronIcon.src = chevronDownSvg;
            chevronIcon.alt = 'expand';
            chevronBtn.appendChild(chevronIcon);
            controlSpan.appendChild(chevronBtn);
        }


        controlSpan.append(editBtn, deleteBtn);

        // @card = cardelement
        const createExpandedCard = (card, todoId) => {
            const todo = Todos.findById(todoId);
            // Column 1: Todo Title
            const titleInput = document.createElement("input");
            titleInput.type = "text";
            titleInput.value = todo.title;
            titleInput.placeholder = "Todo Title";
            titleInput.style.marginRight = "0.5rem";
            titleInput.id = 'todo-title';

            const titleLabel = document.createElement("label");
            titleLabel.textContent = "Title";
            titleLabel.setAttribute('for', 'todo-title');

            const formControl__title = document.createElement('div');
            formControl__title.classList.add('form-control__title');
            formControl__title.append(titleLabel, titleInput);

            // Todo Description
            const descriptionLabel = document.createElement("label");
            descriptionLabel.textContent = "Description";
            descriptionLabel.setAttribute('for', 'todo-description');

            const descriptionInput = document.createElement("textarea");
            descriptionInput.id = "todo-description";
            descriptionInput.rows = 3;
            descriptionInput.name = "todo-description";
            descriptionInput.value = todo.description;
            descriptionInput.placeholder = "Todo Description";

            const formControl__description = document.createElement('div');
            formControl__description.classList.add('form-control__description');
            formControl__description.append(descriptionLabel, descriptionInput);

            const formControl1 = document.createElement('div');
            formControl1.classList.add('form-control', 'title');
            formControl1.append(formControl__description);

            // Column 2: Due date
            const dueDateLabel = document.createElement("label");
            dueDateLabel.textContent = "Due Date";
            dueDateLabel.setAttribute('for', 'todo-due-date');

            const dueDateInput = document.createElement("input");
            const myDiv = document.createElement("div");
            dueDateInput.id = "todo-due-date";
            dueDateInput.type = "date";
            dueDateInput.placeholder = "Select due date";
            dueDateInput.name = "todo-due-date";
            dueDateInput.value = todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '';

            const formControl__duedate = document.createElement('div');
            formControl__duedate.classList.add('form-control__duedate');
            formControl__duedate.append(dueDateLabel, dueDateInput);

            const formControl2 = document.createElement('div');
            formControl2.classList.add('form-control', 'duedate');
            formControl2.append(formControl__duedate);

            // Column 3: Priority
            const priorityLabel = document.createElement("label");
            priorityLabel.textContent = "Priority";
            priorityLabel.setAttribute('for', 'todo-priority-user-choice');

            const prioritySelect = document.createElement("select");
            prioritySelect.id = "todo-priority-user-choice";
            prioritySelect.name = "priority-user-choice";
            const todoPriorityCapitalized = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);

            ['High', 'Medium', 'Low'].forEach(element => {
                const option = document.createElement('option');
                option.value = element;
                option.textContent = element;
                if (element == todoPriorityCapitalized) {
                    option.selected = true;
                }
                prioritySelect.appendChild(option);
            });


            const formControl__priority = document.createElement('div');
            formControl__priority.classList.add('form-control__priority');
            formControl__priority.append(priorityLabel, prioritySelect);

            const formControl3 = document.createElement('div');
            formControl3.classList.add('form-control', 'priority');
            formControl3.append(formControl__priority);


            const hiddenCheckbox = document.createElement("input");
            hiddenCheckbox.id = "expanded-card-checkbox";
            hiddenCheckbox.type = "checkbox";
            hiddenCheckbox.style.visibility = "hidden";

            const formControl__buttons = document.createElement('div');
            formControl__buttons.classList.add('form-control__buttons');

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save Changes';
            saveBtn.type = 'submit';

            const markCompleteBtn = document.createElement('button');
            markCompleteBtn.textContent = 'Mark as Complete';
            markCompleteBtn.type = 'button';

            const deleteToDoBtn = document.createElement('button');
            deleteToDoBtn.textContent = 'Delete Todo';
            deleteToDoBtn.type = 'button';

            formControl__buttons.append(saveBtn, markCompleteBtn, deleteToDoBtn);

            card.append(hiddenCheckbox, formControl1, formControl2, formControl3, formControl__buttons);

            return card;
        }

        controlSpan.addEventListener('click', (e) => {
            // Prevent the click from propagating to the project button
            e.stopPropagation();
            const target = e.target;
            console.log(controlElement.classList.contains('project'));

            // Controls for the project buttons
            if (isProjectContainer) {
                const projectId = controlElement.dataset.projectId;
                if (target === editBtn || target === editIcon) {
                    // Handle edit project
                    console.log('Edit project', projectId);
                } else if (target === deleteBtn || target === deleteIcon) {
                    // Handle delete project
                    console.log('Delete project', projectId);
                }
            } else {
                // Controls for the todo buttons
                const todoId = controlElement.dataset.todoId;

                //console.log(todo);

                // Handle expand/collapse card
                if (target === chevronBtn || target === chevronIcon) {
                    if (target.alt === 'expand') {
                        const expandedCardContainer = document.createElement('form');
                        chevronIcon.src = chevronUpSvg;
                        chevronIcon.alt = 'collapse';
                        expandedCardContainer.classList.add('expanded-card', 'open');
                        controlElement.appendChild(createExpandedCard(expandedCardContainer, todoId));
                    } else {
                        chevronIcon.src = chevronDownSvg;
                        chevronIcon.alt = 'expand';
                        const expandedCard = controlElement.querySelector('.expanded-card')
                        controlElement.removeChild(expandedCard);
                    }

                } else if (target === editBtn || target === editIcon) {
                    // Handle delete todo
                    console.log('Edit todo', todoId);
                } else if (target === deleteBtn || target === deleteIcon) {
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

        // Only render items if they exist
        if (todos.length <= 0) {
            return
        }

        console.log(todos);

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
            projectItemTitle.classList.add('todo-title');

            const projectItemDueDate = document.createElement('span');
            projectItemDueDate.textContent = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';

            const projectItemPriority = document.createElement('span');
            projectItemPriority.textContent = todo.priority;

            projectItem.append(
                projectItemCheckBox,
                projectItemTitle,
                projectItemDueDate,
                projectItemPriority
            );

            // Inline title editing
            projectItemTitle.addEventListener('click', () => {
                const originalTitle = todo.title;

                const textarea = document.createElement('textarea');
                textarea.value = originalTitle;
                textarea.rows = 1;
                textarea.classList.add('todo-title-input');

                projectItemTitle.replaceWith(textarea);
                textarea.focus();
                textarea.select();

                let saved = false;

                const saveTitle = () => {
                    if (saved) return;
                    saved = true;

                    const newTitle = textarea.value.trim();
                    if (newTitle && newTitle !== originalTitle) {
                        todo.edit(newTitle);
                    }

                    projectItemTitle.textContent = todo.title;
                    textarea.replaceWith(projectItemTitle);
                };

                const cancelEdit = () => {
                    if (saved) return;
                    saved = true;

                    projectItemTitle.textContent = originalTitle;
                    textarea.replaceWith(projectItemTitle);
                };

                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        saveTitle();
                    } else if (e.key === 'Escape') {
                        cancelEdit();
                    }
                });

                textarea.addEventListener('blur', () => {
                    saveTitle();
                });
            });

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
    toggleMenu();
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
