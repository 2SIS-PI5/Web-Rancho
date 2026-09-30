import style from "./css/Funcionarios.module.css";
import CardFuncionario from "./components/CardFuncionario";
import ModalFuncionario from "./components/ModalFuncionario";
import ModalExcluirFuncionario from "./components/ModalExcluirFuncionario";
import api from "../../services/api";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

const funcionariosMock = [
  {
    id: 1,
    nome: "Rosa Silva",
    area: "Cozinha",
    distancia: 5.2,
    telefone: "(11) 91077-0886",
    cep: "09750-000",
    chavePix: "11910770886",
    valorDiaria: 180,
    ajudaTransporte: true
  },
  {
    id: 2,
    nome: "Fernando Santos",
    area: "Atividades",
    distancia: 8.7,
    telefone: "(11) 98765-4321",
    cep: "09810-000",
    chavePix: "fernando@email.com",
    valorDiaria: 150,
    ajudaTransporte: false
  },
  {
    id: 3,
    nome: "Patricia Oliveira",
    area: "Salão",
    distancia: 3.4,
    telefone: "(11) 91234-5678",
    cep: "09720-000",
    chavePix: "11912345678",
    valorDiaria: 160,
    ajudaTransporte: true
  },
  {
    id: 4,
    nome: "Rafael Souza",
    area: "Cozinha",
    distancia: 6.1,
    telefone: "(11) 99876-5432",
    cep: "09650-000",
    chavePix: "rafael@email.com",
    valorDiaria: 180,
    ajudaTransporte: false
  },
  {
    id: 5,
    nome: "Mariana Costa",
    area: "Salão",
    distancia: 4.8,
    telefone: "(11) 95555-4444",
    cep: "09760-000",
    chavePix: "11955554444",
    valorDiaria: 160,
    ajudaTransporte: true
  },
  {
    id: 6,
    nome: "Carlos Mendes",
    area: "Atividades",
    distancia: 10.3,
    telefone: "(11) 94444-3333",
    cep: "09820-000",
    chavePix: "carlos@email.com",
    valorDiaria: 150,
    ajudaTransporte: false
  }
];

const formularioInicial = { nome: "", telefone: "", cep: "", chavePix: "", area: "Cozinha", valorDiaria: "", ajudaTransporte: false };

function Funcionarios() {
  function abrirModalExcluir(funcionario) {
    setFuncionarioExcluir(funcionario);
    setModalExcluirAberto(true);
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false);
    setFuncionarioExcluir(null);
  }

  function abrirModalEdicao(funcionario) {
    setFuncionarioSelecionado(funcionario);
    setModalAberto(true);
  }

  function abrirModalAdicionar() {
    setFuncionarioSelecionado(null);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setFuncionarioSelecionado(null);
  }

  const [areaSelecionada, setAreaSelecionada] = useState("Todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [funcionarioExcluir, setFuncionarioExcluir] = useState(null);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  const [funcionarios, setFuncionarios] = useState(funcionariosMock);

  /* COM BANCO DE DADOS E JAVA
    useEffect(() => {
      buscarFuncionarios();
    }, []);


    async function buscarFuncionarios() {
      try {
        const resposta = await api.get("/funcionarios");

        setFuncionarios(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar funcionários:", erro);
      }
 } */

  return (
    <>
      <div className={style.headerFuncionarios}>
        <div className={style.tituloFuncionarios}><h1>Funcionários</h1><p>Gerencie o cadastro dos funcionários</p></div>
        <div className={style.btnAdicionarFuncionario}><button onClick={() => abrirModalAdicionar()}><Plus /><p>Adicionar Funcionário</p></button></div>
      </div>
      <div className={style.containerFuncionarios}>
        <div className={style.inputPesquisa}>
          <Search />
          <input type="text" placeholder="Buscar funcionário por nome..." />
        </div>
        <div className={style.areaFiltroFuncionarios}>
          <p>Filtrar por Área</p>
          <div className={style.btnsFiltros}>
            <button
              className={areaSelecionada === "Todas" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Todas")}>
              Todas as Áreas
            </button>

            <button
              className={areaSelecionada === "Cozinha" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Cozinha")}>
              Cozinha
            </button>

            <button
              className={areaSelecionada === "Salão" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Salão")} >
              Salão
            </button>

            <button
              className={areaSelecionada === "Atividades" ? style.filtroAtivo : ""}
              onClick={() => setAreaSelecionada("Atividades")} >
              Atividades
            </button>
          </div>
        </div>
        <div className={style.containerCardFuncionarios}>
          {funcionarios.map((f, index) => (
            <CardFuncionario key={f.id} nome={f.nome} area={f.area} distancia={f.distancia} telefone={f.telefone} cep={f.cep} chavePix={f.chavePix}
              valorDiaria={f.valorDiaria} ajudaTransporte={f.ajudaTransporte} onEditar={() => abrirModalEdicao(f)} onExcluir={() => abrirModalExcluir(f)} />
          ))}
        </div>
      </div>
      <ModalFuncionario aberto={modalAberto} onFechar={fecharModal} funcionario={funcionarioSelecionado} />
      <ModalExcluirFuncionario aberto={modalExcluirAberto} onFechar={fecharModalExcluir} funcionario={funcionarioExcluir}
        onConfirmar={() => {
          alert("Funcionário excluído!");
          fecharModalExcluir();
        }}
      />
    </>
  )
}
export default Funcionarios;
