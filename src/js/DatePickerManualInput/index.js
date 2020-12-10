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

        this.init()
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