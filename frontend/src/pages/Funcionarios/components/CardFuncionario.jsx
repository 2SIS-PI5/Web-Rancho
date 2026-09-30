import style from "../css/Funcionarios.module.css";

import { MapPin, Star, Pencil, Trash2 } from "lucide-react";

function CardFuncionario({ nome, area, distancia, telefone, cep, chavePix, valorDiaria,
    ajudaTransporte, onEditar, onExcluir }) {
    return (
        <div className={style.cardFuncionario}>
            <div className={style.nomeAreaLocalizacao}>
                <p className={style.nomeFuncionario}>{nome}</p>
                <p className={style.areaFuncionario}>{area}</p>
                <p className={style.distanciaFuncionario}><MapPin />{distancia}</p>
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
                <p>Telefone: <span className={style.telefoneFuncionario}>{telefone}</span></p>
                <p>CEP: <span className={style.cepFuncionario}>{cep}</span></p>
                <p>Chave PIX:: <span className={style.cepFuncionario}>{chavePix}</span></p>
                <p>Valor Diária: <span className={style.valorDiariaFuncionario}>{valorDiaria}</span></p>
                <p>
                    Ajuda Transporte:{" "}
                    <span className={ajudaTransporte ? style.transporteSim : style.transporteNao}>
                        {ajudaTransporte ? "Sim" : "Não"}
                    </span>
                </p>
            </div>
            <div className={style.btnsCardFuncionario}>
                <button onClick={onEditar}>
                    <Pencil />
                    <p>Editar</p>
                </button>
                <button onClick={onExcluir}>
                    <Trash2 />
                    <p>Excluir</p>
                </button>
            </div>
        </div>
    )
}

export default CardFuncionario;