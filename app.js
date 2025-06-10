import { h, mount } from './mini.js';

let state = {
    tasks: [],
    filter: "all",
    editingId: null,
};

function update() {
    const root = document.getElementById("app");
    mount(root, App());
}

function App() {
    const visibleTasks = state.tasks.filter(task => {
        if (state.filter === "active") return !task.completed;
        if (state.filter === "completed") return task.completed;
        return true;
    });

    return h("main", { id: "todoapp", class: "main" },

        h("h1", {}, "todos"),
        h("div", { class: "input-row" },  // wrapper for button + input

            h("button", {
                class: "toggle-all",
                onclick: () => {
                    const allCompleted = state.tasks.length > 0 && state.tasks.every(t => t.completed);
                    state.tasks.forEach(t => t.completed = !allCompleted);
                    update();
                }
            }, "v"),

            h("input", {
                type: "text",
                placeholder: "What needs to be done?",
                onkeydown: e => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                        state.tasks.push({
                            id: Date.now(),
                            name: e.target.value.trim(),
                            completed: false,
                        });
                        e.target.value = "";
                        update();
                    }
                }
            }),
        ),

        h("ul", {},
            ...visibleTasks.map(task => TaskItem(task))
        ),

        Footer()
    );
}

function TaskItem(task) {
    const isEditing = state.editingId === task.id;

    return h(
        "li",
        {
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
                    checked: task.completed,
                    onchange: () => {
                        task.completed = !task.completed;
                        update();
                    }
                }),
                h("span", {
                    ondblclick: () => {
                        state.editingId = task.id;
                        update();
                    }
                }, task.name),
                h("button", {
                    onclick: () => {
                        state.tasks = state.tasks.filter(t => t.id !== task.id);
                        update();
                    }
                }, "X")
            ])
    );

}

function Footer() {
    const activeCount = state.tasks.filter(t => !t.completed).length;

    return h("footer", {},
        h("span", {}, `${activeCount} task${activeCount !== 1 ? "s" : ""} left`),
        h("div", {},
            ...["all", "active", "completed"].map(f =>
                h("button", {
                    onclick: () => {
                        state.filter = f;
                        update();
                    },
                    class: state.filter === f ? "selected" : ""
                }, f)
            )
        ),
        h("button", {
            onclick: () => {
                state.tasks = state.tasks.filter(t => !t.completed);
                update();
            }
        }, "Clear Completed")
    );
}

update();
