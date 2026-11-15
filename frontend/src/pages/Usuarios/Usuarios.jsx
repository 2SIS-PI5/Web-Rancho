import { useState } from "react";
import api from "../../services/api";

function Usuarios() {
    const [formulario, setFormulario] = useState({ nome: "", email: "", senha: "", role: "ADMIN" });
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    function alterarCampo(event) {
        setFormulario((atual) => ({ ...atual, [event.target.name]: event.target.value }));
    }

    async function criarUsuario(event) {
        event.preventDefault();
        setSalvando(true);
        setMensagem("");
        setErro("");
        try {
            await api.post("/usuarios", formulario);
            setFormulario({ nome: "", email: "", senha: "", role: "ADMIN" });
            setMensagem("Usuário criado com sucesso.");
        } catch (error) {
            setErro(error.response?.data?.message || "Não foi possível criar o usuário.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <section>
            <h1>Criar usuário</h1>
            <p>Cadastre outro acesso ao sistema.</p>
            <form onSubmit={criarUsuario}>
                <label>Nome<input name="nome" value={formulario.nome} onChange={alterarCampo} required /></label>
                <label>E-mail<input name="email" type="email" value={formulario.email} onChange={alterarCampo} required /></label>
                <label>Senha<input name="senha" type="password" value={formulario.senha} onChange={alterarCampo} required /></label>
                <label>Perfil<select name="role" value={formulario.role} onChange={alterarCampo}><option value="ADMIN">ADMIN</option><option value="GESTOR">GESTOR</option></select></label>
                <button type="submit" disabled={salvando}>{salvando ? "Criando..." : "Criar usuário"}</button>
            </form>
            {mensagem && <p role="status">{mensagem}</p>}
            {erro && <p role="alert">{erro}</p>}
        </section>
    );
}

export default Usuarios;
