import "./css/Input.css";

function Input({ label, id, type, placeholder, value, onChange }) {
    return (
        <div className="input">
            <p>{label}</p>

            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Input;