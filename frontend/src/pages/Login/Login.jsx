import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import style from "./css/Login.module.css";
import Logo from "../../assets/logo_rancho.png";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, autenticado, inicializando } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (!inicializando && autenticado && location.pathname === "/login") {
            navigate("/visao-geral", { replace: true });
        }
    }, [autenticado, inicializando, location.pathname, navigate]);

    async function Entrar(event) {
        event.preventDefault();
        setErro("");
        setCarregando(true);
        try {
            await login(email, senha);
            const destino = location.state?.from || "/visao-geral";
            navigate(destino, { replace: true });
        } catch {
            setErro("E-mail ou senha inválidos.");
        } finally {
            setCarregando(false);
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

                <form className={style.inputsLogin} onSubmit={Entrar}>
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
                </form>

                <div className={style.botaoMensagem}>
                    <Button
                        label={carregando ? "Entrando..." : "Entrar"}
                        acao={Entrar}
                        disabled={carregando}
                    />
                    {erro && <p role="alert">{erro}</p>}

                    <p className={style.mensagemAcesso}>
                        Acesso exclusivo para gestores
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;