import { useState } from "react";
import { Search } from "lucide-react";
import style from "../css/Historico.module.css";
import ItemData from "./ItemData";

const normalizar = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function DetalheDatas({ datas }) {
  const [datasAbertas, setDatasAbertas] = useState([]);
  const [busca, setBusca] = useState("");

  const toggleData = (id) => {
    setDatasAbertas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const termo = normalizar(busca.trim());

  const datasFiltradas = termo
    ? datas
        .map((d) => ({
          ...d,
          funcionarios: d.funcionarios.filter((f) =>
            normalizar(f.nome).includes(termo)
          ),
        }))
        .filter((d) => d.funcionarios.length > 0)
    : datas;

  return (
    <div className={style.areaDetalheDatas}>
      <div className={style.headerCardDetalheData}>
        <div className={style.tituloCard}>
          <p>Detalhe por Data</p>
        </div>

        <div className={style.filtrosCardDetalhe}>
          <div className={style.inputPesquisa}>
            <Search />
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </div>

      {datasFiltradas.map((d) => (
        <ItemData
          key={d.id}
          data={d}
          aberta={datasAbertas.includes(d.id)}
          onToggle={() => toggleData(d.id)}
        />
      ))}
    </div>
  );
}

export default DetalheDatas;