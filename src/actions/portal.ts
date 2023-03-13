export default (node: Node, selector: string | HTMLElement=document.body) => {
    const parent = typeof selector === "string"
        ? document.querySelector(selector)
        : selector;

    if (!parent)
        throw new Error(`Couldn't find a node matching ${selector}`);

    parent.appendChild(node);
    return {
        destroy() {
            (node as any).remove()
        },
    };
};
