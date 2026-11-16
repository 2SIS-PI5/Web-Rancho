import { useEffect, useState } from "react";
import {
    UserPlus,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Pencil,
    Save,
    Eye,
    EyeOff
} from "lucide-react";

import api from "../../services/api";
import style from "./css/Usuarios.module.css";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [carregandoUsuarios, setCarregandoUsuarios] = useState(true);
    const [mostrarSenhaNovo, setMostrarSenhaNovo] = useState(false);
    const [mostrarSenhaEdicao, setMostrarSenhaEdicao] = useState(false);

    const [novoUsuario, setNovoUsuario] = useState({
        nome: "",
        email: "",
        senha: "",
        role: "ADMIN"
    });

    const [usuarioEdicao, setUsuarioEdicao] = useState({
        id: "",
        senha: "",
        role: ""
    });

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    const [salvandoNovo, setSalvandoNovo] = useState(false);
    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function carregarUsuarios() {
        setCarregandoUsuarios(true);
        setErro("");

        try {
            const resposta = await api.get("/usuarios");
            setUsuarios(resposta.data);
        } catch (error) {
            setErro(
                error.response?.data?.message ||
                "Não foi possível carregar os usuários."
            );
        } finally {
            setCarregandoUsuarios(false);
        }
    }

    function alterarNovoUsuario(event) {
        const { name, value } = event.target;

        setNovoUsuario((atual) => ({
            ...atual,
            [name]: value
        }));
    }

    function alterarEdicao(event) {
        const { name, value } = event.target;

        setUsuarioEdicao((atual) => ({
            ...atual,
            [name]: value
        }));
    }

    function selecionarUsuario(event) {
        const id = event.target.value;

        const usuarioSelecionado = usuarios.find(
            (usuario) => String(usuario.id) === id
        );

        setUsuarioEdicao({
            id,
            senha: "",
            role: usuarioSelecionado?.role || ""
        });

        setMensagem("");
        setErro("");
    }

    async function criarUsuario(event) {
        event.preventDefault();

        setSalvandoNovo(true);
        setMensagem("");
        setErro("");

        try {
            const resposta = await api.post("/usuarios", novoUsuario);

            setUsuarios((atual) => [...atual, resposta.data]);

            setNovoUsuario({
                nome: "",
                email: "",
                senha: "",
                role: "ADMIN"
            });

            setMensagem("Usuário criado com sucesso.");
        } catch (error) {
            setErro(
                error.response?.data?.message ||
                "Não foi possível criar o usuário."
            );
        } finally {
            setSalvandoNovo(false);
        }
    }

    async function atualizarUsuario(event) {
        event.preventDefault();

        if (!usuarioEdicao.id) {
            setErro("Selecione um usuário para editar.");
            return;
        }

        setSalvandoEdicao(true);
        setMensagem("");
        setErro("");

        try {
            const resposta = await api.put(
                `/usuarios/${usuarioEdicao.id}`,
                {
                    senha: usuarioEdicao.senha,
                    role: usuarioEdicao.role
                }
            );

            setUsuarios((atual) =>
                atual.map((usuario) =>
                    usuario.id === resposta.data.id
                        ? resposta.data
                        : usuario
                )
            );

            setUsuarioEdicao((atual) => ({
                ...atual,
                senha: ""
            }));

            setMensagem("Usuário atualizado com sucesso.");
        } catch (error) {
            setErro(
                error.response?.data?.message ||
                "Não foi possível atualizar o usuário."
            );
        } finally {
            setSalvandoEdicao(false);
        }
    }

    return (
        <section className={style.paginaUsuarios}>
            <header className={style.cabecalho}>
                <div>
                    <h1>Gerenciar usuários</h1>
                    <p>Gerencie os acessos ao sistema.</p>
                </div>
            </header>

            <div className={style.formulariosUsuarios}>

                {/* EDITAR USUÁRIO */}
                <div className={style.containerFormulario}>
                    <div className={style.tituloFormulario}>
                        <div className={style.iconeTitulo}>
                            <Pencil size={20} />
                        </div>

                        <div>
                            <h2>Editar usuário</h2>
                            <p>Altere a senha ou o perfil de acesso.</p>
                        </div>
                    </div>

                    <form
                        onSubmit={atualizarUsuario}
                        className={style.formulario}
                    >
                        <div className={style.grupoCampo}>
                            <label htmlFor="usuarioSelecionado">
                                Selecionar usuário
                            </label>

                            <select
                                id="usuarioSelecionado"
                                value={usuarioEdicao.id}
                                onChange={selecionarUsuario}
                                required
                                disabled={carregandoUsuarios}
                            >
                                <option value="">
                                    {carregandoUsuarios
                                        ? "Carregando usuários..."
                                        : "Selecione um usuário"}
                                </option>

                                {usuarios.map((usuario) => (
                                    <option
                                        key={usuario.id}
                                        value={usuario.id}
                                    >
                                        {usuario.nome} ({usuario.email})
                                    </option>
                                ))}
                            </select>

                            {!carregandoUsuarios && usuarios.length === 0 && (
                                <span className={style.textoAuxiliar}>
                                    Nenhum usuário encontrado.
                                </span>
                            )}
                        </div>

                        <div className={style.grupoCampo}>
                            <label htmlFor="senhaEdicao">
                                Nova senha
                            </label>

                            <div className={style.containerSenha}>
                                <input
                                    id="senhaEdicao"
                                    name="senha"
                                    type={mostrarSenhaEdicao ? "text" : "password"}
                                    placeholder="Digite uma nova senha"
                                    value={usuarioEdicao.senha}
                                    onChange={alterarEdicao}
                                    disabled={!usuarioEdicao.id}
                                />

                                <button
                                    type="button"
                                    className={style.botaoVisualizar}
                                    onClick={() => setMostrarSenhaEdicao(!mostrarSenhaEdicao)}
                                    aria-label="Alternar visualização da senha"
                                >
                                    {mostrarSenhaEdicao ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <span className={style.textoAuxiliar}>
                                Deixe vazio para manter a senha atual.
                            </span>
                        </div>

                        <div className={style.grupoCampo}>
                            <label htmlFor="roleEdicao">
                                Perfil de acesso
                            </label>

                            <select
                                id="roleEdicao"
                                name="role"
                                value={usuarioEdicao.role}
                                onChange={alterarEdicao}
                                required
                                disabled={!usuarioEdicao.id}
                            >
                                <option value="ADMIN">Administrador</option>
                                <option value="GESTOR">Gestor</option>
                            </select>

                            <div className={style.infoPerfil}>
                                <ShieldCheck size={16} />
                                <span>
                                    Defina o nível de acesso do usuário.
                                </span>
                            </div>
                        </div>

                        <div className={style.acoesFormulario}>
                            <button
                                type="submit"
                                disabled={
                                    salvandoEdicao ||
                                    !usuarioEdicao.id
                                }
                                className={style.botaoCriar}
                            >
                                <Save size={18} />
                                {salvandoEdicao
                                    ? "Salvando..."
                                    : "Salvar alterações"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* NOVO USUÁRIO */}
                <div className={style.containerFormulario}>
                    <div className={style.tituloFormulario}>
                        <div className={style.iconeTitulo}>
                            <UserPlus size={20} />
                        </div>

                        <div>
                            <h2>Novo usuário</h2>
                            <p>Cadastre um novo acesso ao sistema.</p>
                        </div>
                    </div>

                    <form
                        onSubmit={criarUsuario}
                        className={style.formulario}
                    >
                        <div className={style.grupoCampo}>
                            <label htmlFor="nome">
                                Nome completo
                            </label>

                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Digite o nome completo"
                                value={novoUsuario.nome}
                                onChange={alterarNovoUsuario}
                                required
                            />
                        </div>

                        <div className={style.grupoCampo}>
                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={novoUsuario.email}
                                onChange={alterarNovoUsuario}
                                required
                            />
                        </div>

                        <div className={style.grupoCampo}>
                            <label htmlFor="senha">
                                Senha
                            </label>

                            <div className={style.containerSenha}>
                                <input
                                    id="senha"
                                    name="senha"
                                    type={mostrarSenhaNovo ? "text" : "password"}
                                    placeholder="Digite uma senha"
                                    value={novoUsuario.senha}
                                    onChange={alterarNovoUsuario}
                                    required
                                />

                                <button
                                    type="button"
                                    className={style.botaoVisualizar}
                                    onClick={() => setMostrarSenhaNovo(!mostrarSenhaNovo)}
                                    aria-label="Alternar visualização da senha"
                                >
                                    {mostrarSenhaNovo ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className={style.grupoCampo}>
                            <label htmlFor="role">
                                Perfil de acesso
                            </label>

                            <select
                                id="role"
                                name="role"
                                value={novoUsuario.role}
                                onChange={alterarNovoUsuario}
                            >
                                <option value="ADMIN">
                                    Administrador
                                </option>
                                <option value="GESTOR">
                                    Gestor
                                </option>
                            </select>

                            <div className={style.infoPerfil}>
                                <ShieldCheck size={16} />
                                <span>
                                    Defina o nível de acesso do novo usuário.
                                </span>
                            </div>
                        </div>

                        <div className={style.acoesFormulario}>
                            <button
                                type="submit"
                                disabled={salvandoNovo}
                                className={style.botaoCriar}
                            >
                                <UserPlus size={18} />
                                {salvandoNovo
                                    ? "Criando..."
                                    : "Criar usuário"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {mensagem && (
                <div className={style.mensagemSucesso} role="status">
                    <CheckCircle2 size={18} />
                    <span>{mensagem}</span>
                </div>
            )}

            {erro && (
                <div className={style.mensagemErro} role="alert">
                    <AlertCircle size={18} />
                    <span>{erro}</span>
                </div>
            )}
        </section>
    );
}

export default Usuarios;