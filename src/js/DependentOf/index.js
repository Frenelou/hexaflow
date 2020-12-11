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
