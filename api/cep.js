// =============================================
// CEP → ENDEREÇO (ViaCEP - Gratuita, sem chave)
// =============================================

async function buscarEnderecoPorCep(cep) {
    // Remove traços e espaços do CEP
    const cepLimpo = String(cep ?? '').replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        throw new Error('CEP inválido. Deve conter 8 dígitos.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let data;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`ViaCEP indisponivel (HTTP ${response.status}). Tente novamente mais tarde.`);
        }

        data = await response.json();
    } catch (error) {
        if (controller.signal.aborted) {
            throw new Error('O ViaCEP demorou para responder. Tente novamente.');
        }
        if (error instanceof TypeError) {
            throw new Error('Nao foi possivel conectar ao ViaCEP. Verifique sua conexao e tente novamente.');
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }

    if (data.erro) {
        throw new Error('CEP não encontrado.');
    }

    return {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        ibge: data.ibge,
        enderecoCompleto: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
    };
}

// =============================================
// GEOCODIFICAÇÃO: CEP → Coordenadas
// Fluxo: CEP → ViaCEP (endereço real) → Nominatim (coords)
// Tenta 4 estratégias em cascata para máxima precisão
// =============================================

async function buscarCoordenadasPorEndereco(enderecoCompleto, cidade, estado, cep, enderecoConsultado) {

    // Se tiver CEP, busca o endereço real no ViaCEP primeiro
    // para garantir que temos logradouro + bairro + cidade corretos
    if (cep) {
        try {
            const endereco = enderecoConsultado || await buscarEnderecoPorCep(cep);
            const dados = { ...endereco, localidade: endereco.cidade, uf: endereco.estado };

            if (!dados.erro) {
                cidade = dados.localidade;
                estado = dados.uf;
                const bairro = dados.bairro;
                const logradouro = dados.logradouro;

                // Estratégia 1: logradouro + bairro + cidade (mais preciso)
                if (logradouro && bairro) {
                    const r = await _nominatimQuery(`${logradouro}, ${bairro}, ${cidade}, ${estado}, Brasil`);
                    if (r) { console.info(`📍 Coords via logradouro: ${r.latitude}, ${r.longitude}`); return r; }
                }

                // Estratégia 2: bairro + cidade
                if (bairro) {
                    const r = await _nominatimQuery(`${bairro}, ${cidade}, ${estado}, Brasil`);
                    if (r) { console.info(`📍 Coords via bairro: ${r.latitude}, ${r.longitude}`); return r; }
                }

                // Estratégia 3: só cidade + estado (sempre funciona)
                const r = await _nominatimQuery(`${cidade}, ${estado}, Brasil`);
                if (r) { console.info(`📍 Coords via cidade: ${r.latitude}, ${r.longitude}`); return r; }
            }
        } catch (_) {}
    }

    // Estratégia 4: endereço completo passado diretamente
    if (enderecoCompleto) {
        const r = await _nominatimQuery(`${enderecoCompleto}, Brasil`);
        if (r) return r;
    }

    // Estratégia 5: cidade + estado passados diretamente
    if (cidade && estado) {
        const r = await _nominatimQuery(`${cidade}, ${estado}, Brasil`);
        if (r) return r;
    }

    throw new Error('Endereço não encontrado no mapa.');
}

async function _nominatimQuery(query) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br&email=rancho@rancho.com`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        if (!data || data.length === 0) return null;
        return {
            latitude:  parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon)
        };
    } catch (_) {
        return null;
    }
}

// =============================================
// FUNÇÃO PRINCIPAL: CEP → Endereço + Coordenadas
// =============================================

async function obterEnderecoCompleto(cep) {
    const endereco = await buscarEnderecoPorCep(cep);
    const coordenadas = await buscarCoordenadasPorEndereco(
        endereco.enderecoCompleto,
        endereco.cidade,
        endereco.estado,
        cep,
        endereco
    );

    return {
        ...endereco,
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude
    };
}

// Exporta para uso em módulos Node.js
if (typeof module !== 'undefined') {
    module.exports = { buscarEnderecoPorCep, buscarCoordenadasPorEndereco, obterEnderecoCompleto };
}
