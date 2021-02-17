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
