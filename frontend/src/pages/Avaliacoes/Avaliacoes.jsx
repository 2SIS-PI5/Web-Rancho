import style from "./css/Avaliacoes.module.css";
import { Search } from "lucide-react";
import { useState } from "react";
import ModalAvaliacao from "./components/ModalAvaliacao";
import CardAvaliacao from "./components/CardAvaliacao";

function Avaliacoes() {

  const funcionarios = [
    {
      nome: "Ryan Pina",
      area: "Cozinha",
      mediaAvaliacao: 4.8,
      qtdAvaliacoes: 12,
    },
    {
      nome: "Ana Silva",
      area: "Salão",
      mediaAvaliacao: 4.5,
      qtdAvaliacoes: 8,
    },
    {
      nome: "Lucas Santos",
      area: "Atividades",
      mediaAvaliacao: 4.2,
      qtdAvaliacoes: 6,
    },
    {
      nome: "Mariana Oliveira",
      area: "Cozinha",
      mediaAvaliacao: 5.0,
      qtdAvaliacoes: 15,
    },
  ];

  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  function abrirModalAvaliacao(funcionario) {
    setFuncionarioSelecionado(funcionario);
    setModalAberto(true);
  }

  function fecharModalAvaliacao() {
    setModalAberto(false);
    setFuncionarioSelecionado(null);
  }

  return (
    <>
      <div className={style.headerAvaliacoes}>
        <div className={style.tituloAvaliacoes}><h1>Avaliações</h1><p>Avalie o desempenho dos funcionários</p></div>
      </div>
      <div className={style.containerAvaliacoes}>
        <div className={style.inputPesquisa}>
          <Search />
          <input type="text" placeholder="Buscar funcionário por nome..." />
        </div>
        <div className={style.painelAvaliacoes}>
          {funcionarios.map((f, index) => (
            <CardAvaliacao key={index} nome={f.nome} area={f.area} mediaAvaliacao={f.mediaAvaliacao}
              qtdAvaliacoes={f.qtdAvaliacoes} onAvaliar={() => abrirModalAvaliacao(f)}/>
          ))}
        </div>
      </div>
      {modalAberto && funcionarioSelecionado && (
        <ModalAvaliacao
          funcionario={funcionarioSelecionado}
          onFechar={fecharModalAvaliacao}
        />
      )}
    </>
  );
}

export default Avaliacoes;