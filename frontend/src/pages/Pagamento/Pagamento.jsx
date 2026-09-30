import style from "./css/Pagamento.module.css";
import { Banknote, DollarSign, QrCode, CalendarDays } from "lucide-react";
import CardPgtoFunc from "./components/CardPgtoFunc";
import { useState } from "react";

function Pagamento() {
  const [areaSelecionada, setAreaSelecionada] = useState("Todas");
  const [filtroPagamento, setFiltroPagamento] = useState("Geral");

  const funcionarios = [
    {
      nome: "Ryan Pina",
      area: "Cozinha",
      statusPagto: "Pago",
      telefone: "(11) 99999-1111",
      chavePix: "ryan@email.com",
      diasTrabalhados: 2,
      valorTotal: 200,
    },
    {
      nome: "Ana Silva",
      area: "Salão",
      statusPagto: "Pendente",
      telefone: "(11) 99999-2222",
      chavePix: "11999992222",
      diasTrabalhados: 2,
      valorTotal: 240,
    },
    {
      nome: "Lucas Santos",
      area: "Atividades",
      statusPagto: "Pago",
      telefone: "(11) 99999-3333",
      chavePix: "lucas@email.com",
      diasTrabalhados: 1,
      valorTotal: 120,
    },
    {
      nome: "Mariana Oliveira",
      area: "Cozinha",
      statusPagto: "Pendente",
      telefone: "(11) 99999-4444",
      chavePix: "11999994444",
      diasTrabalhados: 2,
      valorTotal: 200,
    },
  ];
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
              <p className={style.totalValor}>R$0,00</p>
            </div>
            <div className={style.totalEmTipoPagto}>
              <QrCode />
              <p className={style.tipoTotal}>PIX</p>
              <p className={style.totalValor}>R$0,00</p>
            </div>
            <div className={style.totalEmTipoPagto}>
              <DollarSign />
              <p className={style.tipoTotal}>Total Pagamento</p>
              <p className={style.totalValor}>R$0,00</p>
            </div>
          </div>
        </div>
        <div className={style.cardGerarPagto}>
          <div className={style.headerCardGerarPagto}>
            <p className={style.tituloSemanaPagto}><CalendarDays />
              Semana de 19/09/2026</p>
            <button className={style.btnGerarPagto} onClick={() => alert("Gerando pagamentos")}>Gerar Pagamentos</button>
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
              <p className={style.qtdPagtos}>0</p>
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
              <p className={style.qtdPagtos}>20</p>
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
              <p className={style.qtdPagtos}>0</p>
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

            <button
              className={areaSelecionada === "Cozinha" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Cozinha")}>
              Cozinha
            </button>

            <button
              className={areaSelecionada === "Salão" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Salão")} >
              Salão
            </button>

            <button
              className={areaSelecionada === "Atividades" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Atividades")} >
              Atividades
            </button>
          </div>
        </div>
        <div className={style.containerPagtosFuncs}>
          {funcionarios.map((f, index) => (
            <CardPgtoFunc key={index} nome={f.nome} area={f.area} statusPagto={f.statusPagto} telefone={f.telefone}
              chavePix={f.chavePix} diasTrabalhados={f.diasTrabalhados} valorTotal={f.valorTotal} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Pagamento;