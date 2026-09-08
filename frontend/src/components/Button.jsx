import "./css/Button.css";

function Button({ label, acao}) {
    return (
        <button className="botao" onClick={acao}>
            <p>{label}</p>
        </button>
    );
}

export default Button;