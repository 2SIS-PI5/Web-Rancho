import style from "./css/Button.module.css";

function Button({ label, acao}) {
    return (
        <button className={style.botao} onClick={acao}>
            <p>{label}</p>
        </button>
    );
}

export default Button;