type Todo = {
  id: number; // Unikt identifieringsnummer för varje todo.
  text: string;  // Texten för todo-posten.
  completed: boolean; // Anger om todo-posten är klar eller inte.
  editing?: boolean; // Flagga för redigering (valfri).
  createdAt: string; // Tidpunkt då todo-posten skapades.
};

let todos: Todo[] = []; // Array för att lagra alla todos.
let trash: Todo[] = []; // Array för att lagra borttagna todos.

// Funktion för att spara todos och trash i localStorage.
function saveTodos(): void {
  try {
    localStorage.setItem("todos", JSON.stringify(todos)); // Sparar todos i webbläsarens localStorage.
    localStorage.setItem("trash", JSON.stringify(trash)); // Sparar trash i webbläsarens localStorage.
  } catch (error) {
    console.error("Ett fel uppstod när todos skulle sparas i localStorage:", error); 
  }
}

// Funktion som körs när DOM:en har laddats.
document.addEventListener("DOMContentLoaded", () => {
  // Hämtar referenser till knappar och inmatningsfält.
  const addButton: HTMLButtonElement = document.getElementById("add-btn") as HTMLButtonElement;
  const clearButton: HTMLButtonElement = document.getElementById("clear-btn") as HTMLButtonElement;
  const newTodoInput: HTMLInputElement = document.getElementById("new-todo") as HTMLInputElement;
  const todoListContainer = document.querySelector(".todo-list-container") as HTMLInputElement
  const searchInput: HTMLInputElement = document.getElementById("search-input") as HTMLInputElement;
  const trashButton: HTMLButtonElement = document.getElementById("trash") as HTMLButtonElement;

  // Lägger till en händelselyssnare för att zooma in när inmatningsfältet får fokus.
  newTodoInput.addEventListener("focus", () => {
    todoListContainer.classList.remove("zoom-out");
});

// Lägger till en händelselyssnare för att zooma ut när inmatningsfältet förlorar fokus.
newTodoInput.addEventListener("blur", () => {
    todoListContainer.classList.add("zoom-out");
});

  // Lägger till händelselyssnare för knappar och inmatningsfält.
  addButton.addEventListener("click", addTodo);
  clearButton.addEventListener("click", clearTodos);
  searchInput.addEventListener("input", searchTodos);
  trashButton.addEventListener("click", openTrashModal); // Lägger till händelselyssnare för papperskorgsknappen.

  // Lägger till en händelselyssnare för att lägga till en todo när användaren trycker på Enter i inmatningsfältet.
  newTodoInput.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  // Laddar todos och trash från localStorage vid sidans laddning.
  todos = JSON.parse(localStorage.getItem("todos") || "[]") as Todo[];
  trash = JSON.parse(localStorage.getItem("trash") || "[]") as Todo[];

  renderTodos(); // Renderar todos.
});

// Funktion för att lägga till en ny todo.
function addTodo(): void {
  // Hämtar referens till inmatningsfältet för nya todos.
  const input: HTMLInputElement = document.getElementById("new-todo") as HTMLInputElement;
  const text: string = input.value.trim();

  // Kontrollerar om texten är tom.
  if (!text) {
    alert("Lägg till en todo först."); // Visar ett meddelande om inmatningsfältet är tomt.
  } else {
    const now: Date = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const time: string = now.toLocaleTimeString("sv-SE", timeOptions);
    const date: string = now.toLocaleDateString("sv-SE", dateOptions);
    const createdAt: string = `${time} ${date}`;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      editing: false,
      createdAt,
    };
    todos.unshift(newTodo); // Lägger till den nya todo-posten i början av listan.
    input.value = ""; // Återställer inmatningsfältet.
    renderTodos(); // Renderar todos.
    saveTodos(); // Sparar todos.
  }
}

// Funktion för att öppna papperskorgsmodalen.
function openTrashModal(): void {
  const modal: HTMLDivElement | null = document.getElementById("trash-modal") as HTMLDivElement;
  if (modal) {
    modal.style.display = "block";
    renderTrashList(); // Renderar listan med borttagna todos.
  }
}

// Funktion för att stänga papperskorgsmodalen.
function closeTrashModal(): void {
  const modal: HTMLDivElement | null = document.getElementById("trash-modal") as HTMLDivElement;
  if (modal) {
    modal.style.display = "none";
  }
}

// Lägger till en händelselyssnare på dokumentet för mousedown-händelsen
document.addEventListener("mousedown", (event: MouseEvent) => {
  const modal = document.getElementById("trash-modal");
  if (modal && !modal.contains(event.target as Node)) {
      closeTrashModal();
  }
});


// Lägger till händelselyssnare för att stänga modalen när användaren klickar på stängningsknappen.
document.addEventListener("DOMContentLoaded", () => {
  const closeButton: HTMLElement | null = document.querySelector(".close");
  if (closeButton) {
    closeButton.addEventListener("click", closeTrashModal);
  }
});

