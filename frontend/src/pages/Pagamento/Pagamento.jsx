import style from "./css/Pagamento.module.css";
import { Banknote, DollarSign, QrCode, CalendarDays } from "lucide-react";
import CardPgtoFunc from "./components/CardPgtoFunc";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatBRL } from "../../utils/formatadores";

function Pagamento() {
  const [areaSelecionada, setAreaSelecionada] = useState("Todas");
  const [filtroPagamento, setFiltroPagamento] = useState("Não Pagos");
  const [pagamentos, setPagamentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [resumo, setResumo] = useState({ totalPagoDinheiro: 0, totalPagoPix: 0, custoTotalMO: 0 });
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [pagandoId, setPagandoId] = useState(null);
  const [erro, setErro] = useState("");

  function mensagemErro(error, fallback) {
    const data = error.response?.data;
    return data?.message || (typeof data === "string" ? data : fallback);
  }

  async function buscarDados() {
    setCarregando(true);
    setErro("");
    try {
      const endpoint = filtroPagamento === "Pagos" ? "/pagamento/pagos" : filtroPagamento === "Não Pagos" ? "/pagamento/pendentes" : "/pagamento";
      const parametros = areaSelecionada === "Todas" ? {} : { setor: areaSelecionada };
      const [pagamentosResposta, resumoResposta, setoresResposta] = await Promise.all([
        api.get(endpoint, { params: parametros }),
        api.get("/pagamento/resumo"),
        api.get("/setores")
      ]);
      setPagamentos(pagamentosResposta.data);
      setResumo(resumoResposta.data);
      setSetores(setoresResposta.data);
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível carregar os pagamentos."));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { buscarDados(); }, [filtroPagamento, areaSelecionada]);

  async function gerarPagamentos() {
    if (!window.confirm("Deseja gerar os pagamentos?")) return;
    setProcessando(true);
    setErro("");
    try {
      await api.post("/pagamento/gerar");
      await buscarDados();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível gerar os pagamentos."));
    } finally {
      setProcessando(false);
    }
  }

  async function pagar(id, formaPagamento) {
    if (!Number.isFinite(Number(id))) {
      setErro("Pagamento inválido.");
      return;
    }
    setPagandoId(id);
    setErro("");
    try {
      await api.put(`/pagamento/${id}/pagar`, { formaPagamento });
      await buscarDados();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível realizar o pagamento."));
    } finally {
      setPagandoId(null);
    }
  }
  return (
    <>
      <div className={style.headerPagamento}>
        <div className={style.tituloPagamento}><h1>Gestão de Pagamentos</h1><p>Realize os pagamentos da operação</p></div>
      </div>
      <div className={style.containerPagamento}>
        <div className={style.cardResumoSemana}>
          <p className={style.tituloCardResumo}>Resumo da Semana</p>
          <div className={style.valoresPagamentos}>
            <div className={style.totalEmTipoPagto}>
              <Banknote />
              <p className={style.tipoTotal}>Dinheiro</p>
              <p className={style.totalValor}>{formatBRL(resumo.totalPagoDinheiro)}</p>
            </div>
            <div className={style.totalEmTipoPagto}>
              <QrCode />
              <p className={style.tipoTotal}>PIX</p>
              <p className={style.totalValor}>{formatBRL(resumo.totalPagoPix)}</p>
            </div>
            <div className={style.totalEmTipoPagto}>
              <DollarSign />
              <p className={style.tipoTotal}>Total Pagamento</p>
              <p className={style.totalValor}>{formatBRL(resumo.custoTotalMO)}</p>
            </div>
          </div>
        </div>
        <div className={style.cardGerarPagto}>
          <div className={style.headerCardGerarPagto}>
            <p className={style.tituloSemanaPagto}><CalendarDays />
              Semana de 19/09/2026</p>
            <button className={style.btnGerarPagto} disabled={processando} onClick={gerarPagamentos}>{processando ? "Gerando..." : "Gerar Pagamentos"}</button>
          </div>
          <div className={style.footerCardGerarPagto}>
            <button
              className={
                filtroPagamento === "Geral"
                  ? style.filtroPagamentoAtivo
                  : style.fitroPagto
              }
              onClick={() => setFiltroPagamento("Geral")}
            >
              <p>Geral</p>
              <p className={style.qtdPagtos}>{filtroPagamento === "Geral" ? pagamentos.length : ""}</p>
            </button>

            <button
              className={
                filtroPagamento === "Pagos"
                  ? style.filtroPagamentoAtivo
                  : style.fitroPagto
              }
              onClick={() => setFiltroPagamento("Pagos")}
            >
              <p>Pagos</p>
              <p className={style.qtdPagtos}>{filtroPagamento === "Pagos" ? pagamentos.length : ""}</p>
            </button>

            <button
              className={
                filtroPagamento === "Não Pagos"
                  ? style.filtroPagamentoAtivo
                  : style.fitroPagto
              }
              onClick={() => setFiltroPagamento("Não Pagos")}
            >
              <p>Não Pagos</p>
              <p className={style.qtdPagtos}>{filtroPagamento === "Não Pagos" ? pagamentos.length : ""}</p>
            </button>
          </div>
        </div>
        <div className={style.areaFiltroFuncionarios}>
          <div className={style.btnsFiltros}>
            <button
              className={areaSelecionada === "Todas" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Todas")}>
              Todas
            </button>

            {setores.map((setor) => <button key={setor.id} className={areaSelecionada === setor.nome ? style.filtroAtivo : ""} onClick={() => setAreaSelecionada(setor.nome)}>{setor.nome}</button>)}
          </div>
        </div>
        <div className={style.containerPagtosFuncs}>
          {carregando && <p>Carregando pagamentos...</p>}
          {!carregando && erro && <p>{erro}</p>}
          {!carregando && !erro && pagamentos.length === 0 && <p>{filtroPagamento === "Não Pagos" ? "Nenhum pagamento pendente. Clique em Gerar Pagamentos." : "Nenhum pagamento encontrado."}</p>}
          {!carregando && !erro && pagamentos.map((pagamento) => <CardPgtoFunc key={pagamento.id} id={pagamento.id} nome={pagamento.funcionarioNome} area={pagamento.setor} statusPagto={pagamento.status} telefone={pagamento.telefone} chavePix={pagamento.chavePix} diasTrabalhados={pagamento.quantidadeDias} valorDiaria={pagamento.valorDiaria} valorTotal={pagamento.valorAPagar} onPagar={pagar} pagando={pagandoId === pagamento.id} />)}
        </div>
      </div>
    </>
  )
}

export default Pagamento;