let currentRoute = ''
let routeChangeCallback = null

// This module provides a simple router for handling hash-based navigation in a web application.
export function initRouter(callback) {
    routeChangeCallback = callback

    // Listen for hash changes (back/forward navigation)
    window.onhashchange = handleRouteChange

    // Initialize route on page load
    handleRouteChange()
}

// handleRouteChange sets up the router and allows you to handle route changes
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
    return normalizedCurrent === normalizedRoute || (normalizedCurrent === '' && normalizedRoute === 'all')
}