

import { todoManager } from './toDoManager.js';

const todosContainer=document.getElementById('todos-container');
const form=document.getElementById('todo-form');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoModal = document.getElementById('todo-modal');
const cancelTodoBtn = document.getElementById('cancel-todo');
const themeToggle = document.getElementById('theme-toggle');
const modalTitle = document.getElementById('modal-title');


// Function to get and load todos
async function loadTodos(){
    const todos=await todoManager.getTodos();
    renderTodos(todos);
}

// Function to show todos on the page

function renderTodos(todos){ 
    todosContainer.innerHTML = '';
    todosContainer.classList.remove('loading');
    // If there are no todos return.
    if (!todos.length) {
        todosContainer.innerHTML = '<p>No tasks yet</p>';
        return;
    }

    todos.forEach(todo => {
        todosContainer.innerHTML += `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <h3>${todo.title}</h3>
                <p>${todo.description || ''}</p>
                <small>${todo.category} | ${todo.dueDate || ''}</small>
                <button class="edit" data-id="${todo.id}">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
    });

}

//Event listner to add to do button and cance button.



addTodoBtn.addEventListener('click', () => {
  form.reset();
  todoModal.classList.remove('hidden');
  document.getElementById('todo-title').focus();
});

cancelTodoBtn.addEventListener('click', () => {
    if (form.dataset.editId) {
        delete form.dataset.editId;
    }
    form.reset();
    todoModal.classList.add('hidden');
});

// Event listner to submit todos

form.addEventListener('submit',async (e)=>{

    e.preventDefault();

    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value;
    const category = document.getElementById('todo-category').value;
    const dueDate = document.getElementById('todo-due-date').value;

    if (!title) return;

    const editId = form.dataset.editId;

    if (editId) {
        // Update existing todo
        await todoManager.updateTodo(editId, { 
            title, 
            description, 
            category, 
            dueDate 
        });
        // Clear the edit ID
        delete form.dataset.editId;
    } else {
        // Add new todo
        await todoManager.addTodo({ 
            title, 
            description, 
            category, 
            dueDate 
        });
    }
   
    form.reset();
    todoModal.classList.add('hidden');
    loadTodos();
});

// Event listner to toggle,edit or delete 

todosContainer.addEventListener('click', async e => {
    const item = e.target.closest('.todo-item');
    if (!item) return;

    const id = item.dataset.id;

    if (e.target.type === 'checkbox') {
        await todoManager.toggleTodo(id, e.target.checked);
    }

    if (e.target.classList.contains('delete')) {
        await todoManager.deleteTodo(id);
        loadTodos();
    }

    if (e.target.classList.contains('edit')) {
        // Find the todo to edit
        const todo = await todoManager.getTodo(id);
        if (!todo) return;
        
        // Populate the form with todo data
        document.getElementById('todo-title').value = todo.title;
        document.getElementById('todo-description').value = todo.description || '';
        document.getElementById('todo-category').value = todo.category;
        document.getElementById('todo-due-date').value = todo.dueDate || '';
        
        // Store the todo ID in a hidden field or data attribute
        form.dataset.editId = id;
        
        // Show the modal
        todoModal.classList.remove('hidden');
        document.getElementById('todo-title').focus();
    }

    
});


document.addEventListener('DOMContentLoaded',loadTodos);
// Dark theme functions

function applyDarkTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.textContent = '🌙 Dark Mode';
    }
}

function toggleTheme() {
    const isDark = !document.body.classList.contains('dark-theme');
    applyDarkTheme(isDark);
    localStorage.setItem('darkTheme', isDark);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        applyDarkTheme(true);
    } else {
        applyDarkTheme(false);
    }
}
themeToggle.addEventListener('click', toggleTheme);
loadTheme();