# Mini Framework Documentation

Mini Framework is a lightweight JavaScript framework for building interactive web applications with [virtual DOM rendering](#virtual-dom-rendering) and [client-side routing](#client-side-routing).

This documentation will help you understand how the framework works and how to use it to build web applications quickly and efficiently.


## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts) 
    - [Virtual Nodes (VNodes)](#virtual-nodes-vnodes)
    - [Rendering Process](#rendering-process)
4. [Getting Started](#getting-started)
5. [Creating Elements](#creating-elements)
    - [Basic Elements](#basic-elements)
    - [Nested Elements](#nested-elements)
    - [Lists and Arrays](#lists-and-arrays)
    - [Input Elements](#input-elements)
6. [Event Handling](#event-handling)
    - [Click Events](#click-events)
    - [Input Events](#input-events)
    - [Keyboard Events](#keyboard-events)
    - [Form Events](#form-events)
7. [Routing](#routing)
    - [Navigation Links](#navigation-links)
    - [Programmatic Navigation](#programatic-navigation)
8. [State Management](#state-management)
    - [Simple State Pattern](#simple-state-pattern)
    - [Component Pattern](#component-pattern)
9. [Complete Examples](#complete-examples)
    - [Todo List Component](#todo-list-component)
    - [Simple Form](#simple-form)
10. [API Reference](#api-reference)
    - [mini.js](#minijs)
    - [router.js](#routerjs)
## Prerequisites

To run Mini Framework, you need:

- **A modern web browser**  
  (such as Chrome, Firefox, Edge, or Safari)

- **Project files in the same folder:**  
  - `mini.js` – the core framework file
  - `router.js` – for client-side routing
  - `app.js` – your application code
  - `index.html` – loads your app and scripts

- **No installation or build tools required**  
  Simply open `index.html` in your browser to run your app.

**Example folder structure:**
````
/your-project-folder
├── index.html
├── mini.js
├── router.js
└── app.js
````

## Quick Start

Here’s how to get your first Mini Framework app running in just a few lines:
```javascript
import { createVNode, mount } from './mini.js'
import { initRouter, isActiveRoute } from './router.js'

// Initialize your app
function App() {
    return createVNode('div', { class: 'app' }, 'Hello World!')
}

// Mount to DOM
mount(document.body, App())
```
This will display a simple “Hello World!” message on your page.  
You can now start adding elements, events, and more!
## Core Concepts

### Virtual Nodes (VNodes)

The framework uses virtual nodes to represent DOM elements before rendering. 

A VNode is a JavaScript object with three main parts:
- `tag` - HTML tag name (e.g., 'div', 'button')
- `attrs` - Object containing attributes (like class, id) and event handlers (like click, onclick)
- `children` - Array of child nodes (strings, numbers, or other VNodes)

### Rendering Process

1. Create VNodes using `createVNode()` function
2. Mount the root VNode using `mount()` function
3. The framework converts VNodes to real DOM elements

Example:
`````
const myVNode = createVNode('button', { class: 'primary', onclick: handleClick }, 'Click Me')
`````
This line creates a virtual button element with a class, a click event, and the label “Click Me.” When rendered, it will look and behave like this in HTML, and when clicked, it will call the `handleClick` function.

````
<button class="primary">Click Me</button>
````

## Getting Started

### Basic Setup

To get start with your App using the Mini Framework, follow these steps:

### 1. Import the core functions from your framework files:

```javascript
import { createVNode, mount } from './mini.js'
import { initRouter, isActiveRoute } from './router.js'
````
- `createVnode` is used to create virtual DOM nodes (VNodes).
- `mount` renders your app to the actual web page.
- `initRouter` and `isActiveRoute` are for routing.

### 2. Define your app component

Create a function called `App` that returns the structure of your application using VNodes:

````
function App() {
    return createVNode('div', { class: 'app' }, 'Hello World!')
}
`````
- This example creates a `<div>` with the class `app` and the text "Hello World" inside.
- You can expand this function to return more complex layouts as your app grows.

### 3. Mount your App to the page

Render your app by mounting it to the DOM:
````
mount(document.body, App())
````
This tells the framework to take the VNode returned by `App()` and display it inside the `<body>` of your HTML page. 

## Creating Elements
### Basic Elements

Use `createVNode(tag, attributes, ...children)` to create elements:

```javascript
// Simple div
createVNode('div', {}, 'Hello World')

// Div with class
createVNode('div', { class: 'container' }, 'Content')

// Div with multiple attributes
createVNode('div', { 
    class: 'card', 
    id: 'main-card',
    style: 'padding: 20px;' 
}, 'Card content')
```

### Nested Elements

```javascript
// Header with title and subtitle
createVNode('header', { class: 'header' },
    createVNode('h1', {}, 'My App'),
    createVNode('p', { class: 'subtitle' }, 'Welcome to my application')
)
```

### Lists and Arrays

Use the spread operator to render arrays of elements:

```javascript
const items = ['Apple', 'Banana', 'Cherry']

createVNode('ul', { class: 'fruit-list' },
    ...items.map(item => 
        createVNode('li', {}, item)
    )
)
```

### Input Elements

```javascript
// Text input
createVNode('input', {
    type: 'text',
    class: 'form-input',
    placeholder: 'Enter your name',
    value: currentValue
})

// Checkbox
createVNode('input', {
    type: 'checkbox',
    checked: isChecked,
    id: 'agree-checkbox'
})

// Select dropdown
createVNode('select', { class: 'dropdown' },
    createVNode('option', { value: '' }, 'Choose...'),
    createVNode('option', { value: 'red' }, 'Red'),
    createVNode('option', { value: 'blue' }, 'Blue')
)
```

## Event Handling

Add event handlers using the `on` prefix in attributes:

```javascript
onclick → 'click'
onkeydown → 'keydown'
onchange → 'change'
```
### Click Events

```javascript
createVNode('button', {
    class: 'btn',
    onclick: () => {
        console.log('Button clicked!')
        // Update state and re-render
        updateApp()
    }
}, 'Click Me')
```

### Input Events

```javascript
// Text input with change handler
createVNode('input', {
    type: 'text',
    class: 'search',
    onchange: (e) => {
        const value = e.target.value
        console.log('Input changed:', value)
    }
})

// Real-time input handling
createVNode('input', {
    type: 'text',
    oninput: (e) => {
        // Updates as user types
        handleSearch(e.target.value)
    }
})
```

### Keyboard Events

```javascript
createVNode('input', {
    type: 'text',
    class: 'todo-input',
    onkeydown: (e) => {
        if (e.key === 'Enter') {
            addTodo(e.target.value)
            e.target.value = ''
        }
        if (e.key === 'Escape') {
            cancelEdit()
        }
    }
})
```

### Form Events

```javascript
createVNode('form', {
    class: 'contact-form',
    onsubmit: (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        handleSubmit(formData)
    }
},
    createVNode('input', { name: 'email', type: 'email' }),
    createVNode('button', { type: 'submit' }, 'Submit')
)
```

## Routing

The framework includes a simple hash-based router for single-page applications.

### Router Setup

```javascript
import { initRouter, isActiveRoute, navigateTo } from './router.js'

// Define route handler
function handleRouteChange(route) {
    console.log('Route changed to:', route)
    // Update your app state based on route
    updateAppForRoute(route)
}

// Initialize router
initRouter(handleRouteChange)
```

### Navigation Links

```javascript
// Create navigation links
createVNode('nav', { class: 'navigation' },
    createVNode('a', { 
        href: '#/', 
        class: isActiveRoute('/') ? 'active' : '' 
    }, 'Home'),
    createVNode('a', { 
        href: '#/about', 
        class: isActiveRoute('/about') ? 'active' : '' 
    }, 'About'),
    createVNode('a', { 
        href: '#/contact', 
        class: isActiveRoute('/contact') ? 'active' : '' 
    }, 'Contact')
)
```

### Programmatic Navigation

```javascript
// Navigate programmatically
createVNode('button', {
    onclick: () => navigateTo('/dashboard')
}, 'Go to Dashboard')
```

## State Management

The framework doesn't provide built-in state management, but you can implement it using plain JavaScript objects and re-rendering:

### Simple State Pattern

```javascript
let state = {
    count: 0,
    user: null,
    items: []
}

function updateState(newState) {
    state = { ...state, ...newState }
    render()
}

function render() {
    mount(document.getElementById('app'), App())
}

function App() {
    return createVNode('div', {},
        createVNode('h1', {}, `Count: ${state.count}`),
        createVNode('button', {
            onclick: () => updateState({ count: state.count + 1 })
        }, 'Increment')
    )
}
```

### Component Pattern

```javascript
function Counter({ initialValue = 0 }) {
    return createVNode('div', { class: 'counter' },
        createVNode('span', {}, `Value: ${initialValue}`),
        createVNode('button', {
            onclick: () => updateCounter(initialValue + 1)
        }, '+'),
        createVNode('button', {
            onclick: () => updateCounter(initialValue - 1)
        }, '-')
    )
}

// Usage
function App() {
    return createVNode('div', {},
        Counter({ initialValue: state.count })
    )
}
```

## Complete Examples

### Todo List Component

```javascript
function TodoApp() {
    const visibleTodos = state.todos.filter(todo => {
        if (state.filter === 'active') return !todo.completed
        if (state.filter === 'completed') return todo.completed
        return true
    })

    return createVNode('div', { class: 'todo-app' },
        // Header with input
        createVNode('header', {},
            createVNode('h1', {}, 'Todos'),
            createVNode('input', {
                type: 'text',
                class: 'new-todo',
                placeholder: 'What needs to be done?',
                onkeydown: (e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                        addTodo(e.target.value.trim())
                        e.target.value = ''
                    }
                }
            })
        ),
        
        // Todo list
        createVNode('ul', { class: 'todo-list' },
            ...visibleTodos.map(todo => TodoItem(todo))
        ),
        
        // Footer with filters
        createVNode('footer', {},
            createVNode('span', {}, `${getActiveCount()} items left`),
            createVNode('div', { class: 'filters' },
                FilterLink('all'),
                FilterLink('active'),
                FilterLink('completed')
            )
        )
    )
}

function TodoItem(todo) {
    return createVNode('li', {
        class: todo.completed ? 'completed' : ''
    },
        createVNode('input', {
            type: 'checkbox',
            checked: todo.completed,
            onchange: () => toggleTodo(todo.id)
        }),
        createVNode('label', {
            ondblclick: () => startEditing(todo.id)
        }, todo.text),
        createVNode('button', {
            class: 'destroy',
            onclick: () => deleteTodo(todo.id)
        })
    )
}
```

### Simple Form

```javascript
function ContactForm() {
    return createVNode('form', { 
        class: 'contact-form',
        onsubmit: handleSubmit 
    },
        createVNode('div', { class: 'field' },
            createVNode('label', {}, 'Name:'),
            createVNode('input', { 
                type: 'text', 
                name: 'name', 
                required: true 
            })
        ),
        
        createVNode('div', { class: 'field' },
            createVNode('label', {}, 'Email:'),
            createVNode('input', { 
                type: 'email', 
                name: 'email', 
                required: true 
            })
        ),
        
        createVNode('div', { class: 'field' },
            createVNode('label', {}, 'Message:'),
            createVNode('textarea', { 
                name: 'message', 
                rows: 4,
                required: true 
            })
        ),
        
        createVNode('button', { type: 'submit' }, 'Send Message')
    )
}

function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    console.log('Form submitted:', data)
    // Handle form submission
}
```

## API Reference

### mini.js

#### `createVNode(tag, attrs, ...children)`
Creates a virtual node object.
- **tag** (string): HTML tag name
- **attrs** (object): Attributes and event handlers
- **children** (array): Child nodes (strings, numbers, or VNodes)
- **Returns**: VNode object

#### `render(vnode)`
Converts a virtual node to a real DOM element.
- **vnode** (VNode|string|number): Virtual node to render
- **Returns**: DOM Element or Text Node

#### `mount(root, vnode)`
Mounts a virtual node to a DOM element.
- **root** (Element): Target DOM element
- **vnode** (VNode): Virtual node to mount
- **Throws**: Error if root is not a DOM Element or vnode is invalid

### router.js

#### `initRouter(callback)`
Initializes the router with a route change handler.
- **callback** (function): Called when route changes with new route as parameter

#### `navigateTo(route)`
Programmatically navigate to a route.
- **route** (string): Target route path

#### `getCurrentRoute()`
Gets the current route.
- **Returns**: Current route string

#### `isActiveRoute(route)`
Checks if a route is currently active.
- **route** (string): Route to check
- **Returns**: Boolean indicating if route is active

## Best Practices

1. **Component Functions**: Use functions that return VNodes for reusable components
2. **State Updates**: Always re-render after state changes
3. **Event Handlers**: Use arrow functions to maintain scope
4. **Key Attributes**: Use unique identifiers for list items when possible
5. **Performance**: Consider batching updates for better performance

## Common Patterns

### Conditional Rendering
```javascript
createVNode('div', {},
    user ? 
        createVNode('span', {}, `Welcome, ${user.name}!`) :
        createVNode('button', { onclick: showLogin }, 'Login')
)
```

### Dynamic Classes
```javascript
createVNode('button', {
    class: `btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`
}, 'Button')
```

### List with Keys
```javascript
createVNode('ul', {},
    ...items.map(item =>
        createVNode('li', { 'data-id': item.id }, item.name)
    )
)
```

----------
### Footnote:

## Virtual DOM Rendering
A virtual DOM is a fast, in-memory version of the real DOM. When your app changes, only the differences are updated in the real DOM, making updates quicker and more efficient.

## Client-side routing 
Client side routing lets your app change the URL and display new content instantly, all without reloading the page or asking the server for a new one


## Contributors
| Name           | GitHub Profile                        | 
|----------------|---------------------------------------|
| Markus Amberla    | [MarkusYPA](https://github.com/MarkusYPA) | 
| Mayuree Reunsati       | [mareerray](https://github.com/mareerray)         | 
| Parisa Rahimi   | [prahimi94](https://github.com/prahimi94) | 
| Roope Hongisto       | [RuBoMa](https://github.com/RuBoMa)         | 
| Toft Diederichs | [Toft08](https://github.com/Toft08) | 

