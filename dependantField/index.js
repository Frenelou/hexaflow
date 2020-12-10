class dependantOf {
    constructor(el) {
        this.state = {
            childInput: el,
            childInputType: el.nodeName,
            parentInput: document.querySelector(el.dataset.hexDependantOf),
        };
        // -------------------------- Initialization ----------------------------- //
        this.watchIfEmptyParent();
        this.defaultDisabled();
    }
    defaultDisabled({ parentInput, childInput } = this.state) {
        if (parentInput.value === "" || parentInput.checked === false) childInput.disabled = true;
    }
    watchIfEmptyParent() {
        const deleteDisabled = this.deleteDisabled.bind(this);
        $(this.state.parentInput).on('change chosen:updated chosen:ready', e =>
            deleteDisabled(e.target.value === "" || e.target.checked === false));
    }
    deleteDisabled(isParentEmpty, { childInput } = this.state) {
        let isChbx = childInput.checked !== undefined;

        childInput.disabled = isParentEmpty;

        if (isParentEmpty) {
            if (isChbx) childInput.checked = false;
            else childInput.value = "";
        };

        $(childInput).trigger("chosen:updated")
    }
}

module.exports.dependantField = dependantField;

document.addEventListener('DOMContentLoaded', () =>
    document.querySelectorAll("[data-hex-dependant-of]").forEach((el) => new dependantOf(el))
);