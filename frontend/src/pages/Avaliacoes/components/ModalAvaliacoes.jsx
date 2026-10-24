import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import api from "../../../services/api";
import Estrelas from "../../../components/Estrelas";
import style from "../css/Avaliacoes.module.css";

function ModalAvaliacoes({ funcionario, onFechar }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [visiveis, setVisiveis] = useState(10);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState("Tudo");
  const [resumo, setResumo] = useState(null);
  const requisicao = useRef(0);

  async function carregar(filtroAtual = filtro) {
    const idRequisicao = ++requisicao.current;
    setCarregando(true); setErro("");
    try {
      const params = {};
      if (/^[1-5]$/.test(filtroAtual)) params.nota = Number(filtroAtual);
      if (filtroAtual === "comentarios") params.comComentarios = true;
      const resposta = await api.get(`/avaliacao/${funcionario.funcionarioId}`, { params });
      if (idRequisicao !== requisicao.current) return;
      setAvaliacoes(resposta.data.avaliacoes || []); setResumo(resposta.data.resumo); setVisiveis(10);
    } catch (error) {
      if (idRequisicao === requisicao.current) {
        setErro(error.response?.data?.message || "Não foi possível carregar as avaliações.");
      }
    } finally { if (idRequisicao === requisicao.current) setCarregando(false); }
  }
  useEffect(() => { setFiltro("Tudo"); carregar("Tudo"); }, [funcionario.funcionarioId]);
  useEffect(() => { if (resumo) carregar(filtro); }, [filtro]);
  useEffect(() => {
    const fechar = (event) => event.key === "Escape" && onFechar();
    document.addEventListener("keydown", fechar);
    return () => document.removeEventListener("keydown", fechar);
  }, [onFechar]);
  const media = resumo?.media ?? (Number(funcionario.mediaAvaliacoes) || 0);
  const porNota = resumo?.porNota || {};
  const filtros = [["Tudo", resumo?.total || 0], ["5", porNota[5] || 0], ["4", porNota[4] || 0], ["3", porNota[3] || 0], ["2", porNota[2] || 0], ["1", porNota[1] || 0], ["comentarios", resumo?.comComentarios || 0]];
  const renderFiltro = ([chave, quantidade]) => <button key={chave} className={filtro === chave ? style.filtroAtivo : ""} disabled={!quantidade} onClick={() => setFiltro(filtro === chave && chave !== "Tudo" ? "Tudo" : chave)}>{chave === "Tudo" ? "Tudo" : chave === "comentarios" ? "Com Comentários" : `${chave} ${chave === "1" ? "Estrela" : "Estrelas"}`} ({quantidade})</button>;
  return <div className={style.overlayModal} onClick={(event) => event.target === event.currentTarget && onFechar()}>
    <div className={style.modalAvaliacoes}>
      <div className={style.headerModal}><div><h2>{funcionario.nome}</h2><p>{funcionario.cargo}</p></div><button onClick={onFechar}><X /></button></div>
      <div className={style.resumoAvaliacoes}><strong>{media ? media.toFixed(1) : "—"}</strong><Estrelas valor={media} tamanho={20} /><span>{resumo?.total ?? funcionario.quantidadeAvaliacoes ?? 0} Avaliações</span></div>
      <div className={style.filtrosAvaliacoes}>
        <div className={style.filtrosLinhaQuatro}>{filtros.slice(0, 4).map(renderFiltro)}</div>
        <div className={style.filtrosLinhaTres}>{filtros.slice(4).map(renderFiltro)}</div>
      </div>
      <div className={style.listaAvaliacoes}>
        {carregando && <p>Carregando avaliações...</p>}
        {!carregando && erro && <><p>{erro}</p><button onClick={carregar}>Tentar novamente</button></>}
        {!carregando && !erro && !avaliacoes.length && <p>{filtro === "Tudo" ? "Nenhuma avaliação ainda" : "Nenhuma avaliação com esse filtro"}</p>}
        {!carregando && !erro && avaliacoes.slice(0, visiveis).map((avaliacao) => <article className={style.itemAvaliacao} key={avaliacao.id}>
          <Estrelas valor={avaliacao.nota} tamanho={15} />
          {avaliacao.criadoEm && <small>{new Date(avaliacao.criadoEm).toLocaleDateString("pt-BR")}</small>}
          {avaliacao.descricao && <p>{avaliacao.descricao}</p>}
        </article>)}
      </div>
      {visiveis < avaliacoes.length && <button className={style.btnVerMais} onClick={() => setVisiveis((valor) => valor + 10)}>Ver mais</button>}
    </div>
  </div>;
}
export default ModalAvaliacoes;
