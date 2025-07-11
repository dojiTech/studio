document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    let tasks = []; // Array to hold tasks

    function renderTasks() {
        taskList.innerHTML = ''; // Clear current list
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.textContent = task.description;
            if (task.completed) {
                listItem.classList.add('completed');
            }

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.addEventListener('click', () => {
                task.completed = !task.completed;
                renderTasks();
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                renderTasks();
            });

            listItem.appendChild(completeButton);
            listItem.appendChild(deleteButton);

            taskList.appendChild(listItem);
        });
    }

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        const taskDescription = taskInput.value.trim();

        if (taskDescription !== '') {
            tasks.push({ description: taskDescription, completed: false }); // Add task to array
            renderTasks(); // Update the display

            taskInput.value = ''; // Clear the input field
        }
    });

});