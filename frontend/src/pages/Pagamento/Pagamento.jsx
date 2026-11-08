import style from "./css/Pagamento.module.css";
import { Banknote, CalendarDays, CheckCircle, DollarSign, QrCode, X, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CardPgtoFunc from "./components/CardPgtoFunc";
import api from "../../services/api";
import { formatBRL } from "../../utils/formatadores";
import SeletorSemanaPagamento from "./components/SeletorSemanaPagamento";

const hojeLocal = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const dataString = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const inicioSemanaLocal = (d) => {
  const data = new Date(d);
  const distancia = (data.getDay() + 6) % 7;
  data.setDate(data.getDate() - distancia);
  return dataString(data);
};
const somarSemana = (inicio, quantidade) => {
  const [ano, mes, dia] = inicio.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + quantidade * 7);
  return dataString(data);
};
const formatarData = (valor) => valor ? new Date(`${valor}T00:00:00`).toLocaleDateString("pt-BR") : "";
const fimDaSemana = (inicio) => {
  const [ano, mes, dia] = inicio.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + 6);
  return dataString(data);
};
const mensagemErro = (error, fallback) => error.response?.data?.message || fallback;

function Pagamento() {
  const [inicio, setInicio] = useState(null);
  const [resumo, setResumo] = useState({});
  const [pagamentos, setPagamentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [areaSelecionada, setAreaSelecionada] = useState("Todas");
  const [filtroPagamento, setFiltroPagamento] = useState("Geral");
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [pagandoId, setPagandoId] = useState(null);
  const [erro, setErro] = useState("");
  const [alerta, setAlerta] = useState(null);
  const requestId = useRef(0);

  const inicioExibido = inicio || resumo.inicio || inicioSemanaLocal(hojeLocal());
  const params = { ...(inicio ? { inicio } : {}), ...(areaSelecionada !== "Todas" ? { setor: areaSelecionada } : {}) };
  const semanaAtual = resumo.semanaAtualInicio || inicioSemanaLocal(hojeLocal());
  const primeiraSemana = resumo.primeiraSemanaInicio || inicioExibido;
  const outras = resumo.outrasSemanas || {};

  async function buscarDados() {
    const id = ++requestId.current;
    const controller = new AbortController();
    setCarregando(true);
    setErro("");
    try {
      const resultado = await Promise.all([
        api.get("/pagamento", { params, signal: controller.signal }),
        api.get("/pagamento/pendentes", { params, signal: controller.signal }),
        api.get("/pagamento/pagos", { params, signal: controller.signal }),
        api.get("/pagamento/resumo", { params: inicio ? { inicio } : {}, signal: controller.signal }),
        api.get("/funcionarios/setores", { signal: controller.signal })
      ]);
      if (id !== requestId.current) return;
      const todos = resultado[0].data;
      setPagamentos(todos);
      setResumo(resultado[3].data);
      setSetores(resultado[4].data);
      if (!inicio && resultado[3].data.inicio) setInicio(resultado[3].data.inicio);
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") return;
      if (id === requestId.current) { setErro(mensagemErro(error, "Não foi possível carregar os pagamentos.")); setPagamentos([]); }
    } finally {
      if (id === requestId.current) setCarregando(false);
    }
    return () => controller.abort();
  }

  useEffect(() => { buscarDados(); }, [inicio, areaSelecionada, filtroPagamento]);

  const atualizarSemana = (valor) => {
    if (valor < primeiraSemana || valor > semanaAtual) return;
    setInicio(valor);
  };

  async function gerarPagamentos() {
    setProcessando(true);
    setAlerta(null);
    try {
      const resposta = await api.post("/pagamento/gerar", null, { params: { inicio: inicioExibido } });
      await buscarDados();
      const quantidade = resposta.data.geradas ?? resposta.data.quantidadeGerada ?? 0;
      setAlerta({ mensagem: quantidade ? `${quantidade} pagamentos gerados` : "Nada novo para gerar", tipo: "sucesso" });
    } catch (error) {
      setAlerta({ mensagem: mensagemErro(error, "Não foi possível gerar os pagamentos."), tipo: "aviso" });
    } finally { setProcessando(false); }
  }

  async function pagar(id, formaPagamento) {
    setPagandoId(id);
    setErro("");
    try {
      await api.put(`/pagamento/${id}/pagar`, { formaPagamento });
      await buscarDados();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível realizar o pagamento."));
      throw error;
    } finally { setPagandoId(null); }
  }

  const quantidades = {
    geral: pagamentos.length,
    pagos: pagamentos.filter((item) => item.status === "PAGO").length,
    naoPagos: pagamentos.filter((item) => item.status === "PENDENTE").length
  };
  const pagamentosVisiveis = filtroPagamento === "Pagos"
    ? pagamentos.filter((item) => item.status === "PAGO")
    : filtroPagamento === "Não Pagos"
      ? pagamentos.filter((item) => item.status === "PENDENTE")
      : pagamentos;
  const podeGerar = Number(resumo.escalasSemPagamento) > 0;
  const banner = Number(outras.pendentesQuantidade) > 0 || Number(outras.aGerarQuantidade) > 0;

  return (
    <>
      {alerta && <div className={`${style.alertaSucesso} ${alerta.tipo === "aviso" ? style.alertaAviso : ""}`} role="alert">
        {alerta.tipo === "sucesso" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}<p>{alerta.mensagem}</p>
        <button type="button" onClick={() => setAlerta(null)} aria-label="Fechar alerta"><X size={18} /></button>
      </div>}
      <header className={style.headerPagamento}>
        <div className={style.tituloPagamento}>
          <h1>Gestão de Pagamentos</h1>
          <p>Realize os pagamentos da operação</p>
        </div>
        <SeletorSemanaPagamento
          inicio={resumo.inicio || inicioExibido}
          fim={resumo.fim || fimDaSemana(inicioExibido)}
          primeiraSemana={primeiraSemana}
          semanaAtual={semanaAtual}
          onChange={atualizarSemana}
          onPrev={() => atualizarSemana(somarSemana(inicioExibido, -1))}
          onNext={() => atualizarSemana(somarSemana(inicioExibido, 1))}
        />
      </header>
      <main className={style.containerPagamento}>
        {banner && <div className={style.bannerSemanas} role="status">
          Há {outras.pendentesQuantidade || 0} pagamentos pendentes ({formatBRL(outras.pendentesValor)}) e {outras.aGerarQuantidade || 0} escalas sem pagamento em semanas anteriores
          {outras.semanaMaisAntigaInicio && <button type="button" onClick={() => atualizarSemana(outras.semanaMaisAntigaInicio)}>Ver semana</button>}
        </div>}
        <div className={style.cardResumoSemana}>
          <p className={style.tituloCardResumo}>Resumo da Semana</p>
          <div className={style.valoresPagamentos}>
            <div className={style.totalEmTipoPagto}><Banknote /><p className={style.tipoTotal}>Dinheiro</p><p className={style.totalValor}>{formatBRL(resumo.totalPagoDinheiro)}</p></div>
            <div className={style.totalEmTipoPagto}><QrCode /><p className={style.tipoTotal}>PIX</p><p className={style.totalValor}>{formatBRL(resumo.totalPagoPix)}</p></div>
            <div className={style.totalEmTipoPagto}><DollarSign /><p className={style.tipoTotal}>Total Pagamento</p><p className={style.totalValor}>{formatBRL(resumo.custoTotalMO)}</p></div>
          </div>
        </div>
        <div className={style.cardGerarPagto}>
          <div className={style.headerCardGerarPagto}>
            <p className={style.tituloSemanaPagto}><CalendarDays /> Semana selecionada</p>
            <button className={style.btnGerarPagto} disabled={processando || !podeGerar} onClick={gerarPagamentos}>
              {processando ? "Gerando..." : podeGerar ? "Gerar pagamentos da semana" : resumo.escalasSemPagamento === 0 && pagamentos.length ? "Tudo gerado nesta semana" : "Sem escalas nesta semana"}
            </button>
          </div>
          <div className={style.footerCardGerarPagto}>
            {[["Geral", "geral"], ["Pagos", "pagos"], ["Não Pagos", "naoPagos"]].map(([label, key]) => <button key={label} className={filtroPagamento === label ? style.filtroPagamentoAtivo : style.fitroPagto} onClick={() => setFiltroPagamento(label)}><p>{label}</p><p className={style.qtdPagtos}>{quantidades[key]}</p></button>)}
          </div>
        </div>
        <div className={style.areaFiltroFuncionarios}><div className={style.btnsFiltros}>
          <button className={areaSelecionada === "Todas" ? style.filtroAtivo : ""} onClick={() => setAreaSelecionada("Todas")}>Todas</button>
          {setores.map((setor) => <button key={setor.id} className={areaSelecionada === setor.nome ? style.filtroAtivo : ""} onClick={() => setAreaSelecionada(setor.nome)}>{setor.nome}</button>)}
        </div></div>
        <div className={style.containerPagtosFuncs}>
          {carregando && <p>Carregando pagamentos...</p>}
          {!carregando && erro && <p>{erro}</p>}
          {!carregando && !erro && pagamentosVisiveis.length === 0 && <p>Nenhum pagamento nesta semana</p>}
          {!carregando && !erro && pagamentosVisiveis.map((pagamento) => <CardPgtoFunc key={pagamento.id} id={pagamento.id} nome={pagamento.funcionarioNome} area={pagamento.setor} statusPagto={pagamento.status} formaPagamento={pagamento.formaPagamento} telefone={pagamento.telefone} chavePix={pagamento.chavePix} diasTrabalhados={pagamento.quantidadeDias} valorDiaria={pagamento.valorDiaria} valorTotal={pagamento.valorAPagar} onPagar={pagar} pagando={pagandoId === pagamento.id} />)}
        </div>
      </main>
    </>
  );
}

export default Pagamento;
