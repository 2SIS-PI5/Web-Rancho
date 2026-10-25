import style from "./css/Historico.module.css";
import { Banknote, CalendarDays, DollarSign, QrCode, Users, Search, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { inicioDaSemana, somarDias, formatarData } from "../../utils/datas";
import { corDoSetor } from "../../utils/setores";
import SeletorSemana from "./components/SeletorSemana";
import { formatBRL } from "../../utils/formatadores";
import TabelaSetor from "./components/TabelaSetor";

function dataIso(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function mensagemErro(error) {
  const data = error.response?.data;
  return data?.message || (typeof data === "string" ? data : "Não foi possível carregar o histórico.");
}

function mapearGrupos(funcionarios) {
  return funcionarios.reduce((grupos, funcionario) => {
    const grupo = grupos.find((item) => item.setor === funcionario.setor);
    const pagamentos = funcionario.pagamentos || [];
    const vias = [...new Set(pagamentos.map((pagamento) => pagamento.formaPagamento).filter(Boolean))];
    const item = {
      id: funcionario.funcionarioId,
      nome: funcionario.nome,
      dias: (funcionario.datas || []).map((data) => data),
      valor: Number(funcionario.valorPago ?? funcionario.valorTotal ?? 0),
      previsto: Number(funcionario.valorPrevisto ?? 0),
      via: funcionario.formaPagamento || vias.join(", ") || null,
      status: funcionario.statusPagamento || (pagamentos.length ? "PAGO" : "A_GERAR"),
      setor: funcionario.setor,
      cor: corDoSetor(funcionario.setor),
    };
    if (grupo) grupo.itens.push(item);
    else grupos.push({ setor: funcionario.setor, cor: corDoSetor(funcionario.setor), itens: [item] });
    return grupos;
  }, []);
}

function mapearDatas(detalhes) {
  return detalhes.map((detalhe) => ({
    id: detalhe.dia,
    diaSemana: detalhe.diaSemana,
    data: formatarData(new Date(`${detalhe.dia}T00:00:00`)),
    funcionarios: (detalhe.funcionarios || []).map((funcionario) => ({
      id: funcionario.id,
      nome: funcionario.nome,
      setor: funcionario.setor,
    })),
  }));
}

function Historico() {
  const [inicioSemana, setInicioSemana] = useState(() => inicioDaSemana(new Date()));
  const [resumo, setResumo] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [datas, setDatas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const fimSemana = somarDias(inicioSemana, 6);

  useEffect(() => {
    const controller = new AbortController();
    const inicio = dataIso(inicioSemana);
    const fim = dataIso(fimSemana);
    setCarregando(true);
    setErro("");
    Promise.all([
      api.get("/historico/resumo", { params: { inicio, fim }, signal: controller.signal }),
      api.get("/historico/funcionariosPagamentos", { params: { inicio, fim }, signal: controller.signal }),
      api.get("/historico/detalhesPeriodo", { params: { inicio, fim }, signal: controller.signal }),
    ]).then(([resumoResposta, funcionariosResposta, detalhesResposta]) => {
      setResumo(resumoResposta.data || null);
      setGrupos(mapearGrupos(Array.isArray(funcionariosResposta.data) ? funcionariosResposta.data : []));
      setDatas(mapearDatas(Array.isArray(detalhesResposta.data) ? detalhesResposta.data : []));
    }).catch((error) => {
      if (!controller.signal.aborted) setErro(mensagemErro(error));
    }).finally(() => {
      if (!controller.signal.aborted) setCarregando(false);
    });
    return () => controller.abort();
  }, [inicioSemana, tentativa]);

  const quantidadeFuncionarios = Number(resumo?.quantidadeFuncionarios || 0);
  const vazio = !grupos.length && !datas.length;
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [diaAtivo, setDiaAtivo] = useState(null);
  const gruposFiltrados = useMemo(() => grupos.map((grupo) => ({
    ...grupo,
    itens: grupo.itens.filter((item) => {
      const nomeOk = item.nome.toLowerCase().includes(busca.toLowerCase());
      const statusOk = filtroStatus === "TODOS" || (filtroStatus === "PENDENTES" && item.status !== "PAGO")
        || (filtroStatus === "A_GERAR" && item.status === "A_GERAR") || (filtroStatus === "PAGOS" && item.status === "PAGO");
      const diaOk = !diaAtivo || item.dias.some((dia) => dia.data === diaAtivo);
      return nomeOk && statusOk && diaOk;
    })
  })).filter((grupo) => grupo.itens.length), [grupos, busca, filtroStatus, diaAtivo]);
  const hoje = dataIso(new Date());
  const estaSemana = hoje >= dataIso(inicioSemana) && hoje <= dataIso(fimSemana);
  const itensEquipe = grupos.flatMap((grupo) => grupo.itens);
  const pagos = itensEquipe.filter((item) => item.status === "PAGO").length;
  const pendentes = itensEquipe.filter((item) => item.status !== "PAGO").length;
  const totalPrevisto = Number(resumo?.totalPrevisto ?? resumo?.custoTotalMaoObra ?? 0);
  const totalPago = Number(resumo?.totalPago ?? 0);
  const progressoPago = totalPrevisto > 0 ? Math.min(100, (totalPago / totalPrevisto) * 100) : 0;
  const contagensStatus = {
    TODOS: itensEquipe.length,
    PAGOS: pagos,
    PENDENTES: pendentes,
    A_GERAR: itensEquipe.filter((item) => item.status === "A_GERAR").length,
  };
  const filtrosAtivos = Boolean(busca || filtroStatus !== "TODOS" || diaAtivo);
  const iniciais = (nome) => nome.split(" ").filter(Boolean).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();

  return (
    <div className={style.paginaHistorico}>
      <div className={style.headerHistorico}>
        <div className={style.tituloHistorico}><h1>Histórico de Escalas</h1><p>Resumo completo por semana - equipe, pagamentos e totais</p></div>
      </div>
      <div className={style.containerHistorico}>
        <SeletorSemana inicioSemana={inicioSemana} onChange={setInicioSemana} estaSemana={estaSemana} />
        {carregando && <div className={style.estadoHistorico}><div className={style.skeletonKpis}><span /><span /><span /><span /></div><div className={style.skeletonTabela}><span /><span /><span /><span /></div></div>}
        {!carregando && erro && <div className={style.estadoHistorico}><AlertCircle /><p>{erro}</p><button type="button" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button></div>}
        {!carregando && !erro && vazio && <div className={style.estadoHistorico}><CalendarDays /><strong>Sem registros neste período</strong><p>Escolha outra semana para consultar o histórico.</p></div>}
        {!carregando && !erro && !vazio && <>
          <div className={style.infoSemana}>
            <div className={`${style.cardInfoSemana} ${style.cardHero}`}><div className={style.iconeCard}><DollarSign /></div><p>Total Mão de Obra</p><p className={style.valorMaoDeObra}>{formatBRL(totalPrevisto)}</p><div className={style.progresso}><span style={{ width: `${progressoPago}%` }} /></div><div className={style.resumoValores}><span className={style.valorPago}><strong><i />Pago</strong><b>{formatBRL(totalPago)}</b></span><span className={style.valorPendente}><strong><i />Pendente</strong><b>{formatBRL(resumo?.totalPendente || Math.max(0, totalPrevisto - totalPago))}</b></span></div></div>
            <div className={style.cardInfoSemana}><div className={style.iconeCard}><Banknote /></div><p>Pago em Dinheiro</p><p className={style.valorEmDinheiro}>{formatBRL(resumo?.pagoDinheiro || 0)}</p></div>
            <div className={style.cardInfoSemana}><div className={style.iconeCard}><QrCode /></div><p>Pago em PIX</p><p className={style.valorEmPix}>{formatBRL(resumo?.pagoPix || 0)}</p></div>
            <div className={`${style.cardInfoSemana} ${style.cardEquipe}`}><div className={style.iconeCard}><Users /></div><p>Equipe da Semana</p><p className={style.qtdFuncionarios}>{quantidadeFuncionarios} func.</p><div className={style.avatarStack}>{itensEquipe.slice(0, 4).map((item) => <span key={item.id} style={{ "--cor-setor": corDoSetor(item.setor) }}>{iniciais(item.nome)}</span>)}{itensEquipe.length > 4 && <span className={style.avatarMais}>+{itensEquipe.length - 4}</span>}</div><small><b className={style.dotPago} />{pagos} pagos <b className={style.dotPendente} />{pendentes} pendentes</small></div>
          </div>
          <div className={style.filtrosHistorico}>
            <div className={style.faixaDias}>{datas.map((dia) => <button aria-pressed={diaAtivo === dia.id} className={diaAtivo === dia.id ? style.diaAtivo : ""} key={dia.id} onClick={() => setDiaAtivo(diaAtivo === dia.id ? null : dia.id)}><strong>{dia.diaSemana.slice(0, 3)} {dia.data.slice(0, 5)}</strong><small>{dia.funcionarios.length} func.</small><span className={style.diaSetores}>{[...new Set(dia.funcionarios.map((funcionario) => funcionario.setor))].slice(0, 4).map((setor) => <i key={setor} style={{ "--cor-setor": corDoSetor(setor) }} />)}</span></button>)}</div>
            <div className={style.toolbarHistorico}><div className={style.inputHistorico}><Search size={16} /><input aria-label="Buscar funcionário" placeholder="Buscar funcionário..." value={busca} onChange={(e) => setBusca(e.target.value)} /></div>{["TODOS", "PAGOS", "PENDENTES", "A_GERAR"].map((status) => <button aria-pressed={filtroStatus === status} className={filtroStatus === status ? style.filtroAtivo : ""} key={status} onClick={() => setFiltroStatus(status)}>{status === "TODOS" ? "Todos" : status === "A_GERAR" ? "A gerar" : status[0] + status.slice(1).toLowerCase()} <span>{contagensStatus[status]}</span></button>)}{filtrosAtivos && <button className={style.btnLimpar} onClick={() => { setBusca(""); setFiltroStatus("TODOS"); setDiaAtivo(null); }}>Limpar filtros</button>}</div>
          </div>
          {gruposFiltrados.length ? <div className={style.tpList}>{gruposFiltrados.map((grupo) => <TabelaSetor key={grupo.setor} grupo={grupo} />)}</div> : <div className={style.estadoFiltrado}><Search /><p>Nenhum resultado para os filtros</p><button onClick={() => { setBusca(""); setFiltroStatus("TODOS"); setDiaAtivo(null); }}>Limpar filtros</button></div>}
        </>}
      </div>
    </div>
  );
}

export default Historico;