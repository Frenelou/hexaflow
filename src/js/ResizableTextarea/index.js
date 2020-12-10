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
