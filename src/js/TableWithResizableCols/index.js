class TableWithResizableCols {
    constructor(table) {
        this.state = {
            head: table.querySelector("thead"),
            headers: table.querySelectorAll(
                "th:not(:last-child)"),
            pressed: false,
            start: undefined,
            startX: undefined,
            startWidth: undefined,
        }
        this.setState = newstate => this.state = newstate;
        this.getState = () => this.state;
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

            handle.addEventListener("mouseenter", e => this.toggleResizeCursor(true))
            handle.addEventListener("mouseout", e => this.toggleResizeCursor(false))
        })
    }
    toggleResizeCursor(bool) {
        this.state.head.style.cursor = bool ? "col-resize" : "default";
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
            let { start, startWidth, startX, pressed, hexMinWidth } = this.getState(),
                newWidth = startWidth + (e.pageX - startX);

            if (pressed && newWidth >= hexMinWidth) start.style.minWidth = newWidth + "px";
        });
    }
    handleMouseUp() {
        this.state.head.addEventListener("mouseup", () => {
            let state = this.getState();

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