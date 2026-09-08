import "./css/Login.css";

import Logo from "../assets/logo_rancho.png";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
    function Entrar() {
        console.log("Tentado fazer login...")
    }

    return (
        <div className="container">
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
                    />

                    <Input
                        label="Senha"
                        id="inpt_senha"
                        type="password"
                        placeholder="••••••••"
                    />
                </div>
                <div className="botao_mensagem">
                    <Button
                        label="Entrar"
                        acao={Entrar}
                    />
                    <p className="mensagem_acesso">Acesso exclusivo para gestores</p>
                </div>
            </div>

        </div>
    );
}

export default Login;