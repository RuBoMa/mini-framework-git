# Mini Framework Documentation

Mini Framework is a lightweight JavaScript framework for building interactive web applications with [virtual DOM rendering](#virtual-dom-rendering) and [client-side routing](#client-side-routing).

This documentation provides comprehensive guidance on framework implementation and application development.


## Table of Contents
1. [Framework Features](#framework-features) 
    - [Core Capabilities](#core-capabilities)
    - [Use cases](#use-cases)
    - [Architecture](#architecture)
    - [Key Benefits](#key-benefits)
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
    - [state.js](#statejs)
11. [Best Practices](#best-practices)
12. [Footnote](#footnote)
13. [Contributors](#contributors)

## Framework Features

### Core Capabilities
- **Virtual DOM Rendering** - Efficient DOM manipulation through [virtual nodes](#virtual-nodes)
- **Client-Side Routing** - Hash-based navigation for single-page applications  
- **Event Handling** - Comprehensive event management with `on` prefix syntax
- **Lightweight Design** - No external dependencies or build tools required

### Use Cases
- Interactive web applications and dashboards
- Single-page applications (SPAs)
- Rapid prototyping and educational projects
- Small to medium-scale applications

### Architecture
Three-layer structure:
1. **Virtual DOM Layer** [(`mini.js`)](#minijs) - VNode creation and management
2. **Routing Layer** [(`router.js`)](#routerjs) - Client-side navigation
3. **State Layer** [(`state.js`)](#statejs) - Application data management

### Key Benefits
- Simple API with minimal learning curve
- Browser-compatible ES modules (Chrome, Firefox, Edge, Safari)
- Transparent implementation for educational value
- Flexible architecture without enforced patterns

## Prerequisites

Mini Framework requires the following components:

- **Modern web browser**  
  (such as Chrome, Firefox, Edge, or Safari)

- **Project files:**  
  - `mini.js` – core framework file
  - `router.js` – client-side routing functionality
  - `state.js`- application state management
  - `app.js` – main application
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

Copy the code below into app.js for testing purpose and open it in a browser to verify framework functionality. Ensure file paths match the folder structure.


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
        createVNode('div', { style: 'margin-top: 1em;' }, 
            currentRoute === '/home' 
                ? createVNode('p', {}, 'Welcome to the home page!')
                : createVNode('p', {}, 'This is the about page.')
        ),
        
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
Creates a virtual node object that represents a DOM element before rendering.
- **tag** (string): HTML tag name (e.g., 'div', 'button', 'input')
- **attrs** (object): Attributes and event handlers object
    - Standard HTML attributes (class, id, style, etc.)
    - Event handlers with 'on' prefix (onclick, onkeydown, onchange, etc.)
    - Boolean attributes (checked, disabled, autofocus, etc.)
- **children** (array): Child nodes which can be strings, numbers, or other VNodes
- **Returns**: VNode object with structure { tag, attrs, children }

#### `render(vnode)`
Converts a virtual node into a real DOM element with full attribute and event handling.
- **vnode** (VNode|string|number): Virtual node to render
    - VNode objects are converted to DOM elements
    - Strings and numbers become text nodes
    - Event handlers are automatically bound using addEventListener
- **Returns**: DOM Element or Text Node
- **Event Handling**: Automatically converts 'on' prefixed attributes to event listeners

#### `mount(root, vnode)`
Mounts rendered virtual nodes to a target DOM element, replacing existing content.
- **root** (Element):  Target DOM element where content will be mounted
- **vnode** (VNode|Array): Virtual node or array of virtual nodes to mount
- **Behavior**:
    - Clears existing content with innerHTML = ''
    - Handles both single vnodes and arrays of vnodes
    - Validates vnode structure before rendering
- **Throws**: Error if root is not a DOM Element or vnode is invalid

### router.js

#### `initRouter(callback)`
Initializes the hash-based router system for single-page application navigation.
- **callback** (function): Function called when route changes
    - Receives the new route as a parameter
    - Triggered on initial page load and hash changes
- **Functionality**:
    - Sets up hashchange event listener for browser navigation
    - Handles initial route on page load
    - Enables back/forward button support

#### `isActiveRoute(route)`
Determines if a specified route matches the current active route.
- **route** (string): Route to check against current route
- **Returns**: Boolean indicating if route is currently active
- **Special Handling**:
    - Normalizes routes (treats '/' and '' as equivalent)
    - Handles 'all' filter matching empty routes
    - Used for highlighting active navigation links
#### `handleRouteChange()` (Internal)
Internal function that processes route changes and updates the current route state.
- **Functionality**:
    - Extracts route from window.location.hash
    - Updates internal currentRoute variable
    - Calls registered callback function with new route

### state.js

state (Object)
Global application state object that manages todo application data and UI state.

State Structure:

````
const state = {
    tasks: [],           // Array of task objects
    filter: 'all',       // Current filter ('all', 'active', 'completed')
    editingId: null,     // ID of task currently being edited
    currentId: 1         // Counter for generating unique task IDs
}
````


## Best Practices

1. **Component Functions**: Use functions that return VNodes for reusable components
2. **State Updates**: Always re-render after state changes
3. **Event Handlers**: Use arrow functions to maintain scope
4. **Key Attributes**: Use unique identifiers for list items when possible
5. **Performance**: Consider batching updates for better performance

----------
## Footnote:

### Client-side routing 
Client side routing lets your app change the URL and display new content instantly, all without reloading the page or asking the server for a new one

### Virtual DOM Rendering
A virtual DOM is a fast, in-memory version of the real DOM. When your app changes, only the differences are updated in the real DOM, making updates quicker and more efficient.

### Virtual Nodes 

The framework utilizes virtual nodes (VNodes) to represent DOM elements before rendering. A VNode is a JavaScript object containing three main components:
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


## Contributors
| Name           | GitHub Profile                        | 
|----------------|---------------------------------------|
| Markus Amberla        | [MarkusYPA](https://github.com/MarkusYPA) | 
| Mayuree Reunsati      | [mareerray](https://github.com/mareerray) | 
| Parisa Rahimi         | [prahimi94](https://github.com/prahimi94) | 
| Roope Hongisto        | [RuBoMa](https://github.com/RuBoMa)       | 
| Toft Diederichs       | [Toft08](https://github.com/Toft08)       | 

