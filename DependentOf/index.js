class DependentOf {
    constructor(el, parents) {
        this.parents = parents || el.dataset.hexDependantOf;
        this.state = {
            childInput: el,
            childInputType: el.nodeName,
            parentInput: this.parents.split(",").map(p => document.querySelector(p))
        };
        // -------------------------- Initialization ----------------------------- //
        this.watchIfEmptyParent();
        this.defaultDisabled();
    }
    defaultDisabled({ parentInput, childInput } = this.state) {
        if (parentInput.every(p => p.value === "" || p.checked === false)) childInput.disabled = true;
    }
    watchIfEmptyParent({ parentInput } = this.state) {
        const deleteDisabled = this.deleteDisabled.bind(this);
        parentInput.forEach(p =>
            $(p).on('keyup change chosen:updated chosen:ready', () =>
                deleteDisabled(parentInput.every(pi => {
                    if (pi.type === "checkbox") return pi.checked === false
                    else return pi.value === "";
                })))
        )
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
