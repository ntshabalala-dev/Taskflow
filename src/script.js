import Projects from './Models/Projects.js';
import Project from './Entities/project.js';
import Todos from './Models/Todos.js';
import Todo from './Entities/todo.js';
import '../src/main.css'
import editSvg from './Assets/icons/edit.svg';
import deleteSvg from './Assets/icons/trash-2.svg';
import editSvg_w from './Assets/icons/edit-w.svg';
import deleteSvg_w from './Assets/icons/trash-2-w.svg';
import chevronDownSvg from './Assets/icons/chevron-down.svg';
import chevronUpSvg from './Assets/icons/chevron-up.svg';
import escape from 'validator/lib/escape.js';
import trim from 'validator/lib/trim.js';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

function taskFlowController() {

    const createDefaultData = () => {
        if (Projects.findAll().length === 0) {
            const project = new Project('Default Project', 'This is the default project');
            const todo1 = new Todo('Default Todo 1', 'This is the first default todo', project.id);
        }
    }

    const cleanData = (data) => {
        return escape(trim(data)) || '';
    }

    const toast = (message, type) => {
        switch (type) {
            case 'success':
                Toastify({
                    text: message,
                    duration: 5000,
                    gravity: "top", // top or bottom
                    position: "center", // left, center or right
                    style: { background: "#10b981" }
                }).showToast();
                break;
            case 'warning':
                Toastify({
                    text: message,
                    duration: 5000,
                    gravity: "top", // top or bottom
                    position: "center", // left, center or right
                    style: { background: "#f59e0b" }
                }).showToast();
                break;
            case 'error':
                break;
            default:
                break;
        }
    }

    return {
        toast,
        createDefaultData,
        cleanData
    }
}

function projectsButtonHelper() {
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
    const containers = document.querySelectorAll('.container');

    hamburger.addEventListener('click', () => {
        navLogo.classList.toggle('active');
        search.classList.toggle('active');
        list.classList.toggle('active');
        hamburger.classList.toggle('active');
        containers.forEach(container => {
            container.classList.toggle('active');
        });

    });
}

