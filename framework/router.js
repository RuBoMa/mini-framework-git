let currentRoute = ''
let routeChangeCallback = null

export function initRouter(callback) {
    routeChangeCallback = callback

    // Listen for hash changes (back/forward navigation)
    window.addEventListener('hashchange', handleRouteChange)

    // Initialize route on page load
    handleRouteChange()
}

function handleRouteChange() {
    const hash = window.location.hash.slice(1) // Remove '#'
    currentRoute = hash || '/'

    if (routeChangeCallback) {
        routeChangeCallback(currentRoute)
    }
}

// Helper function to check if current route matches
export function isActiveRoute(route) {
    const normalizedRoute = route === '/' ? '' : route
    const normalizedCurrent = currentRoute === '/' ? '' : currentRoute
    return normalizedCurrent === normalizedRoute
}