import style from "./css/Funcionarios.module.css";
import CardFuncionario from "./components/CardFuncionario";
import ModalFuncionario from "./components/ModalFuncionario";
import ModalExcluirFuncionario from "./components/ModalExcluirFuncionario";
import api from "../../services/api";

import { Plus, Search, X, Users, AlertCircle, RefreshCw, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { corDoSetor } from "../../utils/setores";

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
    String(funcionario.nome ?? "").toLowerCase().includes(busca.toLowerCase())
  );
  const setoresFiltro = useMemo(() => setores.length ? setores : [...new Set(funcionarios.map((funcionario) => funcionario.area).filter(Boolean))].map((nome) => ({ id: nome, nome })), [setores, funcionarios]);
  const contagensSetor = useMemo(() => funcionarios.reduce((contagens, funcionario) => {
    if (funcionario.status !== "INATIVO") contagens[funcionario.area] = (contagens[funcionario.area] || 0) + 1;
    return contagens;
  }, {}), [funcionarios]);
  const ativos = funcionarios.filter((funcionario) => funcionario.status !== "INATIVO").length;
  const filtrosAtivos = Boolean(busca || areaSelecionada !== "Todas");
  const limparFiltros = () => { setBusca(""); setAreaSelecionada("Todas"); };

  return (
    <div className={style.paginaFuncionarios}>
      <div className={style.headerFuncionarios}>
        <div className={style.tituloFuncionarios}><h1>Funcionários</h1><p>{funcionarios.length} cadastrados{funcionarios.some((funcionario) => funcionario.status !== undefined) && ` · ${ativos} ativos`}</p></div>
        <div className={style.btnAdicionarFuncionario}><button onClick={() => abrirModalAdicionar()}><Plus /><p>Adicionar Funcionário</p></button></div>
      </div>
      <div className={style.containerFuncionarios}>
        <div className={style.toolbarFuncionarios}>
          <div className={style.toolbarBusca}><div className={style.inputPesquisa}><Search /><input aria-label="Buscar funcionário por nome" type="text" placeholder="Buscar funcionário por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} />{busca && <button aria-label="Limpar busca" onClick={() => setBusca("")}><X /></button>}</div></div>
          <div className={style.areaFiltroFuncionarios}>
            <span className={style.labelFiltro}><Filter /> Filtrar por área</span>
            <div className={style.btnsFiltros}>
              <button aria-pressed={areaSelecionada === "Todas"} className={areaSelecionada === "Todas" ? style.filtroAtivo : ""} onClick={() => setAreaSelecionada("Todas")}><i />Todas as Áreas <b>{ativos}</b></button>
              {setoresFiltro.map((setor) => <button aria-pressed={areaSelecionada === setor.nome} key={setor.id} style={{ "--cor-setor": corDoSetor(setor.nome) }} className={areaSelecionada === setor.nome ? style.filtroAtivo : ""} onClick={() => setAreaSelecionada(setor.nome)}><i />{setor.nome}<b>{contagensSetor[setor.nome] || 0}</b></button>)}
            </div>
          </div>
          {filtrosAtivos && <button className={style.btnLimparFiltros} onClick={limparFiltros}>Limpar filtros</button>}
        </div>
        <div className={style.containerCardFuncionarios}>
          {carregando && <div className={style.skeletonFuncionarios}>{[1, 2, 3, 4].map((item) => <span key={item} />)}</div>}
          {!carregando && erro && <div className={style.estadoFuncionarios}><AlertCircle /><p>{erro}</p><button onClick={buscarDados}><RefreshCw />Tentar novamente</button></div>}
          {!carregando && !erro && funcionarios.length === 0 && <div className={style.estadoFuncionarios}><Users /><strong>Nenhum funcionário cadastrado</strong><p>Adicione o primeiro funcionário para começar.</p></div>}
          {!carregando && !erro && funcionarios.length > 0 && funcionariosVisiveis.length === 0 && <div className={style.estadoFuncionarios}><Filter /><strong>Nenhum resultado para os filtros</strong><button className={style.btnLimparFiltros} onClick={limparFiltros}>Limpar filtros</button></div>}
          {!carregando && !erro && funcionariosVisiveis.map((f) => (
            <CardFuncionario key={f.id} nome={f.nome} area={f.area} status={f.status} telefone={f.telefone} cep={f.cep} chavePix={f.chavePix}
              valorDiaria={f.valorDiaria} ajudaTransporte={f.ajudaTransporte} onEditar={() => abrirModalEdicao(f)} onExcluir={() => abrirModalExcluir(f)} />
          ))}
        </div>
      </div>
      <ModalFuncionario aberto={modalAberto} onFechar={fecharModal} funcionario={funcionarioSelecionado} setores={setores} onSalvo={buscarDados} />
      <ModalExcluirFuncionario aberto={modalExcluirAberto} onFechar={fecharModalExcluir} funcionario={funcionarioExcluir}
        onConfirmar={async () => { await api.put(`/funcionarios/${funcionarioExcluir.id}/desativar`); await buscarDados(); fecharModalExcluir(); }}
      />
    </div>
  )
}
export default Funcionarios;
