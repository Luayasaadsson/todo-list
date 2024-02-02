
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

  if (text) {
    const newTodo: Todo = { id: Date.now(), text, completed: false, editing: false };
    todos.push(newTodo);
    input.value = '';
    renderTodos();
  }
}

function deleteTodo(id: number): void {
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    renderTodos();
  }
}

function toggleTodo(id: number): void {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

function clearTodos(): void {
  todos.length = 0;
  renderTodos();
}

function renderTodos(): void {
  const list = document.getElementById('todo-list') as HTMLUListElement;
  list.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = todo.completed;
    checkBox.addEventListener('change', () => toggleTodo(todo.id));

    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.className = todo.completed ? 'completed' : '';
    if (todo.editing) {
      textSpan.contentEditable = 'true';
      textSpan.focus();
    } else {
      textSpan.contentEditable = 'false';
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-btn';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    const editButton = document.createElement('button');
    editButton.textContent = todo.editing ? 'Save' : 'Edit';
    editButton.className = 'edit-btn';
    editButton.addEventListener('click', () => editTodo(todo.id, textSpan));

    li.appendChild(checkBox);
    li.appendChild(textSpan);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    list.appendChild(li);
  });
}

function editTodo(id: number, textSpan: HTMLSpanElement): void {
  const todo = todos.find(todo => todo.id === id);
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
