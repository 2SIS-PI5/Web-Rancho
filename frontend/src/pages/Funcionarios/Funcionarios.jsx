import style from "./css/Funcionarios.module.css";
import { Plus, Search, Pencil, Trash2, Star, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

const formularioInicial = { nome: "", telefone: "", cep: "", chavePix: "", area: "Cozinha", valorDiaria: "", ajudaTransporte: false };

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [area, setArea] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [erro, setErro] = useState("");

  async function carregarFuncionarios() {
    try { setFuncionarios(await api.listarFuncionarios(busca)); setErro(""); }
    catch (error) { setErro(error.message); }
  }
  useEffect(() => { carregarFuncionarios(); }, [busca]);

  function abrirModal(funcionario = null) {
    setEditando(funcionario?.id || null);
    setFormulario(funcionario ? { ...formularioInicial, ...funcionario } : formularioInicial);
    setModal(true);
  }
  function atualizarCampo(event) {
    const { name, value, type, checked } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: type === "checkbox" ? checked : value }));
  }
  async function salvar(event) {
    event.preventDefault();
    try {
      const dados = { ...formulario, valorDiaria: Number(formulario.valorDiaria) };
      if (editando) await api.atualizarFuncionario(editando, dados); else await api.criarFuncionario(dados);
      setModal(false); await carregarFuncionarios();
    } catch (error) { setErro(error.message); }
  }
  async function remover(id) {
    if (!window.confirm("Deseja excluir este funcionário?")) return;
    try { await api.removerFuncionario(id); await carregarFuncionarios(); }
    catch (error) { setErro(error.message); }
  }

  const filtrados = area ? funcionarios.filter((funcionario) => funcionario.area === area) : funcionarios;
  return (
    <>
      <div className={style.headerFuncionarios}>
        <div className={style.tituloFuncionarios}><h1>Funcionários</h1><p>Gerencie o cadastro dos funcionários</p></div>
        <div className={style.btnAdicionarFuncionario}><button onClick={() => abrirModal()}><Plus /><p>Adicionar Funcionário</p></button></div>
      </div>
      <div className={style.containerFuncionarios}>
        <div className={style.inputPesquisa}><Search /><input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar funcionário por nome..." /></div>
        <div className={style.areaFiltroFuncionarios}><p>Filtrar por Área</p><div className={style.btnsFiltros}>
          {[['', 'Todas as Áreas'], ['Cozinha', 'Cozinha'], ['Salão', 'Salão'], ['Atividades', 'Atividades']].map(([valor, label]) => <button key={label} onClick={() => setArea(valor)}>{label}</button>)}
        </div></div>
        {erro && <p>{erro}</p>}
        <div className={style.containerCardFuncionarios}>{filtrados.map((funcionario) => <div className={style.cardFuncionario} key={funcionario.id}>
          <div className={style.nomeAreaLocalizacao}><p className={style.nomeFuncionario}>{funcionario.nome}</p><p className={style.areaFuncionario}>{funcionario.area}</p><p className={style.distanciaFuncionario}><MapPin /> Próximo</p></div>
          <div className={style.estrelasFuncionario}><Star /><Star /><Star /><Star /><Star /><p>Sem avaliações</p></div>
          <div className={style.infosFuncionario}><p>Telefone: <span className={style.telefoneFuncionario}>{funcionario.telefone || "-"}</span></p><p>CEP: <span className={style.cepFuncionario}>{funcionario.cep || "-"}</span></p><p>Chave PIX: <span className={style.cepFuncionario}>{funcionario.chavePix || "-"}</span></p><p>Valor Diária: <span className={style.valorDiariaFuncionario}>R$ {Number(funcionario.valorDiaria).toFixed(2)}</span></p><p>Ajuda Transporte: <span className={style.ajudaTransporte}>{funcionario.ajudaTransporte ? "Sim" : "Não"}</span></p></div>
          <div className={style.btnsCardFuncionario}><button onClick={() => abrirModal(funcionario)}><Pencil /><p>Editar</p></button><button onClick={() => remover(funcionario.id)}><Trash2 /><p>Excluir</p></button></div>
        </div>)}</div>
      </div>
      {modal && <div className={style.overlay} onClick={() => setModal(false)}><form className={style.modalAdicionarFuncionario} onClick={(event) => event.stopPropagation()} onSubmit={salvar}>
        <div className={style.modalHeader}><div className={style.tituloModalAddFunc}><h2>{editando ? "Editar Funcionário" : "Novo Funcionário"}</h2></div><button type="button" className={style.btnFecharModal} onClick={() => setModal(false)}><X /></button></div>
        <div className={style.painelCadastroInfos}>
          <div className={style.duplaInputs}><div className={style.inputInfo}><p>Nome</p><input name="nome" value={formulario.nome} onChange={atualizarCampo} required /></div><div className={style.inputInfo}><p>Telefone</p><input name="telefone" value={formulario.telefone} onChange={atualizarCampo} /></div></div>
          <div className={style.duplaInputs}><div className={style.inputInfo}><p>CEP</p><input name="cep" value={formulario.cep} onChange={atualizarCampo} /></div><div className={style.inputInfo}><p>Chave PIX</p><input name="chavePix" value={formulario.chavePix} onChange={atualizarCampo} /></div></div>
          <div className={style.duplaInputs}><div className={style.inputInfo}><p>Área de Atuação</p><select name="area" value={formulario.area} onChange={atualizarCampo}><option>Cozinha</option><option>Salão</option><option>Atividades</option></select></div><div className={style.inputInfo}><p>Valor da Diária (R$)</p><input name="valorDiaria" type="number" min="0" step="0.01" value={formulario.valorDiaria} onChange={atualizarCampo} required /></div></div>
          <label className={style.inputCheck}><input name="ajudaTransporte" type="checkbox" checked={formulario.ajudaTransporte} onChange={atualizarCampo} /><p>Possui ajuda de transporte</p></label>
        </div>
        <div className={style.btnModalCadastro}><button type="button" onClick={() => setModal(false)}><p>Cancelar</p></button><button type="submit"><p>Salvar</p></button></div>
      </form></div>}
    </>
  );
}
export default Funcionarios;
