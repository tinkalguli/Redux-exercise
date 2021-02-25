const todos = {
  allTodos: JSON.parse(localStorage.getItem("todos")) || [],
  activeButton: "allTodos",
};

const store = Redux.createStore(reducer, todos);

const inputBox = document.querySelector("#input-box");
const root = document.querySelector("#root");
const container = document.querySelector(".container");

createUI();
inputBox.addEventListener("keyup", createTodo);

function reducer(state, action) {
  let modifiedTodos;
  switch (action.type) {
    case "addTodo":
      return {
        ...state,
        allTodos: [...state.allTodos, action.todo],
      };
    case "removeTodo":
      modifiedTodos = state.allTodos.filter(
        (todo) => todo.id !== action.id
      );
      return {
        ...state,
        allTodos: modifiedTodos,
      };
    case "isCompleted":
      modifiedTodos = state.allTodos.map((todo) => {
        if (todo.id === action.id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      return {
        ...state,
        allTodos: modifiedTodos,
      };
    case "clearCompletedTodos":
      modifiedTodos = state.allTodos.filter((e) => !e.isDone);
      return {
        ...state,
        allTodos: modifiedTodos,
      };
    case "allTodos":
      return { ...state, activeButton: "allTodos" };
    case "filterActiveTodos":
      return { ...state, activeButton: "activeTodos" };
    case "filterCompletedTodos":
      return { ...state, activeButton: "completedTodos" };
    default:
      return state;
  }
}

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("todos", JSON.stringify(state.allTodos));
  createUI();
});

function createTodo(event) {
  let { value } = event.target;
  let id = Date.now() + "";

  if (event.keyCode == 13 && value !== "") {
    let todo = {
      name: value,
      isDone: false,
      id,
    };

    store.dispatch({ type: "addTodo", todo });
    event.target.value = "";
  }
}

function removeTodo({ target }) {
  let { id } = target.dataset;
  store.dispatch({ type: "removeTodo", id });
}

function isCompleted({ target }) {
  let { id } = target.dataset;
  store.dispatch({ type: "isCompleted", id });
}

function handleBtnClick({ target }) {
  const { name } = target.dataset;
  switch (name) {
    case "all":
      store.dispatch({ type: "allTodos" });
      break;
    case "active":
      store.dispatch({ type: "filterActiveTodos" });
      break;
    case "completed":
      store.dispatch({ type: "filterCompletedTodos" });
      break;
    case "clearCompleted":
      store.dispatch({ type: "clearCompletedTodos" });
      break;
    default:
      break;
  }
}

function createUI() {
  root.innerText = "";
  const state = store.getState();
  let todos = [...state.allTodos];

  switch (state.activeButton) {
    case "activeTodos":
      todos = todos.filter((e) => !e.isDone);
      break;
    case "completedTodos":
      todos = todos.filter((e) => e.isDone);
      break;
    default:
      break;
  }

  todos.forEach((todo) => {
    let li = document.createElement("li");
    li.classList.add("flex-between");
    let div = document.createElement("div");
    div.classList.add("flex");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.setAttribute("data-id", todo.id);
    checkbox.checked = todo.isDone;
    let p = document.createElement("p");
    p.innerText = todo.name;
    let span = document.createElement("span");
    span.setAttribute("data-id", todo.id);
    span.innerText = "x";

    div.append(checkbox, p);
    li.append(div, span);
    root.append(li);

    span.addEventListener("click", removeTodo);
    checkbox.addEventListener("change", isCompleted);
  });

  createButtons(state);
}

function createButtons(state) {
  const buttonBox = document.querySelector(".button-box");

  if (buttonBox) {
    buttonBox.remove();
  }

  if (state.allTodos.length > 0) {
    let buttons = document.createElement("div");
    buttons.classList.add("flex-between", "button-box");
    let filterButtons = document.createElement("div");
    let active = document.createElement("button");
    active.innerText = "Active";
    active.setAttribute("data-name", "active");
    let completed = document.createElement("button");
    completed.innerText = "Completed";
    completed.setAttribute("data-name", "completed");
    let all = document.createElement("button");
    all.innerText = "All";
    all.setAttribute("data-name", "all");
    let clearCompleted = document.createElement("button");
    clearCompleted.innerText = "Clear Completed";
    clearCompleted.classList.add("clear-btn");
    clearCompleted.setAttribute("data-name", "clearCompleted");

    all.classList.add(
      `${state.activeButton === "allTodos" ? "active" : "_"}`
    );
    completed.classList.add(
      `${state.activeButton === "completedTodos" ? "active" : "_"}`
    );
    active.classList.add(
      `${state.activeButton === "activeTodos" ? "active" : "_"}`
    );

    filterButtons.append(all, completed, active);
    buttons.append(filterButtons, clearCompleted);
    container.append(buttons);

    buttons.addEventListener("click", handleBtnClick);
  }
}
