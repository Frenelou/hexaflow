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
class DatePickerManualInput {
    constructor(target) {
        this.state = {
            input: target.querySelector(".flatpickr-input"),
            fp: target._flatpickr,
            resetBtn: target.parentNode.querySelector(".js-reset"),
            placeholder: target.querySelector(".flatpickr-input").placeholder,
            isValidInput: null,
            getIsValidInput: () => this.state.isValidInput,
            setIsValidInput: bool => {
                this.state.isValidInput = bool;
                this.toggleErrorMsg(bool);
            },
            wrapper: () => this.state.input.closest(".flatpickr-wrapper"),
            errorMsg: createNodeAndAppendTo("p", { className: "m-0 text-danger hidden", innerText: "Date non valide" },
                target.closest(".flatpickr-wrapper").parentNode)
        }

        this.init();
    }
    init() {
        this.dateFormat();
        this.changeFpConfig(); // Allows adding input manually
        this.removeReadonly(); // Removes readonly attribute from input
        this.removeToggleOnInputClick(); // Prevents calendar jumping when clicking on input
        this.handleBlur(); // Validates date on blur
        this.handleFocus();
        this.handleReset();
    }
    changeFpConfig() {
        this.state.fp.set("clickOpens", false);
        this.state.fp.set("allowInput", true);
        this.state.fp.set("dateFormat", this.dateFormat());
    }
    dateFormat({ placeholder } = this.state) {
        if (placeholder && placeholder === "jj/mm/aa") { return "d/m/y" }
        return "d/m/Y";
    }
    toFullYear(date) {
        return date.length === 10 ? date : date.substring(0, 6) + "20" + date.substring(6);
    }
    handleBlur({ fp, input, setIsValidInput, getIsValidInput } = this.state) {
        this.state.input.addEventListener("blur", e => {
            if (e.target.value.length < 1) {
                setIsValidInput(true);
                return fp.clear();
            };
            setIsValidInput(e.target.value.match(/^(3[01]|[12][0-9]|0?[1-9])[./-](1[0-2]|0?[1-9])[./-](?:[0-9]{2})?[0-9]{2}$/) != null);

            if (getIsValidInput()) fp.setDate(this.toFullYear(e.target.value)); // If date is valid, update calendar
            else {
                input.placeholder = e.target.value;
                fp.clear()
            };
        })
    }
    toggleErrorMsg(bool, { errorMsg, input, placeholder, wrapper } = this.state) {
        if (!!bool) input.placeholder = placeholder;
        wrapper().classList.toggle("is-invalid", !bool);
        errorMsg.classList.toggle("hidden", bool);
    }
    handleFocus({ input, wrapper, setIsValidInput } = this.state) {
        this.state.input.addEventListener("focus", () => {
            if (!wrapper().classList.contains("is-invalid")) return;
            input.value = input.placeholder;
            setIsValidInput(true);
        })
    }
    handleReset({ wrapper, setIsValidInput } = this.state) {
        wrapper().addEventListener("click", e => {
            e.target.classList.contains("icons-close") || e.target.classList.contains("js-reset") ?
                setIsValidInput(true) : null;
        })
    }
    removeReadonly() {
        this.state.input.removeAttribute("readonly");
    }
    removeToggleOnInputClick({ input } = this.state) {
        input.closest("[data-toggle]").addEventListener("click", e => e.target === input ? e.stopPropagation() : null, true);
    }
}


module.exports.DatePickerManualInput = DatePickerManualInput;
/* global $ */

class DependentOf {
    constructor(el, parents) {
        this.parents = parents || el.dataset.hexDependantOf;
        this.state = {
            childInput: el,
            childInputType: el.nodeName,
            parentInput: this.parents.split(",").map(p => document.querySelector(p))
        };

        // -------------------------- Initialization ----------------------------- //
        this.checkIfEmptyParent();
        this.watchIfEmptyParent();
    }

    watchIfEmptyParent({ parentInput } = this.state) {
        const checkIfEmptyParent = this.checkIfEmptyParent.bind(this);
        parentInput.forEach(p =>
            $(p).on('keyup change chosen:updated chosen:ready', () => checkIfEmptyParent())
        )
    }

    checkIfEmptyParent() {
        let isParentEmpty = this.state.parentInput.every(pi =>
            pi.type === "checkbox" ? pi.checked === false : pi.value === "");

        return this.deleteDisabled(isParentEmpty);
    }

