import { createVNode, mount } from '../framework/mini.js'
import { initRouter, isActiveRoute } from '../framework/router.js'
import { state, subscribe } from '../framework/state.js'

// Map routes to filter states
function routeToFilter(route) {
    if (route === 'active' || route === './active') return 'active'
    if (route === 'completed' || route === './completed') return 'completed'
    if (route === '' || route === '/' || route === 'all') return 'all'
    return 'notfound'
}

function handleRouteChange(route) {
    state.filter = routeToFilter(route)
}

function update() {
    const root = document.body
    mount(root, app())

    // focus if adding tasks or editing
    setTimeout(() => {
        if (state.editingId === 0) {
            const input = document.querySelector('.new-todo')
            if (input) input.focus()
        } else if (state.editingId) {
            const input = document.querySelector('.edit')
            if (input) input.focus()
        }
    })
}

// app renders the main application structure
function app() {
    if (state.filter === 'notfound') {
        return createVNode('h1', { class: 'not-found' }, '404 - Page Not Found')
    }
    const visibleTasks = state.tasks.filter(task => {
        if (state.filter === 'active') return !task.completed
        if (state.filter === 'completed') return task.completed
        return true
    })

    return [
        sidebar(),
        mainSection(visibleTasks),
        footer()
    ]
}
// sidebar renders the left sidebar with framework info and links
function sidebar() {
    return createVNode('aside', { class: 'learn' },
        createVNode('header', {},
            createVNode('h3', {}, 'Mini-framework'),
            createVNode('span', { class: 'source-links' })
        ),
        createVNode('hr'),
        createVNode('blockquote', { class: 'quote speech-bubble' },
            createVNode('p', {}, 'MiniJS is a minimal JavaScript UI framework that allows you to declaratively create and update DOM trees using a virtual element structure. Inspired by modern component-based libraries, it provides simple tools to:'),
            createVNode('ul', {},
                createVNode('li', {}, 'Create HTML elements'),
                createVNode('li', {}, 'Add attributes and event handlers'),
                createVNode('li', {}, 'Nest elements'),
                createVNode('li', {}, 'Dynamically render based on application state')
            ),
            createVNode('footer', {},
                createVNode('a', { 
                    href: 'https://github.com/01-edu/public/tree/master/subjects/mini-framework',
                    target: '_blank',
                }, 'View on GitHub')
            )
        ),
    )
}
// mainSection renders the main todo app section with tasks and input
function mainSection(visibleTasks) {
    return createVNode('section', { class: 'todoapp' },
        createVNode('header', { class: 'header' },

            createVNode('h1', {}, 'todos'),

            createVNode('input', {
                type: 'text',
                class: 'new-todo',
                placeholder: 'What needs to be done?',
                autofocus: '',
                onkeydown: e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                        state.tasks.unshift({
                            id: state.currentId++,
                            name: e.target.value.trim(),
                            completed: false,
                        })
                        e.target.value = ''
                        state.editingId = 0
                    }
                }
            }),
        ),

        createVNode('main', { class: 'main', style: 'display: block' },

            createVNode('div', { class: 'toggle-all-container' },
                createVNode('input', {
                    class: 'toggle-all',
                    type: 'checkbox',
                }),

                createVNode('label',
                    {
                        class: 'toggle-all-label',
                        for: 'toggle-all',
                        onclick: () => {
                            const allCompleted = state.tasks.length > 0 && state.tasks.every(t => t.completed)
                            state.tasks.forEach(t => t.completed = !allCompleted)
                        }
                    },
                    'Mark all as complete')
            ),

            createVNode('ul', { class: 'todo-list' },
                ...visibleTasks.map(task => taskItem(task))
            ),
        ),
        infoFooter()
    )
}

function taskItem(task) {
    const isEditing = state.editingId === task.id

    return createVNode(
        'li',
        {
            'data-id': `${task.id}`,
            class: `${task.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`
        },
        createVNode('div', {class: 'view'},

            createVNode('input', {
                type: 'checkbox',
                class: 'toggle',
                checked: task.completed,
                onchange: () => {
                    task.completed = !task.completed
                }
            }),

            createVNode('label', {
                ondblclick: () => {
                    state.editingId = task.id
                }
            }, task.name),

            createVNode('button', {
                class: 'destroy',
                onclick: () => {
                    state.tasks = state.tasks.filter(t => t.id !== task.id)
                }
            }),
        ),

        // add editing input if task is being edited
        isEditing && createVNode('input', {
            class: 'edit',
            value: task.name,
            autofocus: true,
            onblur: e => {
                task.name = e.target.value.trim()
                state.editingId = null
            },
            onkeydown: e => {
                if (e.key === 'Enter') {
                    task.name = e.target.value.trim()
                    state.editingId = null
                } else if (e.key === 'Escape') {
                    state.editingId = null
                }
            }
        })
    )
}
// infoFooter shows the footer with task count, filters, and clear completed button
function infoFooter() {
    const activeCount = state.tasks.filter(t => !t.completed).length

    // Show "No tasks available" only the first time (when app loads or completed tasks are cleared)
    //if (activeCount === 0 && state.tasks.length === 0 && state.currentId === 1) {
    if (state.tasks.length === 0) {  // this should suffice. infoFooter didn't disappear when removing tasks individually
        return ''
    }
    
    return createVNode('footer', { class: 'footer', style: 'display: block;' },
        createVNode('span', { class: 'todo-count' },
            createVNode('strong', {}, `${activeCount}`),
            ` item${activeCount !== 1 ? 's' : ''} left`),
        createVNode('ul', { class: 'filters' },
            ...['all', 'active', 'completed'].map(f =>
                createVNode('li', {},
                    createVNode('a', { href: `/#${f}`, class: isActiveRoute(f) ? 'selected' : '' }, capFirstLetter(f))
                )
            ),
        ),

        createVNode('button', {
            class: 'clear-completed',
            style: state.tasks.some(t => t.completed) ? 'display: block;' : 'display: none;',
            onclick: () => {
                state.tasks = state.tasks.filter(t => !t.completed)
                state.currentId = state.tasks.length > 0 ? Math.max(...state.tasks.map(t => t.id)) + 1 : 1
            }
        }, 'Clear Completed')
    )
}

function footer() {
    return createVNode('footer', { class: 'info' },
        createVNode('p', {}, 'Double-click to edit a todo'),
        createVNode('p', {},
            createVNode('span', {}, 'Created by '),
            createVNode('a', { href: 'https://github.com/MarkusYPA' }, 'MarkusYPA, '),
            createVNode('a', { href: 'https://github.com/RuBoMa' }, 'RuBoMa, '),
            createVNode('a', { href: 'https://github.com/Toft08' }, 'Toft08, '),
            createVNode('a', { href: 'https://github.com/prahimi94' }, 'prahimi94, '),
            createVNode('a', { href: 'https://github.com/mareerray' }, 'mareerray '),
        ),
        createVNode('a', { href: 'https://github.com/RuBoMa/mini-framework-git' }, 'TodoMVC')
    )
}

function capFirstLetter(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return '' // Handle non-string or empty input
    }
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// Initialize router and start app
initRouter(handleRouteChange)
subscribe(() => update())       // subscribe update() to state changes
update()