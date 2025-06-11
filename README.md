# Mini Framework Documentation

A lightweight JavaScript framework for building interactive web applications with virtual DOM rendering and client-side routing.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [Creating Elements](#creating-elements)
4. [Event Handling](#event-handling)
5. [Routing](#routing)
6. [State Management](#state-management)
7. [Complete Examples](#complete-examples)
8. [API Reference](#api-reference)

## Getting Started

The framework consists of three main modules:
- `mini.js` - Core virtual DOM functionality
- `router.js` - Client-side routing
- Your application logic

### Basic Setup

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

## Core Concepts

### Virtual Nodes (VNodes)

The framework uses virtual nodes to represent DOM elements before rendering. A VNode is a JavaScript object with:
- `tag` - HTML tag name
- `attrs` - Object containing attributes and event handlers
- `children` - Array of child nodes (strings, numbers, or other VNodes)

### Rendering Process

1. Create VNodes using `createVNode()`
2. Mount the root VNode using `mount()`
3. The framework converts VNodes to real DOM elements

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