const CEP_RANCHO = "09834203";
const enderecosPorCep = new Map();
const coordenadasPorCep = new Map();
let filaNominatim = Promise.resolve();
let ultimaConsultaNominatim = 0;

async function buscarEndereco(cep) {
    const cepLimpo = String(cep ?? "").replace(/\D/g, "");
    if (cepLimpo.length !== 8) throw new Error("Informe um CEP com 8 dígitos.");
    if (enderecosPorCep.has(cepLimpo)) return enderecosPorCep.get(cepLimpo);

    const consulta = (async () => {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (!resposta.ok) throw new Error(`ViaCEP indisponível (HTTP ${resposta.status}).`);
        const dados = await resposta.json();
        if (dados.erro) throw new Error("CEP não encontrado.");
        return dados;
    })();

    enderecosPorCep.set(cepLimpo, consulta);
    try {
        return await consulta;
    } catch (error) {
        enderecosPorCep.delete(cepLimpo);
        throw error;
    }
}

function buscarNoNominatim(consulta) {
    const tarefa = filaNominatim.then(async () => {
        const espera = Math.max(0, 1100 - (Date.now() - ultimaConsultaNominatim));
        if (espera) await new Promise((resolver) => setTimeout(resolver, espera));
        ultimaConsultaNominatim = Date.now();

        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.search = new URLSearchParams({
            q: consulta,
            format: "jsonv2",
            limit: "1",
            countrycodes: "br",
            email: "rancho@rancho.com"
        });
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error(`Serviço de mapas indisponível (HTTP ${resposta.status}).`);
        const resultados = await resposta.json();
        const latitude = Number(resultados[0]?.lat);
        const longitude = Number(resultados[0]?.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
        return { latitude, longitude };
    });

    filaNominatim = tarefa.catch(() => undefined);
    return tarefa;
}

async function buscarCoordenadas(cep) {
    const cepLimpo = String(cep ?? "").replace(/\D/g, "");
    if (coordenadasPorCep.has(cepLimpo)) return coordenadasPorCep.get(cepLimpo);

    const consulta = (async () => {
        const endereco = await buscarEndereco(cepLimpo);
        const consultas = [
            [endereco.logradouro, endereco.bairro, endereco.localidade, endereco.uf, "Brasil"],
            [endereco.bairro, endereco.localidade, endereco.uf, "Brasil"],
            [endereco.localidade, endereco.uf, "Brasil"]
        ].map((partes) => partes.filter(Boolean).join(", "));

        for (const texto of [...new Set(consultas)]) {
            if (!texto) continue;
            const coordenadas = await buscarNoNominatim(texto);
            if (coordenadas) return coordenadas;
        }

        throw new Error("Não foi possível localizar esse CEP no mapa.");
    })();

    coordenadasPorCep.set(cepLimpo, consulta);
    try {
        return await consulta;
    } catch (error) {
        coordenadasPorCep.delete(cepLimpo);
        throw error;
    }
}

export function calcularDistanciaHaversine(latitudeOrigem, longitudeOrigem, latitudeDestino, longitudeDestino) {
    const entradas = [latitudeOrigem, longitudeOrigem, latitudeDestino, longitudeDestino];
    const valores = entradas.map((valor) => {
        if (typeof valor !== "number" && typeof valor !== "string") return NaN;
        if (typeof valor === "string" && !valor.trim()) return NaN;
        return Number(valor);
    });
    const [latitude1, longitude1, latitude2, longitude2] = valores;
    if (!valores.every(Number.isFinite)
        || latitude1 < -90 || latitude1 > 90 || latitude2 < -90 || latitude2 > 90
        || longitude1 < -180 || longitude1 > 180 || longitude2 < -180 || longitude2 > 180) {
        throw new Error("Coordenadas inválidas para calcular a distância.");
    }

    const [lat1, lon1, lat2, lon2] = valores.map((valor) => valor * (Math.PI / 180));
    const diferencaLatitude = lat2 - lat1;
    const diferencaLongitude = lon2 - lon1;
    const a = Math.sin(diferencaLatitude / 2) ** 2
        + Math.cos(lat1) * Math.cos(lat2) * Math.sin(diferencaLongitude / 2) ** 2;

    const aLimitado = Math.min(1, Math.max(0, a));
    return Number((6371 * 2 * Math.atan2(Math.sqrt(aLimitado), Math.sqrt(1 - aLimitado))).toFixed(2));
}

export async function calcularDistanciaAteRancho(cepFuncionario) {
    const [coordenadasFuncionario, coordenadasRancho] = await Promise.all([
        buscarCoordenadas(cepFuncionario),
        buscarCoordenadas(CEP_RANCHO)
    ]);

    return calcularDistanciaHaversine(
        coordenadasFuncionario.latitude,
        coordenadasFuncionario.longitude,
        coordenadasRancho.latitude,
        coordenadasRancho.longitude
    );
}