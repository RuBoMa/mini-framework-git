# MiniJS Framework

**MiniJS** is a minimal JavaScript UI framework that allows you to declaratively create and update DOM trees using a virtual element structure. Inspired by modern component-based libraries, it provides simple tools to:
- Create HTML elements
- Add attributes and event handlers
- Nest elements
- Dynamically render based on application state

---

## 🚀 Overview

MiniJS is built around two core concepts:
- **Virtual Element Descriptions**: Tree-structured JavaScript objects representing the desired DOM.
- **Render Function**: A helper (`h`) that converts the tree into real DOM elements and attaches event listeners.

The framework is lightweight, fast to set up, and doesn't require any build step. It’s designed for small projects and learning purposes.

---

## 📦 Features

- Declarative element creation
- Attribute and event binding
- Element nesting
- Reactive state rendering
- Simple `h()` function to describe UI structure
- Fully DOM-based — no virtual DOM diffing needed

---

## ✨ Example Usage

### Create an Element

```js
const element = h("div", { class: "container" }, "Hello World");
```

This creates:
```html
<div class="container">Hello World</div>
```

### Add Attributes
```js
const input = h("input", {
  type: "text",
  placeholder: "Enter your name",
  value: "Alice"
});
```

This produces:
```html
<input type="text" placeholder="Enter your name" value="Alice" />
```

### Nest Elements
```js
const form = h("form", {},
  h("input", { type: "text", placeholder: "Task name" }),
  h("button", { type: "submit" }, "Add Task")
);
```

This produces:
```html
<form>
  <input type="text" placeholder="Task name" />
  <button type="submit">Add Task</button>
</form>
```

### Add Event Handlers
```js
const button = h("button", {
  onclick: () => alert("Clicked!")
}, "Click Me");
```

This creates a button that shows an alert when clicked.

## ⚙️ How the Framework Works
The MiniJS framework uses a single helper function:
#### `h(tag, attrs, ...children)`

- `tag`: The name of the element (e.g., `"div"`, `"input"`)
- `attrs`: An object with key-value pairs for attributes and event listeners (`onclick`, `oninput`, etc.)
- `...children`: Text content, elements, or nested arrays of them


Example:
```js
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  }

  for (const child of children.flat()) {
    if (typeof child === "string" || typeof child === "number") {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }

  return el;
}
```

You define your UI as a function of your data (state). When state changes, you re-render by clearing the container and inserting the new DOM tree.

## ✅ Example Application: Todo List
```js
const state = {
  tasks: [],
  input: ""
};

function update() {
  root.innerHTML = "";
  root.appendChild(App());
}

function App() {
  return h("div", {},
    h("input", {
      type: "text",
      placeholder: "New task",
      value: state.input,
      oninput: e => {
        state.input = e.target.value;
      },
      onkeydown: e => {
        if (e.key === "Enter" && state.input.trim()) {
          state.tasks.push({ id: Date.now(), name: state.input.trim(), completed: false });
          state.input = "";
          update();
        }
      }
    }),
    h("ul", {},
      ...state.tasks.map(task =>
        h("li", {},
          h("input", {
            type: "checkbox",
            checked: task.completed,
            onchange: () => {
              task.completed = !task.completed;
              update();
            }
          }),
          h("span", {}, task.name),
          h("button", {
            onclick: () => {
              state.tasks = state.tasks.filter(t => t !== task);
              update();
            }
          }, "X")
        )
      )
    )
  );
}

const root = document.getElementById("app");
update();

```

## 📁 File Structure
```bash
/project-root
│
├── index.html       # Mount point for the app
├── app.js           # Main application logic
├── framework.js     # Contains h() and render functions
└── README.md        # ✅ This documentation
```
