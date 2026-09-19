import "./css/Login.css";

import Logo from "../assets/logo_rancho.png";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, salvarSessao } from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function Entrar(event) {
        event?.preventDefault();
        setErro("");
        setCarregando(true);
        try {
            const sessao = await api.login(email, senha);
            salvarSessao(sessao);
            navigate("/visao-geral");
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <form className="container" onSubmit={Entrar}>
            <div className="painel_login">
                <div className="titulo_logo">
                    <div className="logo">
                        <img src={Logo} alt="" />
                    </div>

                    <div className="titulo">
                        <h1>Rancho do Comanche</h1>
                        <p>Sistema de Gestão de Pagamentos</p>
                    </div>
                </div>
                <div className="inputs_login">
                    <Input
                        label="E-mail"
                        id="inpt_email"
                        type="email"
                        placeholder="Digite o e-mail do usuário"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <Input
                        label="Senha"
                        id="inpt_senha"
                        type="password"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                    />
                </div>
                <div className="botao_mensagem">
                    <Button label={carregando ? "Entrando..." : "Entrar"} acao={Entrar} />
                    {erro && <p className="mensagem_acesso">{erro}</p>}
                    <p className="mensagem_acesso">Acesso exclusivo para gestores</p>
                </div>
            </div>

        </form>
    );
}

export default Login;