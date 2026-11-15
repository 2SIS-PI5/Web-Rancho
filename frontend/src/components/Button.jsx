import style from "./css/Button.module.css";

function Button({ label, acao, disabled = false }) {
    return (
        <button className={style.botao} onClick={acao} disabled={disabled}>
            <p>{label}</p>
        </button>
    );
}

export default Button;