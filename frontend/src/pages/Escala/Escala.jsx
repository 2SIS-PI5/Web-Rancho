import style from "./css/Escala.module.css";

import { CalendarDays, ChevronDown, ChevronUp, Plus, X, User, Search } from "lucide-react";

import { useState } from "react";

import CardEscala from "./components/CardEscala";

function Escala() {
  const [datasAberta, setDatasAberta] = useState(false);

  const datas = [
    {
      id: "2026-08-22",
      diaSemana: "Sábado",
      data: "26/09/2026",
      areas: [
        {
          id: "cozinha",
          nome: "Cozinha",
          funcionarios: [
            {
              nome: "Rosa",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Emily",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Alex",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Marcela",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Pietro",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Mariana",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Esequias",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Carlos",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Maria",
              telefone: "(11) 91077-0886"
            }
          ]
        },
        {
          id: "salao",
          nome: "Salão",
          funcionarios: [
            {
              nome: "Omar",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Patricia",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Miguel",
              telefone: "(11) 91077-0886"
            },
            {
              nome: "Nicolly",
              telefone: "(11) 91077-0886"
            }
          ]
        },
        {
          id: "atividades",
          nome: "Atividades",
          funcionarios: [{
            nome: "Fernando",
            telefone: "(11) 91077-0886"
          },
          {
            nome: "André  ",
            telefone: "(11) 91077-0886"
          },
          {
            nome: "João",
            telefone: "(11) 91077-0886"
          }]
        }
      ]
    },
    {
      id: "2026-08-23",
      diaSemana: "Domingo",
      data: "27/09/2026",
      areas: [
        {
          id: "cozinha",
          nome: "Cozinha",
          funcionarios: [
          ]
        },
        {
          id: "salao",
          nome: "Salão",
          funcionarios: []
        },
        {
          id: "atividades",
          nome: "Atividades",
          funcionarios: []
        }
      ]
    }
  ];

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
                <p>sábado, 26/09</p>
                <button className={style.btnRemoverDataEscolhida}>
                  <X />
                </button>
              </div>
              <div className={style.dataEscolhida}>
                <p>domingo, 27/09</p>
                <button className={style.btnRemoverDataEscolhida}>
                  <X />
                </button>
              </div>
            </div>
          </div>
        )}
        {datas.map((data) => (
          <CardEscala
            key={data.id}
            diaSemana={data.diaSemana}
            data={data.data}
            areas={data.areas}
          />
        ))}
      </div>
    </>
  );
}

export default Escala;