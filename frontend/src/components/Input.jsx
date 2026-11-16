
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import style from "./css/Input.module.css";

function Input({ label, id, type, placeholder, value, onChange }) {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const tipoInput = type === "password" && mostrarSenha
        ? "text"
        : type;

    return (
        <div className={style.input}>
            <p>{label}</p>

            <div className={style.containerInput}>
                <input
                    id={id}
                    type={tipoInput}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />

                {type === "password" && (
                    <button
                        type="button"
                        className={style.botaoVisualizar}
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {mostrarSenha
                            ? <EyeOff size={19} />
                            : <Eye size={19} />
                        }
                    </button>
                )}
            </div>
        </div>
    );
}

export default Input;
