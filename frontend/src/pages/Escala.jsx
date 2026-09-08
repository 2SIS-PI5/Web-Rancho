import style from "./css/Escala.module.css";
import { CalendarDays, ChevronDown, ChevronUp, Plus, X, User, Search } from "lucide-react";
import { useState } from "react";

function Escala() {
  const [datasAberta, setDatasAberta] = useState(false);
  const [modalAdicionar, setModalAdicionar] = useState(null);

  function abrirModalAdicionar(area, dia) {
    setModalAdicionar({ area, dia });
  }

  function fecharModalAdicionar() {
    setModalAdicionar(null);
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
            <p>Gerenciar Datas</p>
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
              <input type="date" />
              <button className={style.btnAdicionarData}>
                <Plus />
                <p>Adicionar</p>
              </button>
              <button className={style.btnSabDomAtual}>
                <CalendarDays />
                <p>Sáb/Dom Atual</p>
              </button>
            </div>
            <div className={style.datasEscolhidas}>
              <div className={style.dataEscolhida}>
                <p>sábado, 22/08</p>
                <button className={style.btnRemoverDataEscolhida}>
                  <X />
                </button>
              </div>
              <div className={style.dataEscolhida}>
                <p>domingo, 23/08</p>
                <button className={style.btnRemoverDataEscolhida}>
                  <X />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className={style.cardEscala}>
          <div className={style.tituloCard}>
            <div className={style.informacoesData}>
              <div className={style.bolinhaData}></div>
              <p className={style.diaSemanaEscala}>
                Sábado
              </p>
              <p className={style.dataEscala}>
                22/08/2026
              </p>
            </div>
            <div className={style.escaladosBtnConfirmar}>
              <div className={style.qtdEscalados}>
                <p>0 escalados</p>
              </div>

              <button className={style.btnConfirmarEscala}>
                <p>Confirmar</p>
              </button>
            </div>
          </div>

          <div className={style.areasEscala}>
            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Cozinha
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button onClick={() => abrirModalAdicionar("Cozinha", "sábado, 22/08")}>
                  <Plus />
                  <p>Adicionar Cozinha</p>
                </button>
              </div>
            </div>

            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Salão
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button>
                  <Plus />
                  <p>Adicionar Salão</p>
                </button>
              </div>
            </div>
            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Atividades
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button>
                  <Plus />
                  <p>Adicionar Atividades</p>
                </button>
              </div>
            </div>
          </div>

        </div>
        <div className={style.cardEscala}>
          <div className={style.tituloCard}>
            <div className={style.informacoesData}>
              <div className={style.bolinhaData}></div>
              <p className={style.diaSemanaEscala}>
                Sábado
              </p>
              <p className={style.dataEscala}>
                22/08/2026
              </p>
            </div>
            <div className={style.escaladosBtnConfirmar}>
              <div className={style.qtdEscalados}>
                <p>0 escalados</p>
              </div>

              <button className={style.btnConfirmarEscala}>
                <p>Confirmar</p>
              </button>
            </div>
          </div>

          <div className={style.areasEscala}>
            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Cozinha
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button>
                  <Plus />
                  <p>Adicionar Cozinha</p>
                </button>
              </div>
            </div>

            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Salão
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button>
                  <Plus />
                  <p>Adicionar Salão</p>
                </button>
              </div>
            </div>
            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Atividades
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button>
                  <Plus />
                  <p>Adicionar Atividades</p>
                </button>
              </div>
            </div>
          </div>

        </div>
        <div className={style.cardEscala}>
          <div className={style.tituloCard}>
            <div className={style.informacoesData}>
              <div className={style.bolinhaData}></div>
              <p className={style.diaSemanaEscala}>
                Domingo
              </p>
              <p className={style.dataEscala}>
                23/08/2026
              </p>
            </div>
            <div className={style.escaladosBtnConfirmar}>
              <div className={style.qtdEscalados}>
                <p>0 escalados</p>
              </div>

              <button className={style.btnConfirmarEscala}>
                <p>Confirmar</p>
              </button>
            </div>
          </div>

          <div className={style.areasEscala}>
            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Cozinha
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button>
                  <Plus />
                  <p>Adicionar Cozinha</p>
                </button>
              </div>
            </div>

            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Salão
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button>
                  <Plus />
                  <p>Adicionar Salão</p>
                </button>
              </div>
            </div>

            <div className={style.area}>
              <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>
                  Atividades
                </p>

                <p className={style.qtdEscaladosArea}>
                  (0)
                </p>
              </div>

              <div className={style.painelEscalados}></div>

              <div className={style.btnAdicionar}>
                <button>
                  <Plus />
                  <p>Adicionar Atividades</p>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
      {modalAdicionar && (
        <div className={style.overlay} onClick={fecharModalAdicionar}>
          <div className={style.modalAdicionarFuncionario} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <div className={style.tituloModalAddFuncArea}>
                <div className={style.corArea}></div>
                <h2>{modalAdicionar.area}</h2>
                <p> - {modalAdicionar.dia}</p>
              </div>
              <button className={style.btnFecharModal} onClick={fecharModalAdicionar}>
                <X />
              </button>
            </div>
            <div className={style.painelFuncionariosArea}>
              <div className={style.inputPesquisa}>
                <Search />
                <input type="text" placeholder="Buscar funcionário..." />
              </div>
              
              <div className={style.listaFuncionarios}>

                <label className={style.cardFuncionario}>
                  <div className={style.fotoFuncionario}>
                    <User />
                  </div>

                  <div className={style.infosFuncionario}>
                    <p>José Santos</p>
                    <p>(11) 91077-0909</p>
                  </div>

                  <div className={style.btnFuncionarioSelecionado}>
                    <input type="checkbox" />
                  </div>
                </label>


                <label className={style.cardFuncionario}>
                  <div className={style.fotoFuncionario}>
                    <User />
                  </div>

                  <div className={style.infosFuncionario}>
                    <p>Maria Rosa</p>
                    <p>(11) 91077-0886</p>
                  </div>

                  <div className={style.btnFuncionarioSelecionado}>
                    <input type="checkbox" />
                  </div>
                </label>


                <label className={style.cardFuncionario}>
                  <div className={style.fotoFuncionario}>
                    <User />
                  </div>

                  <div className={style.infosFuncionario}>
                    <p>Jenifer Santos</p>
                    <p>(11) 91077-0886</p>
                  </div>

                  <div className={style.btnFuncionarioSelecionado}>
                    <input type="checkbox" />
                  </div>
                </label>


                <label className={style.cardFuncionario}>
                  <div className={style.fotoFuncionario}>
                    <User />
                  </div>

                  <div className={style.infosFuncionario}>
                    <p>Larissa Amaral</p>
                    <p>(11) 91077-0886</p>
                  </div>

                  <div className={style.btnFuncionarioSelecionado}>
                    <input type="checkbox" />
                  </div>
                </label>


                <label className={style.cardFuncionario}>
                  <div className={style.fotoFuncionario}>
                    <User />
                  </div>

                  <div className={style.infosFuncionario}>
                    <p>Larissa Amaral</p>
                    <p>(11) 91077-0886</p>
                  </div>

                  <div className={style.btnFuncionarioSelecionado}>
                    <input type="checkbox" />
                  </div>
                </label>


                <label className={style.cardFuncionario}>
                  <div className={style.fotoFuncionario}>
                    <User />
                  </div>

                  <div className={style.infosFuncionario}>
                    <p>Larissa Amaral</p>
                    <p>(11) 91077-0886</p>
                  </div>

                  <div className={style.btnFuncionarioSelecionado}>
                    <input type="checkbox" />
                  </div>
                </label>

              </div>
              <button className={style.btnAddFuncionarioEscala}>
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