import "./css/Input.css";

function Input({ label, id, type, placeholder }) {
    return (
        <div className="input">
            <p>{label}</p>

            <input
                id={id}
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
}

export default Input;