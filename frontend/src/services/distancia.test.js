import assert from "node:assert/strict";
import { test } from "node:test";
import { calcularDistanciaAteRancho, calcularDistanciaHaversine } from "./distancia.js";
import { classificarDistanciaKm, formatDistanciaKm } from "../utils/formatadores.js";

const CEP_RANCHO = "09834203";

function respostaJson(dados, status = 200) {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => dados
    };
}

function substituirFetch(teste, simulador) {
    const fetchOriginal = globalThis.fetch;
    globalThis.fetch = simulador;
    teste.after(() => { globalThis.fetch = fetchOriginal; });
}

test("Haversine retorna zero no mesmo ponto e distância conhecida no equador", () => {
    assert.equal(calcularDistanciaHaversine(0, 0, 0, 0), 0);
    assert.equal(calcularDistanciaHaversine(0, 0, 0, 1), 111.19);
});

test("Haversine rejeita coordenadas ausentes ou fora dos limites geográficos", () => {
    assert.throws(() => calcularDistanciaHaversine(null, 0, 0, 1), /Coordenadas inválidas/);
    assert.throws(() => calcularDistanciaHaversine(91, 0, 0, 1), /Coordenadas inválidas/);
    assert.throws(() => calcularDistanciaHaversine(0, 181, 0, 1), /Coordenadas inválidas/);
});

test("consulta os dois CEPs, calcula e reutiliza as coordenadas em cache", async (teste) => {
    const cepFuncionario = "11111111";
    const cepsConsultados = [];
    const consultasMapa = [];
    const coordenadas = {
        funcionario: { latitude: -23.5503898, longitude: -46.633081 },
        rancho: { latitude: -23.51387, longitude: -46.86178 }
    };

    substituirFetch(teste, async (entrada) => {
        const url = new URL(entrada);
        if (url.hostname === "viacep.com.br") {
            const cep = url.pathname.split("/")[2];
            cepsConsultados.push(cep);
            const endereco = cep === CEP_RANCHO
                ? { logradouro: "Rua do Rancho", bairro: "Bairro Rancho" }
                : { logradouro: "Rua do Funcionario", bairro: "Bairro Funcionario" };
            return respostaJson({ ...endereco, localidade: "Sao Paulo", uf: "SP" });
        }

        assert.equal(url.hostname, "nominatim.openstreetmap.org");
        const consulta = url.searchParams.get("q");
        consultasMapa.push({ consulta, instante: Date.now() });
        return respostaJson([consulta.includes("Rua do Rancho")
            ? { lat: coordenadas.rancho.latitude, lon: coordenadas.rancho.longitude }
            : { lat: coordenadas.funcionario.latitude, lon: coordenadas.funcionario.longitude }]);
    });

    const distancia = await calcularDistanciaAteRancho(cepFuncionario);
    const distanciaEsperada = calcularDistanciaHaversine(
        coordenadas.funcionario.latitude,
        coordenadas.funcionario.longitude,
        coordenadas.rancho.latitude,
        coordenadas.rancho.longitude
    );

    assert.equal(distancia, distanciaEsperada);
    assert.deepEqual(cepsConsultados.sort(), [CEP_RANCHO, cepFuncionario].sort());
    assert.equal(consultasMapa.length, 2);
    assert.ok(consultasMapa[1].instante - consultasMapa[0].instante >= 1000);
    assert.equal(await calcularDistanciaAteRancho(cepFuncionario), distancia);
    assert.equal(cepsConsultados.length, 2);
    assert.equal(consultasMapa.length, 2);
});

test("informa quando o ViaCEP não encontra o CEP do funcionário", async (teste) => {
    substituirFetch(teste, async (entrada) => {
        const url = new URL(entrada);
        if (url.hostname === "viacep.com.br") return respostaJson({ erro: true });
        assert.fail("Nominatim não deve ser chamado para CEP inexistente.");
    });

    await assert.rejects(calcularDistanciaAteRancho("22222222"), /CEP não encontrado/);
});

test("propaga falhas HTTP do ViaCEP e do geocodificador", async (teste) => {
    substituirFetch(teste, async (entrada) => {
        const url = new URL(entrada);
        if (url.hostname === "viacep.com.br") {
            const cep = url.pathname.split("/")[2];
            return cep === "33333333"
                ? respostaJson({}, 503)
                : respostaJson({ logradouro: "Rua Teste", bairro: "Centro", localidade: "Sao Paulo", uf: "SP" });
        }
        return respostaJson({}, 429);
    });

    await assert.rejects(calcularDistanciaAteRancho("33333333"), /ViaCEP indisponível \(HTTP 503\)/);
    await assert.rejects(calcularDistanciaAteRancho("44444444"), /Serviço de mapas indisponível \(HTTP 429\)/);
});

test("formata distâncias numéricas, strings localizadas e entradas inválidas", () => {
    assert.equal(formatDistanciaKm(12.5), "12,5 km");
    assert.equal(formatDistanciaKm("12,5 km"), "12,5 km");
    assert.equal(formatDistanciaKm(null), "Distância indisponível");
    assert.equal(formatDistanciaKm(-1), "Distância indisponível");
});

test("classifica até 20 km como perto e acima de 20 km como longe", () => {
    assert.equal(classificarDistanciaKm(20), "Perto");
    assert.equal(classificarDistanciaKm("20,01 km"), "Longe");
    assert.equal(classificarDistanciaKm(null), null);
});