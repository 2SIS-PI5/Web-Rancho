import style from "./css/Historico.module.css";
import { Banknote, DollarSign, QrCode, Users } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { inicioDaSemana, somarDias, formatarData } from "../../utils/datas";
import { corDoSetor } from "../../utils/setores";
import SeletorSemana from "./components/SeletorSemana";
import QuemTrabalhou from "./components/QuemTrabalhou";
import DetalheDatas from "./components/DetalheDatas";
import { formatBRL } from "../../utils/formatadores";

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
      dias: funcionario.diasTrabalhados ? [`${funcionario.diasTrabalhados} dia(s)`] : [],
      valor: Number(funcionario.valorTotal || 0),
      via: vias.join(", ") || "Pendente",
      status: pagamentos.length ? "Pago" : "Pendente",
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

  return (
    <>
      <div className={style.headerHistorico}>
        <div className={style.tituloHistorico}><h1>Histórico de Escalas</h1><p>Resumo completo por semana - equipe, pagamentos e totais</p></div>
      </div>
      <div className={style.containerHistorico}>
        <SeletorSemana inicioSemana={inicioSemana} onChange={setInicioSemana} />
        {carregando && <p>Carregando histórico...</p>}
        {!carregando && erro && <div><p>{erro}</p><button type="button" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button></div>}
        {!carregando && !erro && vazio && <p>Sem registros no período.</p>}
        {!carregando && !erro && !vazio && <>
          <div className={style.infoSemana}>
            <div className={style.cardInfoSemana}><div className={style.iconeCard}><DollarSign /></div><p>Total Mão de Obra</p><p className={style.valorMaoDeObra}>{formatBRL(resumo?.custoTotalMaoObra || 0)}</p></div>
            <div className={style.cardInfoSemana}><div className={style.iconeCard}><Banknote /></div><p>Pago em Dinheiro</p><p className={style.valorEmDinheiro}>{formatBRL(resumo?.pagoDinheiro || 0)}</p></div>
            <div className={style.cardInfoSemana}><div className={style.iconeCard}><QrCode /></div><p>Pago em PIX</p><p className={style.valorEmPix}>{formatBRL(resumo?.pagoPix || 0)}</p></div>
            <div className={style.cardInfoSemana}><div className={style.iconeCard}><Users /></div><p>Equipe da Semana</p><p className={style.qtdFuncionarios}>{quantidadeFuncionarios} func.</p></div>
          </div>
          <QuemTrabalhou grupos={grupos} />
          <DetalheDatas datas={datas} />
        </>}
      </div>
    </>
  );
}

export default Historico;