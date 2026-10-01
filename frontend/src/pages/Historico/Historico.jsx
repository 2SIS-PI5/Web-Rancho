import style from "./css/Historico.module.css";

import {
  Banknote, DollarSign, QrCode, Users,
  ChevronDown, ChevronUp, Search
} from "lucide-react";

import SeletorSemana from "./components/SeletorSemana";
import QuemTrabalhou from "./components/QuemTrabalhou";
import DetalheDatas from "./components/DetalheDatas";

import { useState } from "react";

function Historico() {
  const [inicioSemana, setInicioSemana] = useState(new Date(2026, 8, 19));

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
        <SeletorSemana inicioSemana={inicioSemana} onChange={setInicioSemana} />

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
        <QuemTrabalhou grupos={grupos} />
        <DetalheDatas datas={datas} />
      </div >

    </>
  );
}

export default Historico;