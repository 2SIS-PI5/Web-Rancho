import style from "./css/Input.module.css"

function Input({ label, id, type, placeholder, value, onChange }) {
    return (
        <div className={style.input}>
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