const addBtnClass = "btn btn-sm btn-outline-secondary py-0";

const crossBtnGenerator = (func) => {
    return (
        <button
            type="button"
            class="close"
            aria-label="Close"
            style={{ display: "inline", marginLeft: "4px", float: "none" }}
            onClick={func}
        >
            <span aria-hidden="true">&times;</span>
        </button>
    );
};

const style = {
    addBtnClass,
    crossBtnGenerator,
};

export default style;
