import style from "./css/Escala.module.css";

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle,
  X
} from "lucide-react";

import { useState, useEffect } from "react";
import api from "../../services/api";
import { inicioDaSemana, somarDias } from "../../utils/datas";
import { agruparPorSetor } from "../../utils/setores";

import CardEscala from "./components/CardEscala";

function dataIso(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function dataHojeIso() {
  return dataIso(new Date());
}

function mensagemErro(error, fallback) {
  const data = error.response?.data;
  return data?.message || (typeof data === "string" ? data : fallback);
}

function Escala() {
  const [datasAberta, setDatasAberta] = useState(false);
  const [dataNova, setDataNova] = useState("");
  const [datasSelecionadas, setDatasSelecionadas] = useState(() => {
    const hoje = new Date();
    const diaSemana = hoje.getDay();

    const segunda = new Date(hoje);
    const diferenca = diaSemana === 0 ? -6 : 1 - diaSemana;
    segunda.setDate(hoje.getDate() + diferenca);

    const sabado = somarDias(segunda, 5);
    const domingo = somarDias(segunda, 6);

    return [
      dataIso(sabado),
      dataIso(domingo)
    ];
  });

  const [funcionarios, setFuncionarios] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [dataPendenteExclusao, setDataPendenteExclusao] = useState(null);

  async function buscarDados() {
    setErro("");

    try {
      const datas = [...datasSelecionadas].sort();
      const inicio = datas[0] || dataIso(new Date());
      const fim = datas[datas.length - 1] || inicio;
      const [funcionariosResposta, escalasResposta] = await Promise.all([
        api.get("/funcionarios"),
        api.get("/escala", { params: { inicio, fim } })
      ]);

      setFuncionarios(
        funcionariosResposta.data.filter(
          (funcionario) => funcionario.status !== "INATIVO"
        )
      );

      setEscalas(escalasResposta.data);
    } catch (error) {
      setErro(
        mensagemErro(error, "Não foi possível carregar a escala.")
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { buscarDados(); }, []);

  useEffect(() => {
    if (carregando || erro) return;

    setDatasSelecionadas((atuais) => {
      const datasDoBanco = escalas.map(
        (escala) => escala.dataEscala
      ).filter((data) => data >= dataHojeIso());

      return [
        ...new Set([
          ...atuais.filter((data) => data >= dataHojeIso()),
          ...datasDoBanco
        ])
      ].sort();
    });
  }, [escalas, carregando, erro]);

  useEffect(() => {
    if (!sucesso) return;

    const temporizador = setTimeout(() => {
      setSucesso("");
    }, 3000);

    return () => clearTimeout(temporizador);
  }, [sucesso]);

  async function salvarEscala(escala) {
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      const payload = {
        dataEscala: escala.dataEscala,
        turno: escala.turno,
        funcionariosIds: escala.funcionariosIds.map(Number)
      };

      if (escala.id) {
        await api.put(`/escala/${escala.id}`, payload);
      } else {
        await api.post("/escala", payload);
      }

      await buscarDados();

      setSucesso(
        escala.id
          ? "Escala atualizada com sucesso!"
          : "Escala criada com sucesso!"
      );

      return true;

    } catch (error) {
      setErro(
        mensagemErro(error, "Não foi possível salvar a escala.")
      );

      return false;

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
    setErro("");
    setSucesso("");

    if (!dataNova) {
      setErro("Selecione uma data antes de adicionar.");
      return;
    }

    if (datasSelecionadas.includes(dataNova)) {
      setErro("Essa data já foi adicionada.");
      return;
    }

    setDatasSelecionadas((atuais) =>
      [...atuais, dataNova].sort()
    );

    setDataNova("");
    setSucesso("Data adicionada com sucesso!");
  }

  function adicionarSabadoDomingoAtual() {
    setErro("");
    setSucesso("");

    const hoje = new Date();
    const diaSemana = hoje.getDay();

    const sabado = new Date(hoje);
    sabado.setDate(hoje.getDate() + (6 - diaSemana));

    const domingo = new Date(sabado);
    domingo.setDate(sabado.getDate() + 1);

    const formatarDataISO = (data) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");

      return `${ano}-${mes}-${dia}`;
    };

    const dataSabado = formatarDataISO(sabado);
    const dataDomingo = formatarDataISO(domingo);

    const sabadoAdicionado = datasSelecionadas.includes(dataSabado);
    const domingoAdicionado = datasSelecionadas.includes(dataDomingo);

    if (sabadoAdicionado && domingoAdicionado) {
      setErro("Sábado e domingo já adicionados.");
      return;
    }

    setDatasSelecionadas((atuais) => {
      const novasDatas = [dataSabado, dataDomingo].filter(
        (data) => !atuais.includes(data)
      );

      return [...atuais, ...novasDatas].sort();
    });

    setSucesso(
      sabadoAdicionado || domingoAdicionado
        ? "A data que faltava foi adicionada."
        : "Sábado e domingo adicionados com sucesso!"
    );
  }

  function removerData(dataRemover) {
    setErro("");
    setSucesso("");

    setDataPendenteExclusao(dataRemover);
  }

  async function confirmarRemocaoData() {
    const dataRemover = dataPendenteExclusao;

    if (!dataRemover) return;

    const escalasDaData = escalas.filter(
      (escala) => escala.dataEscala === dataRemover
    );

    setErro("");
    setSucesso("");
    setDataPendenteExclusao(null);

    try {
      for (const escala of escalasDaData) {
        await api.delete(`/escala/${escala.id}`);
      }

      await buscarDados();

      setDatasSelecionadas((atuais) =>
        atuais.filter((data) => data !== dataRemover)
      );

      setSucesso("Escala excluída com sucesso!");
    } catch (error) {
      setErro(
        mensagemErro(error, "Não foi possível excluir a escala.")
      );

      await buscarDados();
    }
  }

  const setores = agruparPorSetor(funcionarios);

  const datasParaExibir = datasSelecionadas.filter(
    (data) => data >= dataHojeIso()
  );

  const escalasVisiveis = datasParaExibir.flatMap((dataEscala) => {
    const existentes = escalas.filter(
      (escala) => escala.dataEscala === dataEscala
    );

    return existentes.length
      ? existentes
      : [{
        id: null,
        dataEscala,
        turno: "DIA",
        funcionarios: []
      }];
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
      {(erro || sucesso) && (
        <div
          className={`${style.alertaSucesso} ${erro ? style.alertaAviso : ""}`}
          role={erro ? "alert" : "status"}
          aria-live={erro ? "assertive" : "polite"}
        >
          {!erro && <CheckCircle size={20} />}

          <p>{erro || sucesso}</p>

          <button
            type="button"
            onClick={() => {
              setErro("");
              setSucesso("");
            }}
            aria-label="Fechar alerta"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {dataPendenteExclusao && (
        <div
          className={`${style.alertaSucesso} ${style.alertaAviso}`}
          role="alertdialog"
        >          <CalendarDays size={20} />

          <p>
            Deseja excluir a escala do dia{" "}
            {new Date(`${dataPendenteExclusao}T00:00:00`).toLocaleDateString(
              "pt-BR"
            )}
            ?
          </p>

          <button
            type="button"
            onClick={() => setDataPendenteExclusao(null)}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={confirmarRemocaoData}
          >
            Excluir
          </button>
        </div>
      )}
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
              <input
                type="date"
                value={dataNova}
                onChange={(e) => setDataNova(e.target.value)}
              />

              <button
                type="button"
                className={style.btnAdicionarData}
                onClick={adicionarData}
              >
                <Plus />
                <p>Adicionar</p>
              </button>

              <button
                type="button"
                className={style.btnSabDomAtual}
                onClick={adicionarSabadoDomingoAtual}
              >
                <CalendarDays />
                <p>Sáb/Dom Atual</p>
              </button>
            </div>

            <div className={style.datasEscolhidas}>
              {datasParaExibir.map((data) => (
                <div
                  className={style.dataEscolhida}
                  key={data}
                >
                  <p>
                    {new Date(`${data}T00:00:00`)
                      .toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit"
                      })
                      .replace("-feira", "")}
                  </p>

                  <button
                    type="button"
                    className={style.btnRemoverDataEscolhida}
                    onClick={() => removerData(data)}
                    aria-label={`Remover data ${data} `}
                  >
                    <X />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {!carregando && escalasVisiveis.map((escala) => (
          <CardEscala
            key={escala.id ?? `${escala.dataEscala}-${escala.turno}`}
            escala={escala}
            funcionarios={funcionarios}
            areas={areasDaEscala(escala)}
            onSalvar={salvarEscala}
            removendo={removendo}
            salvando={salvando}
          />
        ))}
      </div>
    </>
  );
}

export default Escala;