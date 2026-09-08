import style from "./css/Input.module.css"

function Input({ label, id, type, placeholder }) {
    return (
        <div className={style.input}>
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