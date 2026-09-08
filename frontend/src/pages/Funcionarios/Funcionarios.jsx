import style from "./css/Funcionarios.module.css";

import { Plus, Search, Pencil, Trash2, Star, MapPin, X } from "lucide-react";
import { useState } from "react";


function Funcionarios() {
  const [modalAdicionar, setModalAdicionar] = useState(null);

  function abrirModalAdicionar() {
    setModalAdicionar(true);
  }

  function fecharModalAdicionar() {
    setModalAdicionar(null);
  }

  const [marcado, setMarcado] = useState(false);

  return (
    <>
      <div className={style.headerFuncionarios}>
        <div className={style.tituloFuncionarios}>
          <h1>Funcionários</h1>
          <p>Gerencie o cadastro dos funcionários</p>
        </div>

        <div className={style.btnAdicionarFuncionario}>
          <button onClick={abrirModalAdicionar}>
            <Plus />
            <p>Adicionar Funcionário</p>
          </button>
        </div>
      </div>


      <div className={style.containerFuncionarios}>
        <div className={style.inputPesquisa}>
          <Search />
          <input type="text" placeholder="Buscar funcionário por nome..." />
        </div>
        <div className={style.areaFiltroFuncionarios}>
          <p>Filtrar por Área</p>
          <div className={style.btnsFiltros}>
            <button onClick={""}>Todas as Áreas</button>
            <button onClick={""}>Cozinha</button>
            <button onClick={""}>Salão</button>
            <button onClick={""}>Atividades</button>
          </div>
        </div>
        <div className={style.containerCardFuncionarios}>
          <div className={style.cardFuncionario}>
            <div className={style.nomeAreaLocalizacao}>
              <p className={style.nomeFuncionario}>Ryan Pina</p>
              <p className={style.areaFuncionario}>Cozinha</p>
              <p className={style.distanciaFuncionario}><MapPin /> Próximo</p>
            </div>
            <div className={style.estrelasFuncionario}>
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
              <p>4.7 (3 avaliações)</p>
            </div>
            <div className={style.infosFuncionario}>
              <p>Telefone: <span className={style.telefoneFuncionario}>(11) 91077-0886</span></p>
              <p>CEP: <span className={style.cepFuncionario}>(11) 91077-0886</span></p>
              <p>Chave PIX:: <span className={style.cepFuncionario}>11910770886</span></p>
              <p>Valor Diária: <span className={style.valorDiariaFuncionario}>R$100.00</span></p>
              <p>Ajuda Transporte: <span className={style.ajudaTransporte}>Não</span></p>
            </div>
            <div className={style.btnsCardFuncionario}>
              <button>
                <Pencil />
                <p>Editar</p>
              </button>
              <button>
                <Trash2 />
                <p>Excluir</p>
              </button>
            </div>
          </div>
          <div className={style.cardFuncionario}>
            <div className={style.nomeAreaLocalizacao}>
              <p className={style.nomeFuncionario}>Ryan Pina</p>
              <p className={style.areaFuncionario}>Cozinha</p>
              <p className={style.distanciaFuncionario}><MapPin /> Próximo</p>
            </div>
            <div className={style.estrelasFuncionario}>
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
              <p>4.7 (3 avaliações)</p>
            </div>
            <div className={style.infosFuncionario}>
              <p>Telefone: <span className={style.telefoneFuncionario}>(11) 91077-0886</span></p>
              <p>CEP: <span className={style.cepFuncionario}>(11) 91077-0886</span></p>
              <p>Chave PIX:: <span className={style.cepFuncionario}>11910770886</span></p>
              <p>Valor Diária: <span className={style.valorDiariaFuncionario}>R$100.00</span></p>
              <p>Ajuda Transporte: <span className={style.ajudaTransporte}>Não</span></p>
            </div>
            <div className={style.btnsCardFuncionario}>
              <button>
                <Pencil />
                <p>Editar</p>
              </button>
              <button>
                <Trash2 />
                <p>Excluir</p>
              </button>
            </div>
          </div>
          <div className={style.cardFuncionario}>
            <div className={style.nomeAreaLocalizacao}>
              <p className={style.nomeFuncionario}>Ryan Pina</p>
              <p className={style.areaFuncionario}>Cozinha</p>
              <p className={style.distanciaFuncionario}><MapPin />Próximo</p>
            </div>
            <div className={style.estrelasFuncionario}>
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
              <p>4.7 (3 avaliações)</p>
            </div>
            <div className={style.infosFuncionario}>
              <p>Telefone: <span className={style.telefoneFuncionario}>(11) 91077-0886</span></p>
              <p>CEP: <span className={style.cepFuncionario}>(11) 91077-0886</span></p>
              <p>Chave PIX:: <span className={style.cepFuncionario}>11910770886</span></p>
              <p>Valor Diária: <span className={style.valorDiariaFuncionario}>R$100.00</span></p>
              <p>Ajuda Transporte: <span className={style.ajudaTransporte}>Não</span></p>
            </div>
            <div className={style.btnsCardFuncionario}>
              <button>
                <Pencil />
                <p>Editar</p>
              </button>
              <button>
                <Trash2 />
                <p>Excluir</p>
              </button>
            </div>
          </div>
          <div className={style.cardFuncionario}>
            <div className={style.nomeAreaLocalizacao}>
              <p className={style.nomeFuncionario}>Ryan Pina</p>
              <p className={style.areaFuncionario}>Cozinha</p>
              <p className={style.distanciaFuncionario}><MapPin />Próximo</p>
            </div>
            <div className={style.estrelasFuncionario}>
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
              <p>4.7 (3 avaliações)</p>
            </div>
            <div className={style.infosFuncionario}>
              <p>Telefone: <span className={style.telefoneFuncionario}>(11) 91077-0886</span></p>
              <p>CEP: <span className={style.cepFuncionario}>(11) 91077-0886</span></p>
              <p>Chave PIX:: <span className={style.cepFuncionario}>11910770886</span></p>
              <p>Valor Diária: <span className={style.valorDiariaFuncionario}>R$100.00</span></p>
              <p>Ajuda Transporte: <span className={style.ajudaTransporte}>Não</span></p>
            </div>
            <div className={style.btnsCardFuncionario}>
              <button>
                <Pencil />
                <p>Editar</p>
              </button>
              <button>
                <Trash2 />
                <p>Excluir</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      {modalAdicionar && (
        <div className={style.overlay} onClick={fecharModalAdicionar}>
          <div className={style.modalAdicionarFuncionario} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <div className={style.tituloModalAddFunc}>
                <h2>Novo Funcionário</h2>
              </div>
              <button className={style.btnFecharModal} onClick={fecharModalAdicionar}>
                <X />
              </button>
            </div>
            <div className={style.painelCadastroInfos}>
              <div className={style.duplaInputs}>
                <div className={style.inputInfo}>
                  <p>Nome</p>
                  <input type="text" />
                </div>
                <div className={style.inputInfo}>
                  <p>Telefone</p>
                  <input type="text" placeholder="(XX) XXXXX-XXXX" />
                </div>
              </div>
              <div className={style.duplaInputs}>
                <div className={style.inputInfo}>
                  <p>CEP</p>
                  <input type="text" placeholder="00000-00" />
                </div>
                <div className={style.inputInfo}>
                  <p>Chave PIX</p>
                  <input type="text" />
                </div>
              </div>
              <div className={style.duplaInputs}>
                <div className={style.inputInfo}>
                  <p>Área de Atuação</p>
                  <select name="areaFuncionario" id="areaFuncionario">
                    <option value="cozinha">Cozinha</option>
                    <option value="salao">Salão</option>
                    <option value="atividades">Atividades</option>
                  </select>
                </div>
                <div className={style.inputInfo}>
                  <p>Valor da Diária (R$)</p>
                  <input type="number" placeholder="R$" />
                </div>
              </div>
              <div className={style.inputCheck}>
                <label className={style.inputCheck}>
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={(e) => setMarcado(e.target.checked)}
                  />
                  <p>Possui ajuda de transporte</p>
                </label>
              </div>
            </div>
            <div className={style.btnModalCadastro}>
              <button onClick={fecharModalAdicionar}>
                <p>Cancelar</p>
              </button>
              <button onClick={() => {
                alert("Cadastrado com sucesso!");
                fecharModalAdicionar();
              }
              }>
                <p>Adicionar</p>
              </button>
            </div>
          </div>
        </div >
      )
      }
    </>)
}

export default Funcionarios;