    deleteDisabled(isParentEmpty, { childInput } = this.state) {
        childInput.disabled = isParentEmpty;

        if (isParentEmpty) {
            if (childInput.type === "checkbox") childInput.checked = false;
            else childInput.value = "";
        };

        $(childInput).trigger("chosen:updated")
    }
}

module.exports.DependentOf = DependentOf;

document.addEventListener('DOMContentLoaded', () =>
    document.querySelectorAll("[data-hex-dependant-of]").forEach((el) => new DependentOf(el))
);

class ResizableTextarea {
    constructor(target) {
        this.target = target;

        /*================= Initialisation ================*/
        this.textAreaFix();
        this.setupObserver();
    }

    textAreaFix() {
        let target = this.target;
        target.rows = "1";
        target.classList.add("reziable-textarea");
        target.addEventListener('dblclick', e => e.stopPropagation());
        this.resize();
    }
    setupObserver() {
        let observe,
            target = this.target;

        const resize = this.resize.bind(this);
        const delayedResize = this.delayedResize.bind(this);


        if (window.attachEvent) {
            observe = function (element, event, handler) {
                element.attachEvent('on' + event, handler);
            };
        }
        else {
            observe = function (element, event, handler) {
                element.addEventListener(event, handler, false);
            };
        }
        observe(target, 'change', resize);
        observe(target, 'cut', delayedResize);
        observe(target, 'paste', delayedResize);
        observe(target, 'drop', delayedResize);
        observe(target, 'keydown', delayedResize);
    }
    resize() {
        let target = this.target;
        target.style.height = target.scrollHeight + 'px';
    }
    delayedResize() {
        const resize = this.resize.bind(this);
        window.setTimeout(resize, 0);
    }
}
module.exports.ResizableTextarea = ResizableTextarea;

class TableWithResizableCols {
    constructor(table) {
        this.state = {
            head: table,
            headers: table.querySelectorAll(
                ".hex-resizable-col") || table.querySelectorAll(
                "th:not(:last-child), td:not(:last-child)"),
            pressed: false,
            start: undefined,
            startX: undefined,
            startWidth: undefined,
        }
        this.setState = newstate => this.state = newstate;
        this.init();
    }
    init() {
        this.addHandles();
        this.handleMouseDown();
        this.handleMouseMove();
        this.handleMouseUp();
    }
    addHandles() {
        this.state.headers.forEach(th => {
            let handle = document.createElement("div"),
                style = {
                    position: "absolute",
                    height: "100%",
                    width: "5px",
                    top: 0,
                    right: 0,
                }

            th.style.position = "relative";
            handle.classList.add("handle");
            th.appendChild(handle);

            Object.assign(handle.style, style);

            handle.addEventListener("mouseenter", e => handle.style.cursor = "col-resize")
            handle.addEventListener("mouseout", e => e => handle.style.cursor = "default")
        })
    }
    handleMouseDown() {
        this.state.headers.forEach(th => {
            th.dataset.hexMinWidth = th.clientWidth;
            th.addEventListener("mousedown", e => {
                if (!e.target.classList.contains("handle")) return;
                th.classList.add("resizing");
                this.setState({
                    ...this.state,
                    start: th,
                    pressed: true,
                    startX: e.pageX,
                    startWidth: th.clientWidth,
                    hexMinWidth: th.dataset.hexMinWidth
                });
            })
        })
    }
    handleMouseMove() {
        this.state.head.addEventListener("mousemove", e => {
            let { start, startWidth, startX, pressed, hexMinWidth } = this.state,
                newWidth = startWidth + (e.pageX - startX);

            if (pressed && newWidth >= hexMinWidth) start.style.minWidth = newWidth + "px";
        });
    }
    handleMouseUp() {
        this.state.head.addEventListener("mouseup", () => {
            let state = this.state;

            if (state.pressed) {
                state.start.classList.remove("resizing");
                this.setState({
                    ...state,
                    startWidth: undefined,
                    pressed: false,
                });
            }
        });
    }
}
module.exports.TableWithResizableCols = TableWithResizableCols;

window.addEventListener("DOMContentLoaded", () =>
    document.querySelectorAll(".hex-table-with-resizable-cols").forEach(t => new TableWithResizableCols(t))
);
