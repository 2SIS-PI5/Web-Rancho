import style from "./css/Pagamento.module.css";
import {
  Banknote,
  DollarSign,
  QrCode,
  CalendarDays,
  X,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

import CardPgtoFunc from "./components/CardPgtoFunc";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatBRL } from "../../utils/formatadores";

function Pagamento() {
  const [areaSelecionada, setAreaSelecionada] = useState("Todas");
  const [filtroPagamento, setFiltroPagamento] = useState("Geral");
  const [pagamentos, setPagamentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [resumo, setResumo] = useState({ totalPagoDinheiro: 0, totalPagoPix: 0, custoTotalMO: 0 });
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [pagandoId, setPagandoId] = useState(null);
  const [erro, setErro] = useState("");
  const [alerta, setAlerta] = useState(null);
  const [confirmacaoGerar, setConfirmacaoGerar] = useState(false);
  const [periodoInicioSemana, setPeriodoInicioSemana] = useState(null);

  function mostrarAlerta(mensagem, tipo = "sucesso") {
    setAlerta({
      mensagem,
      tipo
    });
  }

  function mensagemErro(error, fallback) {
    const data = error.response?.data;
    return data?.message || (typeof data === "string" ? data : fallback);
  }

  async function buscarDados() {
    setErro("");

    try {
      const endpoint =
        filtroPagamento === "Pagos"
          ? "/pagamento/pagos"
          : filtroPagamento === "Não Pagos"
            ? "/pagamento/pendentes"
            : "/pagamento";

      const parametros =
        areaSelecionada === "Todas"
          ? {}
          : { setor: areaSelecionada };

      const resultados = await Promise.allSettled([
        api.get(endpoint, { params: parametros }),
        api.get("/pagamento/resumo"),
        api.get("/funcionarios/setores"),
        api.get("/pagamento", { params: parametros })
      ]);
      const [pagamentosResultado, resumoResultado, setoresResultado, todosPagamentosResultado] = resultados;
      if (pagamentosResultado.status === "rejected"
        || resumoResultado.status === "rejected"
        || todosPagamentosResultado.status === "rejected") {
        throw pagamentosResultado.reason || resumoResultado.reason || todosPagamentosResultado.reason;
      }
      const pagamentosResposta = pagamentosResultado.value;
      const resumoResposta = resumoResultado.value;
      const todosPagamentosResposta = todosPagamentosResultado.value;

      setPagamentos(pagamentosResposta.data);
      setResumo(resumoResposta.data);
      if (setoresResultado.status === "fulfilled") {
        setSetores(setoresResultado.value.data);
      } else {
        console.error("Erro ao carregar setores:", setoresResultado.reason);
        setSetores([]);
      }

      const todosPagamentos = todosPagamentosResposta.data;

      if (todosPagamentos.length > 0) {
        const pagamentosOrdenados = [...todosPagamentos].sort(
          (a, b) => new Date(a.periodoInicio) - new Date(b.periodoInicio)
        );

        setPeriodoInicioSemana(pagamentosOrdenados[0].periodoInicio);
      }

      setQuantidades({
        geral: todosPagamentos.length,
        pagos: todosPagamentos.filter(
          (pagamento) => pagamento.status === "PAGO"
        ).length,
        naoPagos: todosPagamentos.filter(
          (pagamento) => pagamento.status === "PENDENTE"
        ).length
      });

    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      setPagamentos([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { buscarDados(); }, [filtroPagamento, areaSelecionada]);

  const [quantidades, setQuantidades] = useState({
    geral: 0,
    pagos: 0,
    naoPagos: 0
  });

  async function gerarPagamentos() {
    setProcessando(true);
    setErro("");
    setAlerta(null);
    setConfirmacaoGerar(false);

    try {
      const resposta = await api.post("/pagamento/gerar");

      const quantidadeGerada = resposta.data.quantidadeGerada;

      if (quantidadeGerada === 0) {
        mostrarAlerta(
          "Todos os pagamentos já foram gerados!",
          "aviso"
        );
        return;
      }

      await buscarDados();

      mostrarAlerta(
        `${quantidadeGerada} pagamento(s) gerado(s) com sucesso!`,
        "sucesso"
      );
    } catch (error) {
      mostrarAlerta(
        mensagemErro(error, "Não foi possível gerar os pagamentos."),
        "aviso"
      );
    } finally {
      setProcessando(false);
    }
  }

  async function buscarResumo() {
    try {
      const resposta = await api.get("/pagamento/resumo");
      setResumo(resposta.data);
    } catch (error) {
      console.error("Erro ao atualizar o resumo:", error);
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

      setPagamentos((pagamentosAtuais) =>
        pagamentosAtuais.map((pagamento) =>
          pagamento.id === id
            ? {
              ...pagamento,
              status: "PAGO",
              formaPagamento: formaPagamento
            }
            : pagamento
        )
      );

      setQuantidades((quantidadesAtuais) => ({
        ...quantidadesAtuais,
        pagos: quantidadesAtuais.pagos + 1,
        naoPagos: Math.max(0, quantidadesAtuais.naoPagos - 1)
      }));

      await buscarResumo();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível realizar o pagamento."));
    } finally {
      setPagandoId(null);
    }
  }

  function obterPeriodoSemana(dataEscala) {
    if (!dataEscala) return "Semana não identificada";

    const data = new Date(`${dataEscala}T00:00:00`);

    const diaSemana = data.getDay();
    const diferenca = diaSemana === 0 ? -6 : 1 - diaSemana;

    const segunda = new Date(data);
    segunda.setDate(data.getDate() + diferenca);

    function formatarData(data) {
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }

    return `${formatarData(segunda)}`;
  }

  return (
    <>
      {alerta && (
        <div
          className={`${style.alertaSucesso} ${alerta.tipo === "aviso" ? style.alertaAviso : ""
            }`}
          role="alert"
        >
          {alerta.tipo === "sucesso" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}

          <p>{alerta.mensagem}</p>

          <button
            type="button"
            onClick={() => setAlerta(null)}
            aria-label="Fechar alerta"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {confirmacaoGerar && (
        <div className={style.fundoConfirmacao}>
          <div
            className={style.cardConfirmacao}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloConfirmacao"
          >
            <CalendarDays size={32} />

            <h2 id="tituloConfirmacao">Gerar pagamentos?</h2>

            <p>
              Deseja gerar os pagamentos das escalas que ainda não foram
              vinculadas a um pagamento?
            </p>

            <div className={style.botoesConfirmacao}>
              <button
                type="button"
                className={style.btnCancelarConfirmacao}
                onClick={() => setConfirmacaoGerar(false)}
                disabled={processando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={style.btnConfirmarConfirmacao}
                onClick={gerarPagamentos}
                disabled={processando}
              >
                {processando ? "Gerando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
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
            <p className={style.tituloSemanaPagto}>
              <CalendarDays />
              Semana de {obterPeriodoSemana(periodoInicioSemana)}
            </p>
            <button
              className={style.btnGerarPagto}
              disabled={processando}
              onClick={() => setConfirmacaoGerar(true)}
            >
              {processando ? "Gerando..." : "Gerar Pagamentos"}
            </button>
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
              <p className={style.qtdPagtos}>{quantidades.geral}</p>
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
              <p className={style.qtdPagtos}>{quantidades.pagos}</p>
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
              <p className={style.qtdPagtos}>{quantidades.naoPagos}</p>
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
          {!carregando && !erro && pagamentos.map((pagamento) => (
            <CardPgtoFunc
              key={pagamento.id}
              id={pagamento.id}
              nome={pagamento.funcionarioNome}
              area={pagamento.setor}
              statusPagto={pagamento.status}
              formaPagamento={pagamento.formaPagamento}
              telefone={pagamento.telefone}
              chavePix={pagamento.chavePix}
              diasTrabalhados={pagamento.quantidadeDias}
              valorDiaria={pagamento.valorDiaria}
              valorTotal={pagamento.valorAPagar}
              onPagar={pagar}
              pagando={pagandoId === pagamento.id}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Pagamento;