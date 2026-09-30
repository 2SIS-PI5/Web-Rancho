import style from "./css/Historico.module.css";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarSearch,
  Minus,
  Banknote,
  DollarSign,
  QrCode,
  Users,
  ChevronDown,
  ChevronUp,
  Wallet,
  User,
  Check,
  Search
} from "lucide-react";

import { useState, useRef } from "react";

function Historico() {
  const INICIO_SEMANA = 6;

  const inicioDaSemana = (data) => {
    const d = new Date(data);
    d.setHours(0, 0, 0, 0);
    const diferenca = (d.getDay() - INICIO_SEMANA + 7) % 7;
    d.setDate(d.getDate() - diferenca);
    return d;
  };

  const [inicioSemana, setInicioSemana] = useState(new Date(2026, 8, 19));
  const inputDataRef = useRef(null);

  const abrirSeletor = () => {
    const input = inputDataRef.current;
    if (input?.showPicker) input.showPicker();
    else input?.click();
  };

  const escolherData = (e) => {
    if (!e.target.value) return;
    const [ano, mes, dia] = e.target.value.split("-").map(Number);
    setInicioSemana(inicioDaSemana(new Date(ano, mes - 1, dia)));
  };

  const somarDias = (data, dias) => {
    const d = new Date(data);
    d.setDate(d.getDate() + dias);
    return d;
  };

  const formatarData = (d) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  const [quemTrabalhouAberto, setQuemTrabalhouAberto] = useState(false);

  const grupos = [
    {
      setor: "Cozinha",
      cor: "#2563eb",
      itens: [
        { id: 1, nome: "José Santos", dias: ["26/09", "27/09", "28/09"], valor: 540, via: "Dinheiro", status: "Pago" },
        { id: 2, nome: "Maria Oliveira", dias: ["26/09", "27/09", "28/09"], valor: 510, via: "Dinheiro", status: "Pago" },
        { id: 3, nome: "Pedro Lima", dias: ["26/09", "27/09", "28/09"], valor: 450, via: "Dinheiro", status: "Pago" },
        { id: 4, nome: "Ana Costa", dias: ["26/09", "27/09", "28/09"], valor: 420, via: "Dinheiro", status: "Pago" },
      ],
    },
    {
      setor: "Salão",
      cor: "  rgba(4, 161, 46, 0.77)",
      itens: [
        { id: 1, nome: "José Santos", dias: ["26/09", "27/09", "28/09"], valor: 540, via: "Dinheiro", status: "Pago" },
        { id: 2, nome: "Maria Oliveira", dias: ["26/09", "27/09", "28/09"], valor: 510, via: "Dinheiro", status: "Pago" },
        { id: 3, nome: "Pedro Lima", dias: ["26/09", "27/09", "28/09"], valor: 450, via: "Dinheiro", status: "Pago" },
        { id: 4, nome: "Ana Costa", dias: ["26/09", "27/09", "28/09"], valor: 420, via: "Dinheiro", status: "Pago" },
      ],
    },
    {
      setor: "Atividades",
      cor: "rgba(129, 7, 230, 0.86)",
      itens: [
        { id: 1, nome: "José Santos", dias: ["26/09", "27/09", "28/09"], valor: 540, via: "Dinheiro", status: "Pago" },
        { id: 2, nome: "Maria Oliveira", dias: ["26/09", "27/09", "28/09"], valor: 510, via: "Dinheiro", status: "Pago" },
        { id: 3, nome: "Pedro Lima", dias: ["26/09", "27/09", "28/09"], valor: 450, via: "Dinheiro", status: "Pago" },
        { id: 4, nome: "Ana Costa", dias: ["26/09", "27/09", "28/09"], valor: 420, via: "Dinheiro", status: "Pago" },
      ],
    }
  ];

  const formatBRL = (v) =>
    "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(",", ".");

  const [datasAbertas, setDatasAbertas] = useState([]);

  const toggleData = (id) => {
    setDatasAbertas((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const datas = [
    {
      id: 1,
      diaSemana: "Sábado",
      data: "26/09/2026",
      funcionarios: [
        { id: 1, nome: "José Santos", setor: "Cozinha" },
        { id: 2, nome: "Maria Oliveira", setor: "Cozinha" },
        { id: 3, nome: "Pedro Lima", setor: "Cozinha" },
        { id: 4, nome: "Ana Costa", setor: "Cozinha" },
        { id: 5, nome: "Roberto Alves", setor: "Garçon" },
        { id: 6, nome: "Carlos Silva", setor: "Garçon" },
        { id: 7, nome: "Fernanda Souza", setor: "Garçon" },
        { id: 8, nome: "Juliana Martins", setor: "Garçon" },
        { id: 9, nome: "Larissa Ferreira", setor: "Atividades" },
        { id: 10, nome: "Marcos Pereira", setor: "Atividades" },
      ],
    },
    {
      id: 2,
      diaSemana: "Domingo",
      data: "27/09/2026",
      funcionarios: [
        { id: 1, nome: "José Santos", setor: "Cozinha" },
        { id: 2, nome: "Maria Oliveira", setor: "Cozinha" },
        { id: 3, nome: "Pedro Lima", setor: "Cozinha" },
        { id: 4, nome: "Ana Costa", setor: "Cozinha" },
        { id: 5, nome: "Roberto Alves", setor: "Garçon" },
        { id: 6, nome: "Carlos Silva", setor: "Garçon" },
        { id: 7, nome: "Fernanda Souza", setor: "Garçon" },
        { id: 8, nome: "Juliana Martins", setor: "Garçon" },
        { id: 9, nome: "Larissa Ferreira", setor: "Atividades" },
        { id: 10, nome: "Marcos Pereira", setor: "Atividades" },
      ],
    },
    {
      id: 3,
      diaSemana: "Segunda",
      data: "28/09/2026",
      funcionarios: [
        { id: 1, nome: "José Santos", setor: "Cozinha" },
        { id: 2, nome: "Maria Oliveira", setor: "Cozinha" },
        { id: 3, nome: "Pedro Lima", setor: "Cozinha" },
        { id: 4, nome: "Ana Costa", setor: "Cozinha" },
        { id: 5, nome: "Roberto Alves", setor: "Garçon" },
        { id: 6, nome: "Carlos Silva", setor: "Garçon" },
        { id: 7, nome: "Fernanda Souza", setor: "Garçon" },
        { id: 8, nome: "Juliana Martins", setor: "Garçon" },
        { id: 9, nome: "Larissa Ferreira", setor: "Atividades" },
        { id: 10, nome: "Marcos Pereira", setor: "Atividades" },
      ],
    },
  ];

  const coresSetor = {
    Cozinha: "#2563eb",
    Garçon: "#16a34a",
    Salão: "#16a34a",
    Atividades: "#9333ea",
  };

  const agruparPorSetor = (funcionarios) =>
    Object.entries(
      funcionarios.reduce((acc, f) => {
        (acc[f.setor] ||= []).push(f);
        return acc;
      }, {})
    );

  return (
    <>
      <div className={style.headerHistorico}>
        <div className={style.tituloHistorico}><h1>Histórico de Escalas</h1><p>Resumo completo por semana - equipe, pagamentos e totais</p></div>
      </div>
      <div className={style.containerHistorico}>
        <div className={style.manipularSemana}>
          <button className={style.btnAnterior} onClick={() =>
            setInicioSemana(somarDias(inicioSemana, -7))}>
            <ArrowLeft />
            <p>Anterior</p>
          </button>
          <div className={style.semanaEscolhida}>
            <CalendarDays />
            <p className={style.periodoEscolhido}>
              {formatarData(inicioSemana)} <Minus /> {formatarData(somarDias(inicioSemana, 6))}
            </p>
            <button className={style.btnIrParaData} onClick={abrirSeletor}>
              <CalendarSearch />
              <p>Ir para data</p>
            </button>
            <input
              ref={inputDataRef}
              type="date"
              className={style.inputData}
              onChange={escolherData}
            />
          </div>

          <button className={style.btnProxima}
            onClick={() => setInicioSemana(somarDias(inicioSemana, 7))}
          >
            <p>Próxima</p>
            <ArrowRight />
          </button>
        </div>
        <div className={style.infoSemana}>
          <div className={style.cardInfoSemana}>
            <div className={style.iconeCard}>
              <DollarSign />
            </div>
            <p>Total Mão de Obra</p>
            <p className={style.valorMaoDeObra}>R$2.790,00</p>
          </div>
          <div className={style.cardInfoSemana}>
            <div className={style.iconeCard}>
              <Banknote />
            </div>
            <p>Pago em Dinheiro</p>
            <p className={style.valorEmDinheiro}>R$1.270,00</p>
          </div>
          <div className={style.cardInfoSemana}>
            <div className={style.iconeCard}>
              <QrCode />
            </div>
            <p>Pago em PIX</p>
            <p className={style.valorEmPix}>R$1.270,00</p>
          </div>
          <div className={style.cardInfoSemana}>
            <div className={style.iconeCard}>
              <Users />
            </div>
            <p>Equipe da Semana</p>
            <p className={style.qtdFuncionarios}>10 func.</p>
            <p className={style.pagamentosSemana}>
              <span style={{ color: "green" }}>10 pagos</span> -
              <span style={{ marginLeft: "2px", color: "red" }}>2 pendentes</span>
            </p>
          </div>
        </div>
        <div
          className={style.quemTrabalhou}
          onClick={() => setQuemTrabalhouAberto(!quemTrabalhouAberto)}
        >
          <div className={style.tituloCardQuemTrabalhou}>
            <Users />
            <p>Quem trabalhou esta semana</p>
            <p>(10 funcionários)</p>
          </div>

          {quemTrabalhouAberto ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          )}
        </div>

        {quemTrabalhouAberto && (
          <>
            <div className={style.tpList}>
              {grupos.map((grupo) => (
                <section className={style.tpWrap} key={grupo.setor}>
                  <div className={style.tpGroup}>
                    <span
                      className={style.tpDot}
                      style={{ background: grupo.cor }}
                    />

                    <span
                      className={style.tpGroupTitle}
                      style={{ color: grupo.cor }}
                    >
                      {grupo.setor}
                    </span>

                    <span className={style.tpGroupCount}>
                      ({grupo.itens.length})
                    </span>
                  </div>

                  <div className={style.tpHead}>
                    <div>Funcionário</div>
                    <div>Dias / Datas</div>
                    <div className={style.valor}>Valor</div>
                    <div className={style.via}>Via</div>
                    <div className={style.status}>Status</div>
                  </div>

                  {grupo.itens.map((item) => (
                    <div className={style.tpRow} key={item.id}>
                      <div className={style.tpFunc}>
                        <span className={style.tpAvatar}>
                          <User size={15} strokeWidth={1.75} />
                        </span>

                        <span className={style.tpNome}>
                          {item.nome}
                        </span>
                      </div>

                      <div>
                        <div className={style.tpDiasQtd}>
                          {item.dias.length}d
                        </div>

                        <div className={style.tpDiasDatas}>
                          {item.dias.join(", ")}
                        </div>
                      </div>

                      <div className={style.tpValor}>
                        {formatBRL(item.valor)}
                      </div>

                      <div className={style.tpVia}>
                        <Wallet size={17} strokeWidth={1.75} />
                        {item.via}
                      </div>

                      <div className={style.tpStatus}>
                        <span className={style.tpBadge}>
                          <Check size={15} />
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className={style.tpTotal}>
                    <span className={style.tpTotalLabel}>
                      Total {grupo.setor}:
                    </span>
                    <span className={style.tpTotalValor}>
                      {formatBRL(grupo.itens.reduce((soma, item) => soma + item.valor, 0))}
                    </span>
                  </div>
                </section>
              )
              )}
            </div>
            <div className={style.espacoFooter}></div>
          </>
        )}

        <div className={style.areaDetalheDatas}>
          <div className={style.headerCardDetalheData}>
            <div className={style.tituloCard}>
              <p>Detalhe por Data</p>
            </div>
            <div className={style.filtrosCardDetalhe}>
              <div className={style.inputPesquisa}>
                <Search />
                <input type="text" placeholder="Filtrar por nome..." />
              </div>
            </div>
          </div>
          {datas.map((d) => (
            <div className={style.dataItem} key={d.id}>
              <div className={style.cardDataDetalhe} onClick={() => toggleData(d.id)}>
                <div className={style.bolinhaLaranja}></div>

                <div className={style.tituloData}>
                  <p className={style.diaDaSemana}>{d.diaSemana}</p>
                  <p className={style.diaDaEscala}>{d.data}</p>
                </div>

                <div className={style.qtdFuncDropDown}>
                  <p className={style.qtdFunc}>{d.funcionarios.length} func.</p>
                  {datasAbertas.includes(d.id) ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {datasAbertas.includes(d.id) && (
                <div className={style.listaFuncData}>
                  {agruparPorSetor(d.funcionarios).map(([setor, funcs]) => (
                    <div
                      className={style.colunaSetor}
                      key={setor}
                      style={{ "--cor": coresSetor[setor] || "#6b7280" }}
                    >
                      <div className={style.tituloSetor}>
                        <span className={style.pontoSetor} />
                        {setor} ({funcs.length})
                      </div>

                      <div className={style.chips}>
                        {funcs.map((f) => (
                          <span className={style.chip} key={f.id}>
                            {f.nome}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div >

    </>
  );
}

export default Historico;