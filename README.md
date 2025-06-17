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
3. [Getting Started](#getting-started)
4. [Framework Testing](#framework-testing)
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
    - [Router Setup](#router-setup)
    - [Navigation Links](#navigation-links)
8. [State Management](#state-management)
   
9. [API Reference](#api-reference)
    - [mini.js](#minijs)
    - [router.js](#routerjs)
    - [state.js](#statejs)
10. [Glossary](#glossary)
11. [Contributors](#contributors)

## Framework Features

### Core Capabilities
- **Virtual DOM Rendering** - Efficient DOM manipulation through [virtual nodes](#virtual-nodes)
- **Client-Side Routing** - Hash-based navigation for single-page applications  
- **Event Handling** - Comprehensive event management 
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
  Serve the project directory with a static file server and open `index.html` in a browser to run the application.

  > Tip: Use a simple static server like [http-server](https://www.npmjs.com/package/http-server) or Python's built-in server:
  > 
  > ```sh
  > npx http-server .
  > # or
  > python3 -m http.server
  > ```

  The browser environment must supports ES module imports. Include the following in `index.html`:
  ```javascript
  `<script type="module" src="./app/app.js"></script>`
  ```

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

## Getting Started

### Basic Setup

Initialize applications using Mini Framework with the following steps:

### 1. Import the core functions from framework files:
These import statements should be placed at the top of the main application file (typically app.js in the app folder):

Note: Import paths must be adjusted to correspond with the project's folder structure as specified in the Prerequisites section

```javascript
import { createVNode, mount } from './mini.js'
import { initRouter, isActiveRoute } from './router.js'
import { state, subscribe } from '../framework/state.js'
````
- `createVnode` creates virtual DOM nodes (VNodes)
- `mount` renders the application to the web page
- `initRouter` initializes client-side routing
- `isActiveRoute` checks if a route is currently active
- `state` manages global application state
- `subscribe` registers functions to run on state changes

### 2. Define the application component

Create a function called `App` that returns the application structure using VNodes:

```javascript
function App() {
    return createVNode('div', { class: 'app' }, 'Hello World!')
}
```
- This example creates a `<div>` with the class `app` and the text "Hello World" inside. 

### 3. Mount the application and enable reactive state

Wrap the mounting process in an update function and subscribe it to state changes:

```javascript
function update() {
    mount(document.body, app())
}
subscribe(()=> update())
```
 Run initial mounting:
```javascript
update()
```
This instructs the framework to display VNode returned by `App()` inside the `<body>` of the HTML page and re-render whenever state properties change.

## Framework Testing

The following test demonstrates core framework features and can be used to verify functionality:

**Features tested:**
- ✅ Virtual DOM creation with `createVNode`
- ✅ Component mounting with `mount`
- ✅ Client-side routing with hash navigation
- ✅ State management with reactive updates
- ✅ Event handling

Copy the code below into app.js and open it in a browser to verify framework functionality:


```javascript
import { createVNode, mount } from '../framework/mini.js'
import { initRouter } from '../framework/router.js'
import { state, subscribe } from '../framework/state.js'

function update() {
    mount(document.body, App())
}

function App() {
    const currentRoute = window.location.hash.slice(1) || '/home'
    
    return createVNode('div', { class: 'app' },
        createVNode('h1', {}, 'Mini Framework Test'),
        
        // Navigation
        createVNode('nav', {},
            createVNode('a', { 
                href: '#/home',
                onclick: (e) => { 
                    e.preventDefault() 
                    window.location.hash = '#/home' 
                }
            }, 'Home'),
            ' | ',
            createVNode('a', { 
                href: '#/about',
                onclick: (e) => { 
                    e.preventDefault() 
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
initRouter(() => {update()})

// Initialize and subscribe update() to state changes
state.count = 0
subscribe(() => update())
update()
```
**Test functionality:**
- Creates an application with Home/About navigation
- Displays different content based on current route
- Includes a counter demonstrating state updates
- Re-renders the entire application when state or route changes


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

## State Management

Mini Framework includes a reactive state management system that automatically triggers re-renders when data changes.

### Basic Usage

**1. Import state and subscribe:**
```javascript
import { state, subscribe } from '../framework/state.js'
```

**2. Use the state object directly:**
```javascript
// Example: incrementing a counter
state.count = (state.count || 0) + 1
```

**3. Subscribe the update/render function:**
```javascript
subscribe(() => update())
```

**4. Example:**
```javascript
import { createVNode, mount } from '../framework/mini.js'
import { state, subscribe } from '../framework/state.js'

function update() {
    mount(document.body, App())
}

function App() {
    return createVNode('div', {},
        createVNode('h1', {}, `Count: ${state.count || 0}`),
        createVNode('button', {
            onclick: () => { state.count = (state.count || 0) + 1 }
        }, 'Increment')
    )
}

subscribe(() => update())
update()
```

### How it works

- The `state` object is implemented as a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) that detects changes to any property including nested objects and arrays.
- When the `state` is updated, all subscribed functions are called automatically, ensuring that the application remains in sync with the latest data
- Any type of data can be stored in the state object, including arrays, objects, and primitive values.

### Best Practices

- Always mutate the `state` object directly (for example, `state.tasks.push(...)`, `state.filter = 'active'`).
- Avoid replacing the `state` object itself (avoid `state = {...}`).
- Subscribe the main render/update function once during application initialization to ensure consistent updates in response to state changes.


## API Reference

### mini.js

#### `createVNode(tag, attrs, ...children)`
Creates a virtual node object that representing a DOM element.

**Parameters**:
- **tag** (string): HTML tag name (e.g., 'div', 'button', 'input')
- **attrs** (object): Attributes and event handlers
    - Standard HTML attributes (class, id, style, etc.)
    - Event handlers with 'on' prefix (onclick, onkeydown, onchange, etc.)
    - Boolean attributes (checked, disabled, autofocus, etc.)
- **children** (array): Child nodes (strings, numbers, or other VNodes)

**Returns**: VNode object with structure { tag, attrs, children }

#### `render(vnode)`
Converts a virtual node into a real DOM element.

**Parameters**:
- **vnode** (VNode|string|number): Virtual node to render

**Returns**: DOM Element or Text Node

**Features**:
- Automatically converts 'on' prefixed attributes to event listeners
- Handles strings and numbers as text nodes
- Recursively renders child elements

#### `mount(root, vnode)`
Mounts rendered virtual nodes to a target DOM element.

**Parameters**:
- **root** (Element): Target DOM element
- **vnode** (VNode|Array): Virtual node to mount
- **Behavior**:
    - Clears existing content with innerHTML = ''
    - Handles both single vnodes and arrays of vnodes
    - Validates vnode structure before rendering
- **Throws**: Error if root is not a DOM Element or vnode is invalid

### router.js

#### `initRouter(callback)`
Initializes the hash-based router system.

**Parameters**:
- **callback** (function): Function called when route changes

**Features**:
- Sets up a hashchange event listener on the window object to detect navigation changes including back and forward button usage
- Handles initial route on page load

#### `isActiveRoute(route)`
Determines if a route matches the current active route.

**Parameters**:
- **route** (string): Route to check 

**Returns**: Boolean indicating if the given route matches the current route

**Special Handling**:
    - Normalizes routes by treating '/' as equivalent to an empty string ''
    - Returns true if the normalized current route matches the normalized input route or if the current route is empty and the input route is 'all'

#### `handleRouteChange()` (Internal)
Internal function that processes route changes and updates the current route state.
- **Functionality**:
    - Extracts route from window.location.hash
    - Updates internal currentRoute variable
    - Calls registered callback function with new route

**Note:** This function is called automatically by the router and should not be invoked directly by application code.

### state.js

#### `state` (Object)

Global application state object.  
Proxy-based reactivity: any changes to properties (including nested objects/arrays) automatically notify all subscribers.

**Initial State Example:**
```javascript
export const state = makeReactive({
    tasks: [],        //Array to hold task objects
    filter: 'all',    //String indicating current filter ('all', 'active', or 'completed')
    editingId: null, //ID of the task currently being edited (null if none)
    currentId: 1,    //Numeric ID counter for new tasks
})
```
#### `subscribe(callback)`

Registers a function to run when state changes.

**Parameters**:
- callback (function): Function to execute on state changes

**Implementation Details**:
- The state object is created using a recursive Proxy.
- On property write, all subscribed functions are notified.
- Subscribers are stored in an internal array and called on state changes.

## Glossary:

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
```javascript
const myVNode = createVNode('button', { class: 'primary', onclick: handleClick }, 'Click Me')
```
This creates a virtual button element with a class, a click event, and the label “Click Me.” When rendered, it produces the following HTML structure and executes the handleClick function when clicked:

```javascript
<button class="primary">Click Me</button>
```


## Contributors
| Name           | GitHub Profile                        | 
|----------------|---------------------------------------|
| Markus Amberla        | [MarkusYPA](https://github.com/MarkusYPA) | 
| Mayuree Reunsati      | [mareerray](https://github.com/mareerray) | 
| Parisa Rahimi         | [prahimi94](https://github.com/prahimi94) | 
| Roope Hongisto        | [RuBoMa](https://github.com/RuBoMa)       | 
| Toft Diederichs       | [Toft08](https://github.com/Toft08)       |

