type Todo = {
  id: number;
  text: string;
  completed: boolean;
  editing?: boolean; // Lägger till en valfri flagga för redigering
};

const todos: Todo[] = [];

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-btn') as HTMLButtonElement;
  const clearButton = document.getElementById('clear-btn') as HTMLButtonElement;
  const newTodoInput = document.getElementById('new-todo') as HTMLInputElement;

  addButton.addEventListener('click', addTodo);
  clearButton.addEventListener('click', clearTodos);

  // Lägger till todos när användaren trycker på Enter
  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  renderTodos();
});

function addTodo(): void {
  const input = document.getElementById('new-todo') as HTMLInputElement;
  const text = input.value.trim();

  if (!text) {
    alert("Det finns inga todos att lägga till.");
  } else {
    const newTodo: Todo = { id: Date.now(), text, completed: false, editing: false };
    todos.unshift(newTodo);
    input.value = '';
    renderTodos();
  }
}

function deleteTodo(id: number): void {
  const index: number = todos.findIndex((todo: Todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    renderTodos();
  }
}

function toggleTodo(id: number): void {
  const todo: Todo | undefined = todos.find((todo: Todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

function clearTodos(): void {
  if (todos.length === 0) {
    alert("Det finns inga todos att rensa.");
  } else {
    todos.length = 0;
    renderTodos();
  }
}

function renderTodos(): void {
  const list: HTMLElement = document.getElementById('todo-list') as HTMLUListElement;
  list.innerHTML = '';

  todos.forEach((todo: Todo) => {
    const li: HTMLElement = document.createElement('li');
    const checkBox: HTMLInputElement = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = todo.completed;
    checkBox.addEventListener('change', () => toggleTodo(todo.id));

    const textSpan: HTMLSpanElement = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.className = todo.completed ? 'completed' : '';
    textSpan.contentEditable = todo.editing ? 'true' : 'false';

    const deleteButton: HTMLButtonElement = document.createElement('button');
    deleteButton.className = 'todo-btn';
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));
    
    const editButton: HTMLButtonElement = document.createElement('button');
    editButton.className = 'todo-btn';
    editButton.innerHTML = todo.editing ? '<i class="fa-regular fa-bookmark"></i>' : '<i class="fa-regular fa-pen-to-square"></i>'; 
    editButton.addEventListener('click', () => editTodo(todo.id, textSpan));
    

    const todoButtons: HTMLDivElement = document.createElement('div');
    todoButtons.className = 'todo-buttons'; 
    todoButtons.appendChild(editButton);
    todoButtons.appendChild(deleteButton);

    li.appendChild(checkBox);
    li.appendChild(textSpan);
    li.appendChild(todoButtons); 
    list.appendChild(li);
  });
}

function editTodo(id: number, textSpan: HTMLSpanElement): void {
  const todo: Todo | undefined = todos.find((todo) => todo.id === id);
  if (todo) {
    if (todo.editing) {
      todo.text = textSpan.textContent || todo.text;
      todo.editing = false;
    } else {
      todo.editing = true;
    }
    renderTodos();
  }
}
