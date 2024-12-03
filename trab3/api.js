
export async function fetchPixParticipants() {
    try {
        const response = await fetch('https://brasilapi.com.br/api/pix/v1/participants');
        if (!response.ok) throw new Error('Erro ao consultar participantes do PIX.');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
}

export async function fetchFipeBrands(type) {
    try {
        const response = await fetch(`https://brasilapi.com.br/api/fipe/marcas/v1/${type}`);
        if (!response.ok) throw new Error('Erro ao consultar marcas FIPE.');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
}

export async function fetchFipePrice(code) {
    try {
        const response = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${code}`);
        if (!response.ok) throw new Error('Erro ao consultar preço FIPE.');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
}

