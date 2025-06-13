export const state = makeReactive({
    tasks: [],
    filter: 'all',      // 'all', 'active', or 'completed'
    editingId: null,
    currentId: 1,
})

// All functions to be notified when state changes
let subscribers = []

// Run the subscribed functions
function notify() {
    subscribers.forEach(fn => fn())
}

export function subscribe(fn) {
    subscribers.push(fn)
}

// Recursive Proxy: intercepts reads and writes
// Reactivity: when state is modified, calls notify()
function makeReactive(obj) {
    return new Proxy(obj, {

        // Handle property reads
        get(target, key) {
            const value = target[key]
            return (typeof value === 'object' && value !== null)
                ? makeReactive(value) // Deep proxy for nested objects
                : value
        },

        // Handle property writes
        set(target, key, value) {
            target[key] = value
            notify() // Trigger all subscribers when state changes
            return true
        }
    })
}