// Funktion för att rendera listan med borttagna todos i papperskorgen.
function renderTrashList(): void {
  const trashList: HTMLUListElement = document.getElementById("trash-list") as HTMLUListElement;
  trashList.innerHTML = ""; // Rensar listan för att undvika dubbletter.

  trash.forEach((todo: Todo) => {
    const trashItem: HTMLLIElement = document.createElement("li");
    trashItem.textContent = todo.text;

    // Lägger till knappar för återställning och radering av todos från papperskorgen.
    const restoreButton: HTMLButtonElement = document.createElement("button");
    restoreButton.textContent = "Återställ";
    restoreButton.classList.add("restore-btn");
    restoreButton.addEventListener("click", () => restoreTodoFromTrash(todo.id));

    const deleteButton: HTMLButtonElement = document.createElement("button");
    deleteButton.textContent = "Radera";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => deleteTodoPermanently(todo.id));

    trashItem.appendChild(restoreButton);
    trashItem.appendChild(deleteButton);
    trashList.appendChild(trashItem);
  });
}

// Funktion för att återställa en todo från papperskorgen.
function restoreTodoFromTrash(id: number): void {
  const index: number = trash.findIndex((todo: Todo) => todo.id === id);
  if (index !== -1) {
    const restoredTodo: Todo = trash.splice(index, 1)[0];
    todos.unshift(restoredTodo); // Lägger tillbaka den återställda todo i todos-arrayen.
    renderTodos(); // Renderar todos.
    saveTodos(); // Sparar todos.
    renderTrashList(); // Uppdaterar listan i papperskorgen.
  }
}

// Funktion för att radera en todo permanent från papperskorgen.
function deleteTodoPermanently(id: number): void {
  const index: number = trash.findIndex((todo: Todo) => todo.id === id);
  if (index !== -1) {
    trash.splice(index, 1); // Tar bort den valda todo från trash-arrayen.
    saveTodos(); // Sparar ändringar i trash-arrayen till localStorage.
    renderTrashList(); // Uppdaterar listan i papperskorgen.
  }
}

// Funktion för att ta bort en todo.
function deleteTodo(id: number): void {
  const trashButton: HTMLButtonElement = document.getElementById("trash") as HTMLButtonElement;
  trashButton.classList.add('vibrate-animation'); // Lägger till animationsklassen för att få papperskorgen att vibrera.

  // Hittar todo-posten med det givna id:t.
  const todo: Todo | undefined = todos.find((todo: Todo) => todo.id === id);
  if (todo) {
    // Tar bort todo-posten från arrayen och lägger den i papperskorgen.
    const index: number = todos.findIndex((todo: Todo) => todo.id === id);
    if (index !== -1) {
      const deletedTodo: Todo = todos.splice(index, 1)[0];
      trash.unshift(deletedTodo); // Lägger den borttagna todo i papperskorgen.
      renderTodos(); // Renderar todos.
      saveTodos(); // Sparar todos.
      renderTrashList(); // Uppdaterar listan i papperskorgen.

      // Återställer papperskorgsikonen efter en kort fördröjning
      setTimeout(() => {
        trashButton.classList.remove('vibrate-animation');
      }, 500);
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
function searchTodos(): void {
  const searchInput: HTMLInputElement = document.getElementById("search-input") as HTMLInputElement;
  const searchTerm: string = searchInput.value.toLowerCase(); // Hämtar söktermen och gör om den till gemener.
  const filteredTodos: Todo[] = searchTerm
    ? todos.filter(todo => todo.text.toLowerCase().includes(searchTerm)) 
    : todos;

  renderTodos(filteredTodos);  // Renderar filtrerade todos.
}

// Funktion för att rendera todos.
function renderTodos(filteredTodos: Todo[] = todos): void {
  const list: HTMLUListElement = document.getElementById("todo-list") as HTMLUListElement;
  list.innerHTML = ""; // Rensar listan för att undvika dubbletter.

  // Om ingen todo hittas, skriver ut ett meddelande.
  if (filteredTodos.length === 0) {
    const noResultLi: HTMLLIElement = document.createElement("li");
    noResultLi.textContent = todos.length === 0 ? "Todo listan är tom" : "Ingen matchning";
    list.appendChild(noResultLi);
  } else {
    // Annars renderas matchande todos som vanligt.
    filteredTodos.forEach((todo: Todo) => {
       // Skapar HTML-element för varje todo-post.
      const li: HTMLElement = document.createElement("li");
      const checkBox: HTMLInputElement = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.checked = todo.completed;
      checkBox.addEventListener("change", () => toggleTodo(todo.id));

      const textSpan: HTMLSpanElement = document.createElement("span");
      textSpan.textContent = todo.text;
      textSpan.className = todo.completed ? "completed" : "";
      textSpan.contentEditable = todo.editing ? "true" : "false";
      textSpan.className = todo.editing ? "editing" : (todo.completed ? "completed" : "");

      const deleteButton: HTMLButtonElement = document.createElement("button");
      deleteButton.className = "todo-btn";
      deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));

      const editButton: HTMLButtonElement = document.createElement("button");
      editButton.className = "todo-btn";
      editButton.innerHTML = todo.editing ? '<i class="fa-regular fa-bookmark"></i>' : '<i class="fa-regular fa-pen-to-square"></i>';
      editButton.addEventListener('click', () => editTodo(todo.id, textSpan));

      const todoButtons: HTMLDivElement = document.createElement("div");
      todoButtons.className = "todo-buttons";
      todoButtons.appendChild(editButton);
      todoButtons.appendChild(deleteButton);

      const createdAtSpan: HTMLSpanElement = document.createElement("span");
      createdAtSpan.classList.add("date-time");
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
