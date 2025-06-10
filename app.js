import { h, mount } from './mini.js';
import { initRouter, navigateTo, isActiveRoute } from './router.js';

let state = {
    tasks: [],
    filter: "all",
    editingId: null,
};

// Map routes to filter states
function routeToFilter(route) {
    if (route === "active" || route === "/active") return "active";
    if (route === "completed" || route === "/completed") return "completed";
    return "all";
}

// Map filter states to routes
function filterToRoute(filter) {
    return filter === "all" ? "/" : filter;
}

function handleRouteChange(route) {
    state.filter = routeToFilter(route);
    update();
}

function update() {
    //const root = document.getElementById("app");
    const root = document.body;
    mount(root, App());
}

function App() {
    const visibleTasks = state.tasks.filter(task => {
        if (state.filter === "active") return !task.completed;
        if (state.filter === "completed") return task.completed;
        return true;
    });

    return h("section", { class: "todoapp" },
        h("header", { class: "header" },

            h("h1", {}, "todos"),

            h("input", {
                type: "text",
                class: "new-todo",
                placeholder: "What needs to be done?",
                autofocus: "",
                onkeydown: e => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                        state.tasks.push({
                            id: Date.now(), // example uses small incrementing values
                            name: e.target.value.trim(),
                            completed: false,
                        });
                        e.target.value = "";
                        update();
                    }
                }
            }),
        ),

        h("main", { class: "main", style: "display: block" },

            h("div", { class: "toggle-all-container" },
                h("input", {
                    class: "toggle-all",
                    type: "checkbox",
                },),

                h("label",
                    {
                        class: "toggle-all-label",
                        for: "toggle-all",
                        onclick: () => {
                            const allCompleted = state.tasks.length > 0 && state.tasks.every(t => t.completed);
                            state.tasks.forEach(t => t.completed = !allCompleted);
                            update();
                        }
                    },
                    "Mark all as complete")
            ),

            h("ul", { class: "todo-list" },
                ...visibleTasks.map(task => TaskItem(task))
            ),
        ),

        Footer()
    )

}

function TaskItem(task) {
    const isEditing = state.editingId === task.id;

    return h(
        "li",
        {
            'data-id': `${task.id}`,
            class: `${task.completed ? "completed" : ""} ${isEditing ? "editing" : ""}`
        },
        ...(isEditing
            // task item being edited
            ? [h("input", {
                type: "text",
                value: task.name,
                autofocus: true,
                onblur: e => {
                    task.name = e.target.value.trim();
                    state.editingId = null;
                    update();
                },
                onkeydown: e => {
                    if (e.key === "Enter") {
                        task.name = e.target.value.trim();
                        state.editingId = null;
                        update();
                    } else if (e.key === "Escape") {
                        state.editingId = null;
                        update();
                    }
                }
            })]
            // normal task item
            : [

                h("input", {
                    type: "checkbox",
                    class: "toggle",
                    checked: task.completed,
                    onchange: () => {
                        task.completed = !task.completed;
                        update();
                    }
                }),
                h("label", {
                    ondblclick: () => {
                        state.editingId = task.id;
                        update();
                    }
                }, task.name),
                h("button", {
                    class: "destroy",
                    onclick: () => {
                        state.tasks = state.tasks.filter(t => t.id !== task.id);
                        update();
                    }
                },)
            ])
    );

}

function Footer() {
    const activeCount = state.tasks.filter(t => !t.completed).length;

    return h("footer", { class: "footer", style: "display: block;" },
        h("span", { class: "todo-count" },
            h("strong", {}, `${activeCount}`),
            ` item${activeCount !== 1 ? "s" : ""} left`),
        h("ul", { class: "filters" },
            ...["all", "active", "completed"].map(f =>
                h("li", {},
                    h("a", { href: `/#${f}`, class: isActiveRoute(filterToRoute(f)) ? "selected" : "" }, f)
                )
            ),
        ),

        h("button", {
            class: "clear-completed",
            style: "display: block",
            onclick: () => {
                state.tasks = state.tasks.filter(t => !t.completed);
                update();
            }
        }, "Clear Completed")
    );
}

// Initialize router and start app
initRouter(handleRouteChange);
update();