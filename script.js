// import time
let time = document.getElementById("current-time");

setInterval(() =>{
    let d = new Date();
    time.innerHTML = d.toLocaleTimeString();
},1000)

// import greeting
function greeting(){
    const now = new Date();
    const time = now.getHours();
    let text;

    if (time >= 4 && time < 11){
        text = "Good Morning";
    } else if (time >= 11 && time < 18){
        text = "Good Afternoon"
    } else {
        text = "Good Evening"
    }

    const name = localStorage.getItem('userName');
    document.getElementById("greeting").textContent = name ? `${text}, ${name}!` : text;
}
greeting();

// name input
const nameInput = document.getElementById('nameInput');
const nameBtn = document.getElementById('nameBtn');

// pre-fill input if name already saved
const savedName = localStorage.getItem('userName');
if (savedName) nameInput.value = savedName;

nameBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem('userName', name);
    } else {
        localStorage.removeItem('userName');
    }
    greeting();
});

nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') nameBtn.click();
});

// import full date
function fullDate(){
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const today = new Date();

    document.getElementById("full-date").innerText = today.toLocaleDateString('en-US',options);
}
fullDate();

// function timer
const totalSec = 25 * 60;
let reminSec = totalSec;
let intervalId = null;

const timer = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

function updateTimer(){
    const minute = Math.floor(reminSec / 60);
    const second = reminSec % 60;
    timer.textContent = String(minute).padStart(2,'0') + ':' + String(second).padStart(2,'0');
}

function countDown(){
    if (reminSec > 0){
        reminSec--;
        updateTimer();

        if (reminSec == 0){
            clearInterval(intervalId);
            intervalId = null;
            alert('Finish!');
        }
    }
}

startBtn.addEventListener('click', () => {
    if (intervalId !== null || reminSec <= 0) return;
    intervalId = setInterval(countDown, 1000);
});

pauseBtn.addEventListener('click', () => {
    if (intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }
});

resetBtn.addEventListener('click', () => {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    reminSec = totalSec;
    updateTimer();
});

updateTimer();

// todolist
const taskInput   = document.getElementById('taskInput');
const addTaskBtn  = document.getElementById('addTaskBtn');
const taskList    = document.getElementById('taskList');

let currentFilter = 'all'; // 'all' | 'active' | 'done'

// Load tasks from localStorage, default to empty array
function loadTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

// Save tasks array to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render all tasks from storage
function renderTasks() {
    const tasks = loadTasks();

    // Apply filter
    const filtered = tasks.filter(t => {
        if (currentFilter === 'active') return !t.done;
        if (currentFilter === 'done')   return t.done;
        return true;
    });

    taskList.innerHTML = '';

    if (filtered.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'task-empty';
        empty.textContent = tasks.length === 0 ? 'No task' : 'No task in this category';
        taskList.appendChild(empty);
        return;
    }

    filtered.forEach((task) => {
        // Use the real index in the full tasks array for toggle/delete
        const realIndex = tasks.indexOf(task);

        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' task-done' : '');

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => toggleTask(realIndex));

        // Label
        const label = document.createElement('span');
        label.className = 'task-label';
        label.textContent = task.text;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(realIndex));

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const tasks = loadTasks();
    const duplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());

    if (duplicate) {
        showTaskAlert('Task already exists!');
        return;
    }

    tasks.push({ text, done: false });
    saveTasks(tasks);
    taskInput.value = '';
    clearTaskAlert();
    renderTasks();
}

// Show inline alert
function showTaskAlert(message) {
    const alert = document.getElementById('taskAlert');
    alert.textContent = message;
    alert.style.display = 'block';
}

// Clear inline alert
function clearTaskAlert() {
    const alert = document.getElementById('taskAlert');
    alert.textContent = '';
    alert.style.display = 'none';
}

// Toggle done/undone
function toggleTask(index) {
    const tasks = loadTasks();
    tasks[index].done = !tasks[index].done;
    saveTasks(tasks);
    renderTasks();
}

// Delete a task
function deleteTask(index) {
    const tasks = loadTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});
taskInput.addEventListener('input', clearTaskAlert);

renderTasks();

// Function Quick Link
const linkNameInput = document.getElementById('linkName');
const linkUrlInput  = document.getElementById('linkUrl');
const saveLinkBtn   = document.getElementById('saveLinkBtn');
const linkList      = document.getElementById('linkList');
const linkAlertEl   = document.getElementById('linkAlert');

function loadLinks() {
    return JSON.parse(localStorage.getItem('quickLinks') || '[]');
}

function saveLinks(links) {
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

function isValidUrl(str) {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function showLinkAlert(message) {
    linkAlertEl.textContent = message;
    linkAlertEl.style.display = 'block';
}

function clearLinkAlert() {
    linkAlertEl.textContent = '';
    linkAlertEl.style.display = 'none';
}

function renderLinks() {
    const links = loadLinks();
    linkList.innerHTML = '';

    if (links.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'link-empty';
        empty.textContent = 'No link added';
        linkList.appendChild(empty);
        return;
    }

    links.forEach((link, index) => {
        const item = document.createElement('div');
        item.className = 'link-item';

        // Visit button
        const visitBtn = document.createElement('a');
        visitBtn.className = 'link-visit';
        visitBtn.href = link.url;
        visitBtn.target = '_blank';
        visitBtn.rel = 'noopener noreferrer';
        visitBtn.textContent = link.name;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'link-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteLink(index));

        item.appendChild(visitBtn);
        item.appendChild(deleteBtn);
        linkList.appendChild(item);
    });
}

function saveLink() {
    const name = linkNameInput.value.trim();
    const url  = linkUrlInput.value.trim();

    if (!name || !url) {
        showLinkAlert('Please fill in both fields.');
        return;
    }

    if (!isValidUrl(url)) {
        showLinkAlert('Link not valid. Please enter a URL starting with http:// or https://');
        return;
    }

    const links = loadLinks();
    links.push({ name, url });
    saveLinks(links);

    linkNameInput.value = '';
    linkUrlInput.value  = '';
    clearLinkAlert();
    renderLinks();
}

function deleteLink(index) {
    const links = loadLinks();
    links.splice(index, 1);
    saveLinks(links);
    renderLinks();
}

saveLinkBtn.addEventListener('click', saveLink);
linkUrlInput.addEventListener('input', clearLinkAlert);
linkNameInput.addEventListener('input', clearLinkAlert);

renderLinks();