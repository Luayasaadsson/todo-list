type Todo = {
  id: number;
  text: string;
  completed: boolean;
  editing?: boolean; // Flagga för redigering (valfri)
  createdAt: string;
};

let todos: Todo[] = [];

// Funktion för att spara todos i localStorage
function saveTodos(): void {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch (error) {
    console.error('Ett fel uppstod när todos skulle sparas i localStorage:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addButton: HTMLButtonElement = document.getElementById('add-btn') as HTMLButtonElement;
  const clearButton: HTMLButtonElement = document.getElementById('clear-btn') as HTMLButtonElement;
  const newTodoInput: HTMLInputElement = document.getElementById('new-todo') as HTMLInputElement;
  const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;

  // Laddar todos från localStorage vid sidans laddning
  todos = JSON.parse(localStorage.getItem("todos") || "[]") as Todo[];

  addButton.addEventListener('click', addTodo);
  clearButton.addEventListener('click', clearTodos);
  searchInput.addEventListener("input", searchTodos);

  // Lägger till todos när användaren trycker på Enter
  newTodoInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  renderTodos();
});

function addTodo(): void {
  const input: HTMLInputElement = document.getElementById('new-todo') as HTMLInputElement;
  const text: string = input.value.trim();

  if (!text) {
    alert("Lägg till en todo först.");
  } else {
    const now: Date = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const time: string = now.toLocaleTimeString('sv-SE', timeOptions);
    const date: string = now.toLocaleDateString('sv-SE', dateOptions);
    const createdAt: string = `${time} ${date}`;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      editing: false,
      createdAt
    };
    todos.unshift(newTodo);
    input.value = "";
    renderTodos();
    saveTodos();
  }
}

function deleteTodo(id: number): void {
  const todo: Todo | undefined = todos.find((todo: Todo) => todo.id === id);
  if (todo) {
    const confirmDelete = confirm(`Är du säker på att du vill ta bort todo: "${todo.text}"?`);
    if (confirmDelete) {
      const index: number = todos.findIndex((todo: Todo) => todo.id === id);
      if (index !== -1) {
        todos.splice(index, 1);
        renderTodos();
        saveTodos();
      }
    }
  }
}

function toggleTodo(id: number): void {
  const todo: Todo | undefined = todos.find((todo: Todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
    saveTodos();
  }
}

function clearTodos(): void {
  if (todos.length === 0) {
    alert("Det finns inga todos att rensa.");
  } else {
    const confirmClear = confirm("Är du säker på att du vill rensa hela todo-listan?");
    if (confirmClear) {
      todos = [];
      renderTodos();
      saveTodos();
    }
  }
}

function searchTodos() {
  const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;
  const searchTerm: string = searchInput.value.toLowerCase();
  const filteredTodos: Todo[] = searchTerm
    ? todos.filter(todo => todo.text.toLowerCase().includes(searchTerm))
    : todos;

  renderTodos(filteredTodos);
}

function renderTodos(filteredTodos: Todo[] = todos): void {
  const list: HTMLUListElement = document.getElementById('todo-list') as HTMLUListElement;
  list.innerHTML = '';

  // Om ingen todo hittas, skriver ut ett meddelande
  if (filteredTodos.length === 0) {
    const noResultLi: HTMLLIElement = document.createElement("li");
    noResultLi.textContent = todos.length === 0 ? "Todo listan är tom" : "Ingen matchning";
    list.appendChild(noResultLi);
  } else {
    // Annars renderas matchande todos som vanligt
    filteredTodos.forEach((todo: Todo) => {
      const li: HTMLElement = document.createElement('li');
      const checkBox: HTMLInputElement = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.checked = todo.completed;
      checkBox.addEventListener('change', () => toggleTodo(todo.id));

      const textSpan: HTMLSpanElement = document.createElement('span');
      textSpan.textContent = todo.text;
      textSpan.className = todo.completed ? 'completed' : '';
      textSpan.contentEditable = todo.editing ? 'true' : 'false';
      textSpan.className = todo.editing ? 'editing' : (todo.completed ? 'completed' : '');

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

      const createdAtSpan: HTMLSpanElement = document.createElement('span');
      createdAtSpan.classList.add('date-time');
      createdAtSpan.textContent = `${todo.createdAt}`;

      li.appendChild(createdAtSpan);
      li.appendChild(checkBox);
      li.appendChild(textSpan);
      li.appendChild(todoButtons);
      list.appendChild(li);
    });
  }
}

function editTodo(id: number, textSpan: HTMLSpanElement): void {
  const todo: Todo | undefined = todos.find((todo) => todo.id === id);
  if (todo) {
    if (todo.editing) {
      todo.text = textSpan.textContent || todo.text;
      todo.editing = false;
    } else {
      todos.forEach((otherTodo) => {
        otherTodo.editing = false;
      });
      todo.editing = true;
    }
    renderTodos();
    saveTodos();
  }
}
