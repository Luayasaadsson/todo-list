type Todo = {
  id: number; // Unikt identifieringsnummer för varje todo.
  text: string;  // Texten för todo-posten.
  completed: boolean; // Anger om todo-posten är klar eller inte.
  editing?: boolean; // Flagga för redigering (valfri).
  createdAt: string; // Tidpunkt då todo-posten skapades.
};

let todos: Todo[] = []; // Array för att lagra alla todos.

// Funktion för att spara todos i localStorage.
function saveTodos(): void {
  try {
    localStorage.setItem('todos', JSON.stringify(todos)); // Sparar todos i webbläsarens localStorage.
  } catch (error) {
    console.error('Ett fel uppstod när todos skulle sparas i localStorage:', error); 
  }
}

// Funktion som körs när DOM:en har laddats.
document.addEventListener('DOMContentLoaded', () => {
  const addButton: HTMLButtonElement = document.getElementById('add-btn') as HTMLButtonElement;
  const clearButton: HTMLButtonElement = document.getElementById('clear-btn') as HTMLButtonElement;
  const newTodoInput: HTMLInputElement = document.getElementById('new-todo') as HTMLInputElement;
  const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;

  // Laddar todos från localStorage vid sidans laddning.
  todos = JSON.parse(localStorage.getItem("todos") || "[]") as Todo[];

   // Lägger till händelselyssnare för knappar och inmatningsfält.
  addButton.addEventListener('click', addTodo);
  clearButton.addEventListener('click', clearTodos);
  searchInput.addEventListener("input", searchTodos);

  // Lägger till en händelselyssnare för att lägga till en todo när användaren trycker på Enter i inmatningsfältet.
  newTodoInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  renderTodos();  // Renderar todos när sidan laddas.
});

// Funktion för att lägga till en ny todo.
function addTodo(): void {
  // Hämtar referens till inmatningsfältet för nya todos.
  const input: HTMLInputElement = document.getElementById('new-todo') as HTMLInputElement;
  const text: string = input.value.trim();

  // Kontrollerar om texten är tom.
  if (!text) {
    alert("Lägg till en todo först."); // Visar ett meddelande om inmatningsfältet är tomt.
  } else {
    // Annars skapar en ny todo-post.
    const now: Date = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const time: string = now.toLocaleTimeString('sv-SE', timeOptions);
    const date: string = now.toLocaleDateString('sv-SE', dateOptions);
    const createdAt: string = `${time} ${date}`;

      // Skapar en ny todo-post och lägger till den i todos-arrayen
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      editing: false,
      createdAt
    };
    todos.unshift(newTodo); // Lägger till den nya todo-posten i början av listan.
    input.value = ""; // Återställer inmatningsfältet.
    renderTodos(); // Renderar todos.
    saveTodos(); // Sparar todos.
  }
}

// Funktion för att ta bort en todo.
function deleteTodo(id: number): void {
  // Hittar todo-posten med det givna id:t.
  const todo: Todo | undefined = todos.find((todo: Todo) => todo.id === id);
  if (todo) {
    // Fråga till användaren om de är säkra på att de vill ta bort todo-posten.
    const confirmDelete: boolean = confirm(`Är du säker på att du vill ta bort todo: "${todo.text}"?`);
    if (confirmDelete) {
        // Tar bort todo-posten från arrayen.
      const index: number = todos.findIndex((todo: Todo) => todo.id === id);
      if (index !== -1) {
        todos.splice(index, 1);
        renderTodos(); // Renderar todos
        saveTodos(); // Sparar todos
      }
    }
  }
}
// Funktion för att markera en todo som klar eller ej klar.
function toggleTodo(id: number): void {
  // Hittar todo-posten med det givna id:t
  const todo: Todo | undefined = todos.find((todo: Todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;  // Ändrar statusen för todo-posten.
    renderTodos(); // Renderar todos
    saveTodos(); // Sparar todos
  }
}
// Funktion för att rensa hela todo-listan.
function clearTodos(): void {
  if (todos.length === 0) {
    alert("Det finns inga todos att rensa."); // Visar ett meddelande om det inte finns några todos att rensa.
  } else {
     // Fråga till användaren om de är säkra på att de vill rensa hela listan.
    const confirmClear: boolean = confirm("Är du säker på att du vill rensa hela todo-listan?");
    if (confirmClear) {
      todos = []; // Tömmer todos-arrayen.
      renderTodos(); // Renderar todos.
      saveTodos(); // Sparar todos.
    }
  }
}
// Funktion för att söka efter todos.
function searchTodos() {
  const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;
  const searchTerm: string = searchInput.value.toLowerCase(); // Hämtar söktermen och gör om den till gemener.
  const filteredTodos: Todo[] = searchTerm
    ? todos.filter(todo => todo.text.toLowerCase().includes(searchTerm)) 
    : todos;

  renderTodos(filteredTodos);  // Renderar filtrerade todos.
}
// Funktion för att rendera todos.
function renderTodos(filteredTodos: Todo[] = todos): void {
  const list: HTMLUListElement = document.getElementById('todo-list') as HTMLUListElement;
  list.innerHTML = ''; // Rensar listan för att undvika dubbletter.

  // Om ingen todo hittas, skriver ut ett meddelande.
  if (filteredTodos.length === 0) {
    const noResultLi: HTMLLIElement = document.createElement("li");
    noResultLi.textContent = todos.length === 0 ? "Todo listan är tom" : "Ingen matchning";
    list.appendChild(noResultLi);
  } else {
    // Annars renderas matchande todos som vanligt.
    filteredTodos.forEach((todo: Todo) => {
       // Skapar HTML-element för varje todo-post.
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

       // Lägger till HTML-element till listan.
      li.appendChild(createdAtSpan);
      li.appendChild(checkBox);
      li.appendChild(textSpan);
      li.appendChild(todoButtons);
      list.appendChild(li);
    });
  }
}
// Funktion för att redigera en todo.
function editTodo(id: number, textSpan: HTMLSpanElement): void {
  // Hittar todo-posten med det givna id:t.
  const todo: Todo | undefined = todos.find((todo) => todo.id === id);
  if (todo) {
    if (todo.editing) {
      todo.text = textSpan.textContent || todo.text; // Uppdaterar texten för todo-posten.
      todo.editing = false; // Avslutar redigeringsläget.
    } else {
      todos.forEach((otherTodo) => {
        otherTodo.editing = false;  // Avslutar redigeringsläget för alla andra todos.
      });
      todo.editing = true; // Aktiverar redigeringsläget för den aktuella todo-posten.
    }
    renderTodos(); // Renderar todos.
    saveTodos(); // Sparar todos.
  }
}
