
import { useEffect, useState } from "react";
import { StarIcon, X } from "lucide-react";
import style from "../css/Avaliacoes.module.css";
import api from "../../../services/api";

function ModalHistorico({ funcionario, onFechar }) {

    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function buscarAvaliacoes() {
            setCarregando(true);
            setErro("");

            try {
                const resposta = await api.get(
                    `/avaliacao/${funcionario.funcionarioId}`
                );

                setDados(resposta.data);
            } catch (error) {
                setErro(
                    error.response?.data?.message ||
                    "Não foi possível carregar o histórico de avaliações."
                );
            } finally {
                setCarregando(false);
            }
        }

        buscarAvaliacoes();
    }, [funcionario.funcionarioId]);

    function formatarData(data) {
        if (!data) return "Data não informada";

        return new Date(data).toLocaleDateString("pt-BR");
    }

    function renderizarEstrelas(nota) {
        return [1, 2, 3, 4, 5].map((estrela) => (
            <StarIcon
                key={estrela}
                className={estrela <= nota ? style.estrelaPreenchida : style.estrelaVazia}
                fill={estrela <= nota ? "currentColor" : "none"}
            />
        ));
    }

    return (
        <div className={style.overlayHistorico} onClick={onFechar}>
            <div
                className={style.modalHistorico}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={style.headerHistorico}>
                    <div>
                        <h2>Histórico de avaliações</h2>
                        <p>{funcionario.nome} - {funcionario.cargo}</p>
                    </div>

                    <button onClick={onFechar}>
                        <X />
                    </button>
                </div>

                {carregando && (
                    <p className={style.mensagemEstado}>
                        Carregando avaliações...
                    </p>
                )}

                {!carregando && erro && (
                    <p className={style.mensagemErro}>{erro}</p>
                )}

                {!carregando && !erro && dados && (
                    <>
                        <div className={style.resumoHistorico}>
                            <div className={style.mediaHistorico}>
                                <h3>
                                    {dados.resumo.media != null
                                        ? dados.resumo.media.toFixed(1)
                                        : "0.0"}
                                </h3>

                                <div className={style.estrelasHistorico}>
                                    {renderizarEstrelas(
                                        Math.round(dados.resumo.media || 0)
                                    )}
                                </div>

                                <p>
                                    {dados.resumo.total} avaliações
                                </p>
                            </div>

                            <div className={style.distribuicaoNotas}>
                                {[5, 4, 3, 2, 1].map((nota) => (
                                    <div key={nota} className={style.linhaNota}>
                                        <span>{nota}</span>

                                        <StarIcon
                                            className={style.estrelaPreenchida}
                                            size={15}
                                            fill="currentColor"
                                        />

                                        <div className={style.barraNota}>
                                            <div
                                                className={style.barraNotaPreenchida}
                                                style={{
                                                    width: dados.resumo.total > 0
                                                        ? `${(dados.resumo.porNota?.[nota] || 0) / dados.resumo.total * 100}%`
                                                        : "0%"
                                                }}
                                            />
                                        </div>

                                        <span>
                                            {dados.resumo.porNota?.[nota] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={style.listaHistorico}>
                            <h3>Avaliações recebidas</h3>

                            {dados.avaliacoes.length === 0 && (
                                <p className={style.mensagemEstado}>
                                    Nenhuma avaliação encontrada.
                                </p>
                            )}

                            {dados.avaliacoes.map((avaliacao) => (
                                <div
                                    key={avaliacao.id}
                                    className={style.cardHistorico}
                                >
                                    <div className={style.topoAvaliacao}>
                                        <div className={style.estrelasHistorico}>
                                            {renderizarEstrelas(avaliacao.nota)}
                                        </div>

                                        <span>
                                            {formatarData(avaliacao.criadoEm)}
                                        </span>
                                    </div>

                                    <p className={style.notaAvaliacao}>
                                        Nota: {avaliacao.nota}/5
                                    </p>

                                    {avaliacao.descricao?.trim() && (
                                        <p className={style.descricaoAvaliacao}>{avaliacao.descricao.trim()}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ModalHistorico;