//IIFE for screen controller
(function () {
    const appController = taskFlowController();
    appController.createDefaultData();

    const defaultList = document.querySelector('#projects__list');
    let projectsList = document.querySelector('#projects__list');
    const confirmDeleteDialog = document.querySelector('#confirm-delete-dialog');
    const editTodoDialog = document.querySelector('#edit-todo-dialog');

    const appSearch = () => {
        const currentProject = document.querySelector('#projects__list .project.active')
        const searchButton = document.querySelector('#todo-search__button');
        const searchInput = document.querySelector('#project-item-search-input');
        const clearSearchButton = document.querySelector('#todo-search__clear-btn');
        const projectsSearchButton = document.querySelector('#project-search-input');
        let c = 0;

        const removeClearButton = () => {
            if (clearSearchButton.classList.contains('show')) {
                c = 0;
                clearSearchButton.classList.toggle('show');
            }
        }

        searchInput.addEventListener('click', function () {
            if (this.value.length > 0 && !clearSearchButton.classList.contains('show')) {
                clearSearchButton.classList.toggle('show');
                c = -1;
            }
        })

        searchInput.addEventListener('input', function (e) {
            console.log('hee');
            console.log(clearSearchButton)
            if (c == 0) {
                clearSearchButton.classList.toggle('show');
                c = -1;
            }

            if (this.value.length === 0) {
                removeClearButton();
            }
        });

        clearSearchButton.addEventListener('mousedown', () => {
            searchInput.value = '';
        })

        searchInput.addEventListener('blur', (e) => {
            removeClearButton();
        });

        searchButton.addEventListener('click', (e) => {
            const searchTerm = appController.cleanData(searchInput.value);
            if (searchTerm.length === 0) {
                renderProjectItems(currentProject.dataset.projectId, searchTerm);
                return
            }
            renderProjectItems(currentProject.dataset.projectId, searchTerm);
        });

        // todo enter & esc key event
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {

            }

            if (e.key === 'Escape' && !e.shiftKey) {

            }
        });

        projectsSearchButton.addEventListener('input', function (e) {
            if (!e.shiftKey) {
                console.log(this.value);
                renderProjects(this.value);
                renderProjectTitleAndItems()
                projectsButtonHelper();
            }
        });

    }

    const confirmDeleteDialogControls = (entity) => {
        // console.log(entity instanceof entity);
        const confirmDeleteBtn = document.querySelector('#confirm-delete-btn');

        confirmDeleteBtn.addEventListener('click', () => {
            if (!entity) return;

            if (entity instanceof Todo) {
                entity.delete();
                const activeProjectButton = document.querySelector('#projects__list button.active');
                if (activeProjectButton) {
                    renderProjectItems(activeProjectButton.dataset.projectId);
                }
                appController.toast('✓ Todo Deleted Successfully!', 'success');
            } else if (entity instanceof Project) {
                entity.delete();
                renderProjects();
                renderProjectTitleAndItems()
                projectsButtonHelper();

                Todos.findAllByProject(entity.id).forEach(todo => {
                    todo.delete();
                });
            }
            confirmDeleteDialog.close();
        });
    }

    const editTodoDialogControls = (todo) => {
        const cancelEditBtn = document.querySelector('#cancel-edit-btn');
        const saveEditBtn = document.querySelector('#save-edit-btn');
        const editTitleInput = document.querySelector('#edit-todo-title');
        const editDescriptionInput = document.querySelector('#edit-todo-description');
        const editDueDateInput = document.querySelector('#edit-todo-due-date');
        const editPrioritySelect = document.querySelector('#edit-todo-priority');
        const editProjectSelect = document.querySelector('#edit-todo-project');

        const populateProjectSelect = () => {
            editProjectSelect.innerHTML = '';
            const projects = Projects.findAll();
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                editProjectSelect.appendChild(option);
            });
        };

        cancelEditBtn.addEventListener('click', () => {
            editTodoDialog.close();
        });

        saveEditBtn.addEventListener('click', () => {
            if (!todo) return;

            const title = editTitleInput.value;
            const description = editDescriptionInput.value;

            if (!title.trim() || !description.trim()) {
                alert('Title and description are required.');
                return;
            }

            const data = {
                newTitle: appController.cleanData(title),
                newDescription: appController.cleanData(description),
                newProjectId: editProjectSelect.value,
                newDueDate: editDueDateInput.value || null,
                newPriority: editPrioritySelect.value
            };

            console.log('Edit data: ', data);

            todo.edit(data);

            const activeProjectButton = document.querySelector('#projects__list button.active');
            if (activeProjectButton) {
                renderProjectItems(activeProjectButton.dataset.projectId);
            }

            appController.toast('✓ Todo Updated Successfully!', 'success');

            editTodoDialog.close();
        });

        editTodoDialog.addEventListener('click', (e) => {
            if (e.target === editTodoDialog) {
                editTodoDialog.close();
            }
        });

        populateProjectSelect();
    }

    const createProjectDialogControls = () => {
        const openCreateProjectDialog = document.querySelector('#open-create-project-dialog-btn');
        const createProjectDialog = document.querySelector('#create-edit-project-dialog');
        const createProjectBtn = document.querySelector('#create-project-btn');
        const form = document.querySelector('#create-edit-project-form');

        openCreateProjectDialog.addEventListener('click', () => {
            createProjectDialog.showModal();
        });

        form.addEventListener('submit', function (e) {
            console.log('submit');
            e.preventDefault();
            const formData = new FormData(this);
            console.log([...formData]);
            try {
                const title = appController.cleanData(formData.get('project-name'));
                const description = appController.cleanData(formData.get('project-description'));

                (new Project(title, description));
                // Re-render projects list
                renderProjects();

                this.reset();
                projectsButtonHelper();
                createProjectDialog.close();
            } catch (error) {
                alert(error.message);
                return;
            }
        });
    }

    const editProjectDialogControls = () => {
        // const openCreateProjectDialog = document.querySelector('#open-create-project-dialog-btn');
        // const createProjectDialog = document.querySelector('#create-project-dialog');
        // const createProjectBtn = document.querySelector('#create-project-btn');
        // const form = document.querySelector('#create-project-form');

        // openCreateProjectDialog.addEventListener('click', () => {
        //     createProjectDialog.showModal();
        // });

        // form.addEventListener('submit', function (e) {
        //     console.log('submit');
        //     e.preventDefault();
        //     const formData = new FormData(this);
        //     console.log([...formData]);
        //     try {
        //         const title = appController.cleanData(formData.get('project-name'));
        //         const description = appController.cleanData(formData.get('project-description'));

        //         (new Project(title, description));
        //         // Re-render projects list
        //         renderProjects();

        //         this.reset();
        //         projectsButtonHelper();
        //         createProjectDialog.close();
        //     } catch (error) {
        //         alert(error.message);
        //         return;
        //     }
        // });
    }

    const createTodoDialogControls = () => {
        const openCreateTodoDialog = document.querySelector('#project-items__create-todo-btn');
        const createTodoDialog = document.querySelector('#create-todo-dialog');
        const createTodoBtn = document.querySelector('#create-todo-btn');
        const projectSelect = document.querySelector('#project-select');



        openCreateTodoDialog.addEventListener('click', () => {
            // Populate project select options
            const projects = Projects.findAll();
            projectSelect.innerHTML = '';

            projects.forEach(project => {
                console.log(project);
                const option = document.createElement('option');
                option.name = project.name;
                option.value = project.id;
                option.textContent = project.name;
                projectSelect.appendChild(option);
            });

            createTodoDialog.showModal();
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
                let check = activeProjectButton && activeProjectButton.dataset.projectId === projectId;
                console.log(check);
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

    /**
     * @param {string} searchTerm - User project search term
     */
    const renderProjects = (searchTerm = '') => {
        let projects;
        try {
            projects = searchTerm ? Projects.findByName(searchTerm) : Projects.findAll();
        } catch (error) {
            console.error(error);
            return;
        }
        console.log(projects);
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
        editIcon.src = editSvg_w;
        editIcon.alt = 'Edit';
        editBtn.appendChild(editIcon);

        const deleteIcon = document.createElement('img');
        deleteIcon.src = deleteSvg_w;
        deleteIcon.alt = 'Delete';
        deleteBtn.appendChild(deleteIcon);

        if (!isProjectContainer) {
            editIcon.src = editSvg
            deleteIcon.src = deleteSvg;
            controlSpan.classList.add('todo-controls');

            chevronIcon.src = chevronDownSvg;
            chevronIcon.alt = 'expand';
            chevronBtn.appendChild(chevronIcon);
            controlSpan.appendChild(chevronBtn);
        }

        controlSpan.append(editBtn, deleteBtn);

        // @card = cardelement
        const createExpandedCard = (card, todo) => {
            //const todo = Todos.findById(todoId);
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

            if (todo.completed) {
                dueDateInput.disabled = true;
            }

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
            saveBtn.id = 'expanded-save-btn';
            saveBtn.type = 'submit';

            const markCompleteBtn = document.createElement('button');
            markCompleteBtn.textContent = todo.completed ? 'Mark as Incomplete' : 'Mark as Complete';;
            markCompleteBtn.id = 'expanded-complete-btn';
            markCompleteBtn.type = 'button';

            const deleteToDoBtn = document.createElement('button');
            deleteToDoBtn.textContent = 'Delete Todo';
            deleteToDoBtn.id = 'expanded-delete-btn';
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

            const setDialogEntity = (entity) => {
                const entities = document.querySelectorAll('.entity');
                entities.forEach(element => {
                    element.textContent = entity;
                });
            }

            // Controls for the project buttons
            if (isProjectContainer) {
                const projectId = controlElement.dataset.projectId;
                const project = Projects.findById(projectId);

                if (target === editBtn || target === editIcon) {
                    // Handle edit project
                    console.log('Edit project', projectId);
                } else if (target === deleteBtn || target === deleteIcon) {
                    // Handle delete project
                    console.log('Delete project', project.id);
                    confirmDeleteDialogControls(project);
                    setDialogEntity('Project');
                    confirmDeleteDialog.showModal();
                }
            } else {
                // Controls for the todo buttons
                const todoId = controlElement.dataset.todoId;
                const todo = Todos.findById(todoId);

                if (target === chevronBtn || target === chevronIcon) {
                    // Handle expand/collapse card
                    if (target.alt === 'expand') {
                        const expandedCardContainerForm = document.createElement('form');
                        chevronIcon.src = chevronUpSvg;
                        chevronIcon.alt = 'collapse';
                        expandedCardContainerForm.classList.add('expanded-card', 'open');
                        controlElement.appendChild(createExpandedCard(expandedCardContainerForm, todo));
                        const formButtons = expandedCardContainerForm.querySelector('.form-control__buttons');

                        formButtons.addEventListener('click', (e) => {
                            e.preventDefault();
                            const target = e.target;
                            console.log(target.id)
                            const dueDateElement = controlElement.querySelector('#project-item__due-date');

                            if (target.id === 'expanded-save-btn') {
                                const formData = new FormData(expandedCardContainerForm);
                                console.log([...formData]);
                                const activeProjectButton = document.querySelector('#projects__list button.active');
                                const newDescription = appController.cleanData(formData.get('todo-description') ?? todo.description);
                                const newDueDate = appController.cleanData(formData.get('todo-due-date') ?? todo.dueDate);
                                const newPriority = appController.cleanData(formData.get('priority-user-choice') ?? todo.priority);
                                const oldDueDate = todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : null;
                                const oldPriority = todo.priority;

                                const data = {
                                    newDescription: newDescription || null,
                                    newDueDate: newDueDate || null,
                                    newPriority: newPriority
                                };

                                todo.edit(data);

                                if (activeProjectButton) {
                                    if (newDueDate !== oldDueDate) {
                                        dueDateElement.textContent = newDueDate ? new Date(newDueDate).toLocaleDateString() : 'No due date';
                                    }

                                    if (newPriority !== oldPriority) {
                                        const priorityElement = controlElement.querySelector('#project-item__priority');
                                        priorityElement.textContent = newPriority;
                                    }
                                }
                                appController.toast('✓ Todo Updated Successfully!', 'success');
                            } else if (target.id === 'expanded-complete-btn') {
                                console.log(controlElement);
                                todo.toggleComplete();
                                const checkboxElement = controlElement.querySelector('#project-item__select');
                                const dueDateElement = controlElement.querySelector('.form-control__duedate #todo-due-date');

                                if (todo.completed) {
                                    checkboxElement.checked = true;
                                    checkboxElement.disabled = true;
                                    dueDateElement.disabled = true;
                                    // dueDateElement.classList.add('completed');
                                    controlElement.classList.add('completed');
                                } else {
                                    checkboxElement.checked = false;
                                    checkboxElement.disabled = false;
                                    dueDateElement.disabled = false;
                                    // dueDateElement.classList.remove('completed');
                                    controlElement.classList.remove('completed');
                                }

                                appController.toast('✓ Todo Marked as ' + (todo.completed ? 'Complete' : 'Incomplete') + '!', 'success');

                                target.textContent = todo.completed ? 'Mark as Incomplete' : 'Mark as Complete';
                            } else if (target.id === 'expanded-delete-btn') {
                                confirmDeleteDialogControls(todo);
                                confirmDeleteDialog.showModal();
                            }
                        });
                    } else {
                        chevronIcon.src = chevronDownSvg;
                        chevronIcon.alt = 'expand';
                        const expandedCard = controlElement.querySelector('.expanded-card')
                        console.log(controlElement);
                        controlElement.removeChild(expandedCard);
                    }
                } else if (target === editBtn || target === editIcon) {
                    // Handle delete todo show dialog asking user to delete
                    editTodoDialogControls(todo);
                    const dueDate = document.querySelector('#edit-todo-due-date');
                    document.querySelector('#edit-todo-title').value = todo.title;
                    document.querySelector('#edit-todo-description').value = todo.description;
                    dueDate.value = todo.dueDate
                        ? new Date(todo.dueDate).toISOString().split('T')[0]
                        : '';
                    document.querySelector('#edit-todo-priority').value = todo.priority;
                    document.querySelector('#edit-todo-project').value = todo.projectId;

                    if (todo.completed) {
                        dueDate.disabled = true;
                    }

                    editTodoDialog.showModal();
                } else if (target === deleteBtn || target === deleteIcon) {
                    // Handle delete todo
                    confirmDeleteDialogControls(todo);
                    setDialogEntity('Todo');
                    confirmDeleteDialog.showModal();
                }
            }

        });
    }

    /**
    * @param {string} projectId - Project ID
    * @param {string} searchTerm - User title search term
    */
    const renderProjectItems = (projectId, searchTerm = '') => {
        const todos = !searchTerm ? Todos.findAllByProject(projectId) : Todos.findByTitleAndProject(searchTerm, projectId);
        const projectItemsContainer = document.querySelector('.project-items__todos');
        projectItemsContainer.innerHTML = '';

        // Only render items if they exist
        if (todos.length <= 0) {
            return
        }

        todos.forEach((todo) => {
            //console.log(todo);
            const projectItem = document.createElement('div');
            projectItem.dataset.todoId = todo.id;
            projectItem.classList.add('todo', 'project-items__todo', 'todo-grid');

            const projectItemCheckBox = document.createElement('input');
            projectItemCheckBox.type = 'checkbox';
            projectItemCheckBox.id = 'project-item__select';
            projectItemCheckBox.dataset.todoId = todo.id;
            projectItemCheckBox.name = 'project-item__select';

            if (todo.completed) {
                projectItemCheckBox.checked = true;
                projectItemCheckBox.disabled = true;
                projectItem.classList.add('completed');
            }

            const projectItemTitle = document.createElement('span');
            projectItemTitle.textContent = todo.title;
            projectItemTitle.classList.add('todo-title');

            const projectItemDueDate = document.createElement('span');
            projectItemDueDate.id = 'project-item__due-date';
            projectItemDueDate.textContent = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';

            const projectItemPriority = document.createElement('span');
            projectItemPriority.id = 'project-item__priority';
            projectItemPriority.textContent = todo.priority;

            projectItem.append(
                projectItemCheckBox,
                projectItemTitle,
                projectItemDueDate,
                projectItemPriority
            );

            projectItemTitle.addEventListener('click', (e) => {
                const target = e.target;

                if (target.classList.contains('todo-title')) {
                    //const todoId = todo.id;
                    const revertTarget = target;
                    let isSubmitting = false;
                    //const todo = Todos.findById(todoId);
                    const todoInput = document.createElement('input');
                    todoInput.type = 'text';
                    todoInput.value = todo.title;
                    target.replaceWith(todoInput);
                    todoInput.focus();
                    todoInput.select();

                    todoInput.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            isSubmitting = true;
                            const newTitle = todoInput.value.trim();
                            if (newTitle.length === 0) {
                                this.replaceWith(revertTarget);
                                alert('Title cannot be empty');
                            }

                            if (newTitle && newTitle !== todo.title) {
                                try {
                                    // Prevent the blur event from firing when the user is submitting the form with Enter or Escape
                                    todo.edit({ newTitle: newTitle });
                                    revertTarget.textContent = todo.title;
                                } catch (error) {
                                    alert(error.message);
                                }
                            }
                            this.replaceWith(revertTarget);
                        }

                        if (e.key === 'Escape' && !e.shiftKey) {
                            isSubmitting = true;
                            console.log('Escape pressed');
                            this.replaceWith(revertTarget);
                        }
                    });

                    todoInput.addEventListener('blur', function (e) {
                        if (isSubmitting) {
                            isSubmitting = false;
                            return;
                        }

                        const newTitle = todoInput.value.trim();
                        if (newTitle.length === 0) {
                            alert('Title cannot be empty');
                        }
                        if (newTitle && newTitle !== todo.title) {
                            e.preventDefault();
                            todo.edit({ newTitle: newTitle });
                            revertTarget.textContent = todo.title;
                        }
                        this.replaceWith(revertTarget);
                    });
                }
            });

            applicationControlButtons(projectItem);

            projectItemsContainer.appendChild(projectItem);
        })
    }

    /**
     * Renders the project title and project items
     */
    const renderProjectTitleAndItems = () => {
        const projectSpan = document.querySelector('.project-items__title #project-title');
        projectsList = document.querySelector('#projects__list');
        projectsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('project')) {
                const target = e.target;
                projectSpan.textContent = target.textContent;
                renderProjectItems(target.dataset.projectId);
            }
        });

        const firstProjectId = projectsList.hasChildNodes()
            ? projectsList.firstChild.dataset.projectId
            : null;

        if (firstProjectId) {
            const firstProject = Projects.findById(firstProjectId);
            projectSpan.textContent = firstProject.name;
            renderProjectItems(firstProject.id);
        } else {
            projectSpan.textContent = 'No Projects';
            document.querySelector('.project-items__todos').innerHTML = '';
        }
    }

    createProjectDialogControls();
    createTodoDialogControls();
    renderProjects();
    renderProjectTitleAndItems();
    appSearch();
    projectsButtonHelper();
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
