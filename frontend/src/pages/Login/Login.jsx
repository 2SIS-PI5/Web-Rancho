import { useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./css/Login.module.css";
import Logo from "../../assets/logo_rancho.png";
import Input from "../../components/Input";
import Button from "../../components/Button";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    function Entrar() {
        if (
            email === "ranchodocomanche@gmail.com" &&
            senha === "rancho123"
        ) {
            navigate("/escala");
        } else {
            alert("E-mail ou senha incorretos!");
        }
    }

    return (
        <div className={style.container}>
            <div className={style.painelLogin}>
                <div className={style.tituloLogo}>
                    <div className={style.logo}>
                        <img src={Logo} alt="" />
                    </div>

                    <div className={style.titulo}>
                        <h1>Rancho do Comanche</h1>
                        <p>Sistema de Gestão de Pagamentos</p>
                    </div>
                </div>

                <div className={style.inputsLogin}>
                    <Input
                        label="E-mail"
                        id="inpt_email"
                        type="email"
                        placeholder="Digite o e-mail do usuário"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Senha"
                        id="inpt_senha"
                        type="password"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <div className={style.botaoMensagem}>
                    <Button
                        label="Entrar"
                        acao={Entrar}
                    />

                    <p className={style.mensagemAcesso}>
                        Acesso exclusivo para gestores
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;