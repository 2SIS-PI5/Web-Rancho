import style from "./css/Escala.module.css";

import { CalendarDays, ChevronDown, ChevronUp, Plus, X, User, Search } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

const AREAS = ["Cozinha", "Salão", "Atividades"];

function hojeISO(offset = 0) {
  const data = new Date();
  data.setDate(data.getDate() + offset);
  return data.toISOString().slice(0, 10);
}

function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  const diaSemana = new Date(Number(ano), Number(mes) - 1, Number(dia)).toLocaleDateString("pt-BR", { weekday: "long" });
  return { diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1), dataFormatada: `${dia}/${mes}/${ano}` };
}

function Escala() {
  const [datasAberta, setDatasAberta] = useState(false);
  const [novaData, setNovaData] = useState("");
  const [datas, setDatas] = useState([hojeISO(0), hojeISO(1)]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const [modalAdicionar, setModalAdicionar] = useState(null);
  const [buscaFuncionario, setBuscaFuncionario] = useState("");
  const [selecionados, setSelecionados] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.listarFuncionarios().then(setFuncionarios).catch((error) => setErro(error.message));
  }, []);

  const intervalo = useMemo(() => {
    if (datas.length === 0) return null;
    const ordenadas = [...datas].sort();
    return { inicio: ordenadas[0], fim: ordenadas[ordenadas.length - 1] };
  }, [datas]);

  async function carregarEscalas() {
    if (!intervalo) return setEscalas([]);
    try {
      setEscalas(await api.listarEscalas(intervalo.inicio, intervalo.fim));
    } catch (error) {
      setErro(error.message);
    }
  }

  useEffect(() => { carregarEscalas(); }, [intervalo]);

  function adicionarData() {
    if (!novaData || datas.includes(novaData)) return;
    setDatas([...datas, novaData].sort());
    setNovaData("");
  }

  function removerData(data) {
    setDatas(datas.filter((item) => item !== data));
  }

  function abrirModalAdicionar(area, data) {
    setModalAdicionar({ area, data });
    setBuscaFuncionario("");
    setSelecionados([]);
  }

  function fecharModalAdicionar() {
    setModalAdicionar(null);
  }

  function toggleSelecionado(id) {
    setSelecionados((atual) => (atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]));
  }

  function escalasDoSlot(data, area) {
    return escalas.filter((escala) => escala.data === data && escala.area === area);
  }

  async function confirmarAdicionar() {
    if (!modalAdicionar) return;
    try {
      await Promise.all(selecionados.map((funcionarioId) =>
        api.criarEscala({ data: modalAdicionar.data, area: modalAdicionar.area, funcionarioId, status: "PLANEJADA" })
      ));
      await carregarEscalas();
      fecharModalAdicionar();
    } catch (error) {
      setErro(error.message);
    }
  }

  async function removerEscalado(escalaId) {
    try {
      await api.removerEscala(escalaId);
      await carregarEscalas();
    } catch (error) {
      setErro(error.message);
    }
  }

  async function confirmarDia(data) {
    try {
      const doDia = escalas.filter((escala) => escala.data === data);
      await Promise.all(doDia.map((escala) => api.atualizarStatusEscala(escala.id, "CONFIRMADA")));
      await carregarEscalas();
    } catch (error) {
      setErro(error.message);
    }
  }

  const funcionariosDisponiveis = modalAdicionar
    ? funcionarios.filter((funcionario) =>
      funcionario.area === modalAdicionar.area &&
      funcionario.nome.toLowerCase().includes(buscaFuncionario.toLowerCase()) &&
      !escalasDoSlot(modalAdicionar.data, modalAdicionar.area).some((escala) => escala.funcionario.id === funcionario.id)
    )
    : [];

  return (
    <>
      <div className={style.headerEscala}>
        <div className={style.tituloEscala}>
          <h1>Montagem de Escala</h1>
          <p>Clique em uma área para adicionar funcionários à escala</p>
        </div>

        <div className={style.gerenciarDatas}>
          <button onClick={() => setDatasAberta(!datasAberta)}>
            <CalendarDays />
            <p>Gerenciar Datas</p>
            {datasAberta ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </button>
        </div>
      </div>

      {erro && <p>{erro}</p>}

      <div className={style.containerDatas}>
        {datasAberta && (
          <div className={style.modalGerenciarDatas}>
            <div className={style.inserirData}>
              <input type="date" value={novaData} onChange={(event) => setNovaData(event.target.value)} />
              <button className={style.btnAdicionarData} onClick={adicionarData}>
                <Plus />
                <p>Adicionar</p>
              </button>
            </div>
            <div className={style.datasEscolhidas}>
              {datas.map((data) => (
                <div className={style.dataEscolhida} key={data}>
                  <p>{formatarData(data).diaSemana}, {formatarData(data).dataFormatada}</p>
                  <button className={style.btnRemoverDataEscolhida} onClick={() => removerData(data)}>
                    <X />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {datas.map((data) => {
          const { diaSemana, dataFormatada } = formatarData(data);
          const escalasDoDia = escalas.filter((escala) => escala.data === data);
          return (
            <div className={style.cardEscala} key={data}>
              <div className={style.tituloCard}>
                <div className={style.informacoesData}>
                  <div className={style.bolinhaData}></div>
                  <p className={style.diaSemanaEscala}>{diaSemana}</p>
                  <p className={style.dataEscala}>{dataFormatada}</p>
                </div>
                <div className={style.escaladosBtnConfirmar}>
                  <div className={style.qtdEscalados}>
                    <p>{escalasDoDia.length} escalados</p>
                  </div>

                  <button className={style.btnConfirmarEscala} onClick={() => confirmarDia(data)}>
                    <p>Confirmar</p>
                  </button>
                </div>
              </div>

              <div className={style.areasEscala}>
                {AREAS.map((area) => {
                  const escaladosArea = escalasDoSlot(data, area);
                  return (
                    <div className={style.area} key={area}>
                      <div className={style.tituloArea}>
                        <div className={style.bolinhaArea}></div>

                        <p className={style.areaEscala}>{area}</p>

                        <p className={style.qtdEscaladosArea}>({escaladosArea.length})</p>
                      </div>

                      <div className={style.painelEscalados}>
                        {escaladosArea.map((escala) => (
                          <div key={escala.id} className={style.escaladoItem}>
                            <p>{escala.funcionario.nome}</p>
                            <button onClick={() => removerEscalado(escala.id)}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className={style.btnAdicionar}>
                        <button onClick={() => abrirModalAdicionar(area, data)}>
                          <Plus />
                          <p>Adicionar {area}</p>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {modalAdicionar && (
        <div className={style.overlay} onClick={fecharModalAdicionar}>
          <div className={style.modalAdicionarFuncionario} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <div className={style.tituloModalAddFuncArea}>
                <div className={style.corArea}></div>
                <h2>{modalAdicionar.area}</h2>
                <p> - {formatarData(modalAdicionar.data).diaSemana}, {formatarData(modalAdicionar.data).dataFormatada}</p>
              </div>
              <button className={style.btnFecharModal} onClick={fecharModalAdicionar}>
                <X />
              </button>
            </div>
            <div className={style.painelFuncionariosArea}>
              <div className={style.inputPesquisa}>
                <Search />
                <input
                  type="text"
                  placeholder="Buscar funcionário..."
                  value={buscaFuncionario}
                  onChange={(event) => setBuscaFuncionario(event.target.value)}
                />
              </div>

              <div className={style.listaFuncionarios}>
                {funcionariosDisponiveis.map((funcionario) => (
                  <label className={style.cardFuncionario} key={funcionario.id}>
                    <div className={style.fotoFuncionario}>
                      <User />
                    </div>

                    <div className={style.infosFuncionario}>
                      <p>{funcionario.nome}</p>
                      <p>{funcionario.telefone || "-"}</p>
                    </div>

                    <div className={style.btnFuncionarioSelecionado}>
                      <input
                        type="checkbox"
                        checked={selecionados.includes(funcionario.id)}
                        onChange={() => toggleSelecionado(funcionario.id)}
                      />
                    </div>
                  </label>
                ))}
              </div>
              <button className={style.btnAddFuncionarioEscala} onClick={confirmarAdicionar}>
                <p>Adicionar</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Escala;