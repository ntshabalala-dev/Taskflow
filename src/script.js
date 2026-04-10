import Project from './Entities/project.js';
import Todo from './Entities/todo.js';

(new Project('Test'));
(new Project('Test2'));

console.log(localStorage.getItem('projects'));

/* let a = new Todo('Test', 'This is a test todo', 'Test Project');
let b = new Todo('Test2', 'This is another test todo', 'Test Project');
let c = new Todo('Test3', 'This is a third test todo', 'Test Project');

//console.log(localStorage.getItem('todos'));
let s = localStorage.getItem('todos');
console.log(JSON.parse(s));

b.edit('Test3 Edited', 'This is an edited test todo', 'Test Project Edited');

s = localStorage.getItem('todos');
console.error(JSON.parse(s));

b.delete();

s = localStorage.getItem('todos');
console.log(JSON.parse(s));

localStorage.clear(); */

