// the helper h takes a tag, and object of attributes and child objects or content
// (string or number) and creates a JavaScript object ready to be rendered into html
export function h(tag, attrs = {}, ...children) {
    return { tag, attrs, children };
}


export function render(vnode) {
    if (typeof vnode === "string" || typeof vnode === "number") {
        return document.createTextNode(vnode);
    }

    const el = document.createElement(vnode.tag);

    for (const [key, value] of Object.entries(vnode.attrs || {})) {
        if (key.startsWith("on") && typeof value === "function") {
            el.addEventListener(key.slice(2).toLowerCase(), value);     // is this allowed?
        } else if (key in el) {
            el[key] = value; // handles checked, value, disabled, etc.
        } else {
            el.setAttribute(key, value);
        }
    }

    (vnode.children || []).forEach(child =>
        el.appendChild(render(child))
    );

    return el;
}

export function mount(root, vnode) {

    console.log("Mounting vnode:", vnode);
    if (!(root instanceof Element)) {
        throw new Error("Root must be a DOM Element");
    }
    if (!vnode || typeof vnode !== "object" || !vnode.tag) {
        throw new Error("Invalid vnode structure");
    }

    root.innerHTML = "";
    root.appendChild(render(vnode));
}
