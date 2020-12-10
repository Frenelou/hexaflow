const createNodeAndAppendTo = (tag, attributes, parent, prepend, dataAttributes) => {
    let el = Object.assign(document.createElement(tag), attributes);
    prepend ? parent.prepend(el) : parent.appendChild(el);
    dataAttributes ? setDataAttributes(el, dataAttributes) : null;
    return el;
}
module.exports.createNodeAndAppendTo = createNodeAndAppendTo;

const setDataAttributes = (el, attributes) => {
    for (const key in attributes) !attributes[key].includes("undefined") ?
    el.dataset[key] = attributes[key] :
    null
}
module.exports.setDataAttributes = setDataAttributes;