import { createVNode, mount } from '../framework/mini.js'
import { initRouter, isActiveRoute } from '../framework/router.js'

let state = {
    tasks: [],
    filter: 'all',
    editingId: null,
    currentId: 1,
}

// Map routes to filter states
function routeToFilter(route) {
    if (route === 'active' || route === '/active') return 'active'
    if (route === 'completed' || route === '/completed') return 'completed'
    return 'all'
}

// Map filter states to routes
function filterToRoute(filter) {
    return filter === 'all' ? '/' : filter
}

function handleRouteChange(route) {
    state.filter = routeToFilter(route)
    update()
}

function update(focusNewTodo = false) {
    const root = document.body
    mount(root, app())
    if (focusNewTodo) {
        setTimeout(() => {
            const input = document.querySelector('.new-todo')
            if (input) input.focus()
        })
    }
}

function app() {
    const visibleTasks = state.tasks.filter(task => {
        if (state.filter === 'active') return !task.completed
        if (state.filter === 'completed') return task.completed
        return true
    })

    return [
        sidebar(),

        createVNode('section', { class: 'todoapp' },
            createVNode('header', { class: 'header' },

                createVNode('h1', {}, 'todos'),

                createVNode('input', {
                    type: 'text',
                    class: 'new-todo',
                    placeholder: 'What needs to be done?',
                    autofocus: '',
                    onkeydown: e => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                            state.tasks.push({
                                id: state.currentId++,
                                name: e.target.value.trim(),
                                completed: false,
                            })
                            e.target.value = ''
                            update(true) // Only focus after adding a new task
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
                                update()
                            }
                        },
                        'Mark all as complete')
                ),

                createVNode('ul', { class: 'todo-list' },
                    ...visibleTasks.map(task => taskItem(task))
                ),
            ),
            infoFooter()
        ),

        footer()
    ]

}

function taskItem(task) {
    const isEditing = state.editingId === task.id

    return createVNode(
        'li',
        {
            'data-id': `${task.id}`,
            class: `${task.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`
        },

        ...(isEditing
            // task item being edited
            ? [createVNode('input', {
                type: 'text',
                value: task.name,
                autofocus: true,
                onblur: e => {
                    task.name = e.target.value.trim()
                    state.editingId = null
                    //update(); // creates double apps
                },
                onkeydown: e => {
                    if (e.key === 'Enter') {
                        task.name = e.target.value.trim()
                        state.editingId = null
                        update()
                    } else if (e.key === 'Escape') {
                        state.editingId = null
                        update()
                    }
                }
            })]
            // normal task item
            : [
                createVNode('input', {
                    type: 'checkbox',
                    class: 'toggle',
                    checked: task.completed,
                    onchange: () => {
                        task.completed = !task.completed
                        update()
                    }
                }),

                createVNode('label', {
                    ondblclick: () => {
                        state.editingId = task.id
                        update()
                    }
                }, task.name),

                createVNode('button', {
                    class: 'destroy',
                    onclick: () => {
                        state.tasks = state.tasks.filter(t => t.id !== task.id)
                        update()
                    }
                },)
            ])


    )

}

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
        ),
    )

}

function infoFooter() {
    const activeCount = state.tasks.filter(t => !t.completed).length

    return createVNode('footer', { class: 'footer', style: 'display: block;' },
        createVNode('span', { class: 'todo-count' },
            createVNode('strong', {}, `${activeCount}`),
            ` item${activeCount !== 1 ? 's' : ''} left`),
        createVNode('ul', { class: 'filters' },
            ...['all', 'active', 'completed'].map(f =>
                createVNode('li', {},
                    createVNode('a', { href: `/#${f}`, class: isActiveRoute(filterToRoute(f)) ? 'selected' : '' }, f)
                )
            ),
        ),


        createVNode('button', {
            class: 'clear-completed',
            style: state.tasks.some(t => t.completed) ? 'display: block;' : 'display: none;',
            onclick: () => {
                state.tasks = state.tasks.filter(t => !t.completed)
                update()
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

// Initialize router and start app
initRouter(handleRouteChange)
update()