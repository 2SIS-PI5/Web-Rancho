import style from "./css/Avaliacoes.module.css";
import { Search } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../services/api";
import ModalAvaliacao from "./components/ModalAvaliacao";
import CardAvaliacao from "./components/CardAvaliacao";
import ModalAvaliacoes from "./components/ModalAvaliacoes";

function Avaliacoes() {

  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [modalAvaliacoes, setModalAvaliacoes] = useState(null);
  const [busca, setBusca] = useState("");
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  function mensagemErro(error, fallback) {
    const data = error.response?.data;
    return data?.message || (typeof data === "string" ? data : fallback);
  }

  async function buscarFuncionarios() {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await api.get("/avaliacao", { params: busca ? { nome: busca } : {} });
      setFuncionarios(resposta.data);
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível carregar as avaliações."));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const temporizador = setTimeout(buscarFuncionarios, 300);
    return () => clearTimeout(temporizador);
  }, [busca]);

  function abrirModalAvaliacao(funcionario) {
    setFuncionarioSelecionado(funcionario);
    setModalAberto(true);
  }

  function fecharModalAvaliacao() {
    setModalAberto(false);
    setFuncionarioSelecionado(null);
  }

  return (
    <>
      <div className={style.headerAvaliacoes}>
        <div className={style.tituloAvaliacoes}><h1>Avaliações</h1><p>Avalie o desempenho dos funcionários</p></div>
      </div>
      <div className={style.containerAvaliacoes}>
        <div className={style.inputPesquisa}>
          <Search />
          <input type="text" placeholder="Buscar funcionário por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className={style.painelAvaliacoes}>
          {carregando && <p>Carregando avaliações...</p>}
          {!carregando && erro && <p>{erro}</p>}
          {!carregando && !erro && funcionarios.length === 0 && <p>Nenhum funcionário encontrado.</p>}
          {!carregando && !erro && funcionarios.map((f) => (
            <CardAvaliacao key={f.funcionarioId} nome={f.nome} area={f.cargo} mediaAvaliacao={f.mediaAvaliacoes}
              qtdAvaliacoes={f.quantidadeAvaliacoes}
              onVerAvaliacoes={() => setModalAvaliacoes(f)}
              onAvaliar={() => abrirModalAvaliacao(f)}/>
          ))}
        </div>
      </div>
      {modalAberto && funcionarioSelecionado && (
        <ModalAvaliacao
          funcionario={funcionarioSelecionado}
          onFechar={fecharModalAvaliacao}
          onSalvo={buscarFuncionarios}
        />
      )}
      {modalAvaliacoes && <ModalAvaliacoes funcionario={modalAvaliacoes} onFechar={() => setModalAvaliacoes(null)} />}
    </>
  );
}

export default Avaliacoes;