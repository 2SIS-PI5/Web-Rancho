import style from "./css/Escala.module.css";

import { CalendarDays, ChevronDown, ChevronUp, Plus } from "lucide-react";

import { useState, useEffect } from "react";
import api from "../../services/api";
import { inicioDaSemana, somarDias, formatarData } from "../../utils/datas";
import { agruparPorSetor } from "../../utils/setores";

import CardEscala from "./components/CardEscala";

function dataIso(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function mensagemErro(error, fallback) {
  const data = error.response?.data;
  return data?.message || (typeof data === "string" ? data : fallback);
}

function Escala() {
  const [datasAberta, setDatasAberta] = useState(false);
  const semanaInicial = inicioDaSemana(new Date());
  const semanaFinal = somarDias(semanaInicial, 6);
  const [dataNova, setDataNova] = useState("");
  const [datasSelecionadas, setDatasSelecionadas] = useState(Array.from({ length: 7 }, (_, indice) => dataIso(somarDias(semanaInicial, indice))));
  const [funcionarios, setFuncionarios] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(null);
  const [erro, setErro] = useState("");

  async function buscarDados() {
    setCarregando(true);
    setErro("");
    try {
      const [funcionariosResposta, escalasResposta] = await Promise.all([
        api.get("/funcionarios"),
        api.get("/escala", { params: { inicio: dataIso(semanaInicial), fim: dataIso(semanaFinal) } })
      ]);
      setFuncionarios(funcionariosResposta.data.filter((funcionario) => funcionario.status !== "INATIVO"));
      setEscalas(escalasResposta.data);
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível carregar a escala."));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { buscarDados(); }, []);

  async function salvarEscala(escala) {
    setSalvando(true);
    setErro("");
    try {
      const payload = { dataEscala: escala.dataEscala, turno: escala.turno, funcionariosIds: escala.funcionariosIds.map(Number) };
      if (escala.id) await api.put(`/escala/${escala.id}`, payload);
      else await api.post("/escala", payload);
      await buscarDados();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível salvar a escala."));
    } finally {
      setSalvando(false);
    }
  }

  async function removerFuncionario(escala, funcionarioId) {
    const restantes = escala.funcionarios
      .map((funcionario) => funcionario.funcionarioId)
      .filter((id) => id !== funcionarioId)
      .map(Number);
    setRemovendo(`${escala.id}-${funcionarioId}`);
    setErro("");
    try {
      if (restantes.length === 0) await api.delete(`/escala/${escala.id}`);
      else await api.put(`/escala/${escala.id}`, { dataEscala: escala.dataEscala, turno: escala.turno, funcionariosIds: restantes });
      await buscarDados();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível remover o funcionário da escala."));
    } finally {
      setRemovendo(null);
    }
  }

  function adicionarData() {
    if (dataNova && !datasSelecionadas.includes(dataNova)) setDatasSelecionadas((datas) => [...datas, dataNova].sort());
    setDataNova("");
  }

  const setores = agruparPorSetor(funcionarios);
  const escalasVisiveis = datasSelecionadas.flatMap((dataEscala) => {
    const existentes = escalas.filter((escala) => escala.dataEscala === dataEscala);
    return existentes.length ? existentes : [{ id: null, dataEscala, turno: "DIA", funcionarios: [] }];
  });

  function areasDaEscala(escala) {
    return setores.map(([nome, funcionariosDoSetor]) => ({
      id: nome,
      nome,
      funcionarios: escala.funcionarios.filter((funcionario) => funcionario.setor === nome)
        .map((funcionario) => ({ id: funcionario.funcionarioId, nome: funcionario.nome }))
        .filter((funcionario) => funcionariosDoSetor.some((disponivel) => disponivel.id === funcionario.id))
    }));
  }

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
            <p>Adicionar Data</p>
            {datasAberta ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </button>
        </div>
      </div>

      <div className={style.containerDatas}>
        {datasAberta && (
          <div className={style.modalGerenciarDatas}>
            <div className={style.inserirData}>
              <input type="date" value={dataNova} onChange={(e) => setDataNova(e.target.value)} />
              <button className={style.btnAdicionarData} onClick={adicionarData}>
                <Plus />
                <p>Adicionar</p>
              </button>
            </div>
            <div className={style.datasEscolhidas}>
              {datasSelecionadas.map((data) => <div className={style.dataEscolhida} key={data}><p>{formatarData(new Date(`${data}T00:00:00`))}</p></div>)}
            </div>
          </div>
        )}
        {carregando && <p>Carregando escala...</p>}
        {!carregando && erro && <p>{erro}</p>}
        {!carregando && !erro && escalasVisiveis.map((escala) => <CardEscala key={escala.id || escala.dataEscala} escala={escala} funcionarios={funcionarios} areas={areasDaEscala(escala)} onSalvar={salvarEscala} onRemover={(funcionarioId) => removerFuncionario(escala, funcionarioId)} removendo={removendo} salvando={salvando} />)}
      </div>
    </>
  );
}

export default Escala;