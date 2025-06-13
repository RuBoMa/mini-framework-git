let subscribers = []

function notify() {
    subscribers.forEach(fn => fn())
}

export function subscribe(fn) {
    subscribers.push(fn)
}

function makeReactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            const value = target[key]
            return (typeof value === 'object' && value !== null)
                ? makeReactive(value) // Deep proxy for nested objects
                : value
        },
        set(target, key, value) {
            target[key] = value
            notify()
            return true
        }
    })
}

export const state = makeReactive({
    tasks: [],
    filter: 'all',
    editingId: null,
    currentId: 1,
})
