import style from "./css/Funcionarios.module.css";
import CardFuncionario from "./components/CardFuncionario";
import ModalFuncionario from "./components/ModalFuncionario";
import ModalExcluirFuncionario from "./components/ModalExcluirFuncionario";
import api from "../../services/api";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

function Funcionarios() {
  function abrirModalExcluir(funcionario) {
    setFuncionarioExcluir(funcionario);
    setModalExcluirAberto(true);
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false);
    setFuncionarioExcluir(null);
  }

  function abrirModalEdicao(funcionario) {
    setFuncionarioSelecionado(funcionario);
    setModalAberto(true);
  }

  function abrirModalAdicionar() {
    setFuncionarioSelecionado(null);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setFuncionarioSelecionado(null);
  }

  const [areaSelecionada, setAreaSelecionada] = useState("Todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [funcionarioExcluir, setFuncionarioExcluir] = useState(null);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  const [funcionarios, setFuncionarios] = useState([]);
  const [setores, setSetores] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  function mapearFuncionario(funcionario) {
    return { ...funcionario, area: funcionario.setor };
  }

  async function buscarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [funcionariosResultado, setoresResultado] = await Promise.allSettled([
        api.get("/funcionarios"),
        api.get("/funcionarios/setores")
      ]);

      if (funcionariosResultado.status === "fulfilled") {
        setFuncionarios(funcionariosResultado.value.data.map(mapearFuncionario));
      } else {
        throw funcionariosResultado.reason;
      }
      if (setoresResultado.status === "fulfilled") {
        setSetores(setoresResultado.value.data);
      } else {
        console.error("Erro ao carregar setores:", setoresResultado.reason);
        setSetores([]);
      }

    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);

      if (error.response) {
        const status = error.response.status;

        if (status === 404) {
          setErro(
            `Endpoint não encontrado: ${error.response.data?.path || "verifique as rotas do backend"}.`
          );
        } else {
          setErro(
            error.response.data?.message ||
            error.response.data?.error ||
            `Erro ao carregar funcionários. Código HTTP: ${status}.`
          );
        }
      } else if (error.request) {
        setErro("Não foi possível obter uma resposta do servidor.");
      } else {
        setErro("Ocorreu um erro ao carregar os funcionários.");
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarDados();
  }, []);

  const funcionariosVisiveis = funcionarios.filter((funcionario) =>
    funcionario.status !== "INATIVO" &&
    (areaSelecionada === "Todas" || funcionario.area === areaSelecionada) &&
    funcionario.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <div className={style.headerFuncionarios}>
        <div className={style.tituloFuncionarios}><h1>Funcionários</h1><p>Gerencie o cadastro dos funcionários</p></div>
        <div className={style.btnAdicionarFuncionario}><button onClick={() => abrirModalAdicionar()}><Plus /><p>Adicionar Funcionário</p></button></div>
      </div>
      <div className={style.containerFuncionarios}>
        <div className={style.inputPesquisa}>
          <Search />
          <input type="text" placeholder="Buscar funcionário por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className={style.areaFiltroFuncionarios}>
          <p>Filtrar por Área</p>
          <div className={style.btnsFiltros}>
            <button
              className={areaSelecionada === "Todas" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Todas")}>
              Todas as Áreas
            </button>

            {setores.map((setor) => <button key={setor.id} className={areaSelecionada === setor.nome ? style.filtroAtivo : ""} onClick={() => setAreaSelecionada(setor.nome)}>{setor.nome}</button>)}
          </div>
        </div>
        <div className={style.containerCardFuncionarios}>
          {carregando && <p>Carregando funcionários...</p>}
          {!carregando && erro && <p>{erro}</p>}
          {!carregando && !erro && funcionariosVisiveis.length === 0 && <p>Nenhum funcionário encontrado.</p>}
          {!carregando && !erro && funcionariosVisiveis.map((f) => (
            <CardFuncionario key={f.id} nome={f.nome} area={f.area} telefone={f.telefone} cep={f.cep} chavePix={f.chavePix}
              valorDiaria={f.valorDiaria} ajudaTransporte={f.ajudaTransporte} onEditar={() => abrirModalEdicao(f)} onExcluir={() => abrirModalExcluir(f)} />
          ))}
        </div>
      </div>
      <ModalFuncionario aberto={modalAberto} onFechar={fecharModal} funcionario={funcionarioSelecionado} setores={setores} onSalvo={buscarDados} />
      <ModalExcluirFuncionario aberto={modalExcluirAberto} onFechar={fecharModalExcluir} funcionario={funcionarioExcluir}
        onConfirmar={async () => { await api.put(`/funcionarios/${funcionarioExcluir.id}/desativar`); await buscarDados(); fecharModalExcluir(); }}
      />
    </>
  )
}
export default Funcionarios;
