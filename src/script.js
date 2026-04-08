import Project from './Entities/project.js';
import Todo from './Entities/todo.js';

(new Project('Test'));
(new Project('Test2'));

console.log(localStorage.getItem('projects'));

let a = new Todo('Test', 'This is a test todo', 'Test Project');
let b = new Todo('Test2', 'This is another test todo', 'Test Project');

console.log(localStorage.getItem('todos'));
const $s = localStorage.getItem('todos');
console.log(JSON.parse($s));

localStorage.clear();

