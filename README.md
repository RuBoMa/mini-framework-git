# Mini Framework Documentation

Mini Framework is a lightweight JavaScript framework for building interactive web applications with [virtual DOM rendering](#virtual-dom-rendering) and [client-side routing](#client-side-routing).

This documentation provides comprehensive guidance on framework implementation and application development.


## Table of Contents
1. [Core Concepts](#core-concepts) 
    - [Virtual Nodes (VNodes)](#virtual-nodes-vnodes)
    - [Rendering Process](#rendering-process)
2. [Prerequisites](#prerequisites)
3. [Framework Testing](#framework-testing)
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
7. [Routing](#routing)
    - [Navigation Links](#navigation-links)
    - [Programmatic Navigation](#programatic-navigation)
8. [State Management](#state-management)
    - [Simple State Pattern](#simple-state-pattern)
    - [Component Pattern](#component-pattern)
9. [Complete Examples](#complete-examples)
    - [Todo List Component](#todo-list-component)
10. [API Reference](#api-reference)
    - [mini.js](#minijs)
    - [router.js](#routerjs)
11. [Best Practices](#best-practices)
12. [Footnotes](#footnotes)
13. [Contributors](#contributors)

## Core Concepts

### Virtual Nodes (VNodes)

The framework utilizes virtual nodes to represent DOM elements before rendering. A VNode is a JavaScript object containing three main components:
- `tag` - HTML tag name (e.g., 'div', 'button')
- `attrs` - Object containing attributes (such as class, id) and event handlers (such as click, onclick)
- `children` - Array of child nodes (strings, numbers, or other VNodes)

### Rendering Process

1. Create VNodes using `createVNode()` function
2. Mount the root VNode using `mount()` function
3. The framework converts VNodes to real DOM elements

Example:
`````
const myVNode = createVNode('button', { class: 'primary', onclick: handleClick }, 'Click Me')
`````
This creates a virtual button element with a class, a click event, and the label “Click Me.” When rendered, it produces the following HTML structure and executes the handleClick function when clicked:

````
<button class="primary">Click Me</button>
````

## Prerequisites

Mini Framework requires the following components:

- **Modern web browser**  
  (such as Chrome, Firefox, Edge, or Safari)

- **Project files:**  
  - `mini.js` – core framework file
  - `router.js` – client-side routing functionality
  - `state.js`- application state management
  - `app.js` – application code
  - `app.css` - application styles
  - `index.html` – application loader and script references

- **No installation or build tools required**  
  Open `index.html` in a browser to run the application.

  The browser environment must supports ES module imports. Include the following in index.html:
  ````
  `<script type="module" src="./app/app.js"></script>`
  ````

**Recommended folder structure:**
````
/project-folder
├──framework
|   ├── mini.js
|   ├── router.js
|   └── state.js
├── app
|   ├── app.js
|   └── app.css
└── index.html
````

## Framework Testing

The following test demonstrates core framework features:

**Features tested:**
- ✅ Virtual DOM creation with `createVNode`
- ✅ Component mounting with `mount`
- ✅ Client-side routing with hash navigation
- ✅ State management with reactive updates
- ✅ Event handling

Copy the code below into a test file and open it in a browser to verify framework functionality. Ensure file paths match the folder structure.


```javascript
import { createVNode, mount } from '../framework/mini.js'
import { initRouter } from '../framework/router.js'
import { state } from '../framework/state.js'

function App() {
    const currentRoute = window.location.hash.slice(1) || '/home'
    
    return createVNode('div', { class: 'app' },
        createVNode('h1', {}, 'Mini Framework Test'),
        
        // Navigation
        createVNode('nav', {},
            createVNode('a', { 
                href: '#/home',
                onclick: (e) => { 
                    e.preventDefault(); 
                    window.location.hash = '#/home' 
                }
            }, 'Home'),
            ' | ',
            createVNode('a', { 
                href: '#/about',
                onclick: (e) => { 
                    e.preventDefault(); 
                    window.location.hash = '#/about' 
                }
            }, 'About')
        ),
        
        // Route content
        createVNode('div', { style: 'margin-top: 1em;' }, [
            currentRoute === '/home' 
                ? createVNode('p', {}, 'Welcome to the home page!')
                : createVNode('p', {}, 'This is the about page.')
        ]),
        
        // State management demo
        createVNode('p', {}, `Count: ${state.count}`),
        createVNode('button', {
            onclick: () => {
                state.count += 1
                mount(document.body, App())
            }
        }, 'Increment')
    )
}

// Initialize router
initRouter(() => {
    mount(document.body, App())
})

// Initialize and mount
state.count = 0
mount(document.body, App())

```
**Test functionality:**
- Creates an application with Home/About navigation
- Displays different content based on current route
- Includes a counter demonstrating state updates
- Re-renders the entire application when state or route changes

## Getting Started

### Basic Setup

To initialize an application using the Mini Framework, follow these steps:

### 1. Import the core functions from framework files:
These import statements should be placed at the top of the main application file (typically app.js in the app folder):

Note: Import paths must be adjusted to correspond with the project's folder structure as specified in the Prerequisites section

```javascript
import { createVNode, mount } from './mini.js'
import { initRouter, isActiveRoute } from './router.js'
import { state } from '../framework/state.js'
````
- `createVnode` creates virtual DOM nodes (VNodes)
- `mount` renders the application to the web page
- `initRouter` initializes client-side routing
- `isActiveRoute` checks if a route is currently active
- `state` manages global application state

### 2. Define the application component

Create a function called `App` that returns the application structure using VNodes:

````
function App() {
    return createVNode('div', { class: 'app' }, 'Hello World!')
}
`````
- This example creates a `<div>` with the class `app` and the text "Hello World" inside. This function can be expanded to return more complex layouts as the application grows.

### 3. Mount the application to the page

Render the application by mounting it to the DOM:
````
mount(document.body, App())
````
This instructs the framework to take the VNode returned by `App()` and display it inside the `<body>` of the HTML page. 

## Creating Elements
### Basic Elements

Use `createVNode(tag, attributes, ...children)` to create elements:

```javascript
// Simple div
createVNode('h3', {}, 'Mini-framework')

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

## Routing

The framework includes a simple hash-based router for single-page applications.

### Router Setup

```javascript
import { initRouter, isActiveRoute } from './router.js'

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
| Markus Amberla        | [MarkusYPA](https://github.com/MarkusYPA) | 
| Mayuree Reunsati      | [mareerray](https://github.com/mareerray)         | 
| Parisa Rahimi         | [prahimi94](https://github.com/prahimi94) | 
| Roope Hongisto        | [RuBoMa](https://github.com/RuBoMa)         | 
| Toft Diederichs       | [Toft08](https://github.com/Toft08) | 

