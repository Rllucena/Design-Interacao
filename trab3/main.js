import { loadCountries, displayCountryInfo } from './countries.js';
import { fetchPixParticipants, fetchFipeBrands, fetchFipePrice } from './api.js';

// Carregar países ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    await loadCountries();
});

// Evento para mostrar informações do país selecionado
document.getElementById('country-select').addEventListener('change', (event) => {
    displayCountryInfo(event.target.value);
});



// PIX Section

document.getElementById('pix-button').addEventListener('click', async () => {
    const resultDiv = document.getElementById('pix-result');
    const hideButton = document.getElementById('hide-pix-button'); // Certifique-se de que o botão exista
    resultDiv.innerHTML = ''; // Limpar resultados anteriores

    try {
        const participants = await fetchPixParticipants();
        participants.forEach(({ nome }) => {
            const p = document.createElement('p');
            p.textContent = nome;
            resultDiv.appendChild(p);
        });
        resultDiv.classList.remove('hidden');
        hideButton.classList.remove('hidden'); // Tornar o botão visível
    } catch (error) {
        resultDiv.innerHTML = `<p>Erro: ${error.message}</p>`;
        resultDiv.classList.remove('hidden');
    }
});

// Lógica para esconder resultados do PIX
document.getElementById('hide-pix-button').addEventListener('click', () => {
    const resultDiv = document.getElementById('pix-result');
    const hideButton = document.getElementById('hide-pix-button');
    resultDiv.classList.add('hidden');
    hideButton.classList.add('hidden');
});




// FIPE Section
document.getElementById('fipe-type').addEventListener('change', async (event) => {
    const type = event.target.value;
    const brandsContainer = document.getElementById('fipe-brands-container');
    const brandsDiv = document.getElementById('fipe-brands');
    brandsDiv.innerHTML = ''; // Limpar opções anteriores

    try {
        const brands = await fetchFipeBrands(type);
        brands.forEach(({ nome }) => {
            const p = document.createElement('p');
            p.textContent = nome;
            brandsDiv.appendChild(p);
        });
        brandsContainer.classList.remove('hidden');
    } catch (error) {
        alert(`Erro ao carregar marcas: ${error.message}`);
    }
});



document.getElementById('fipe-code-button').addEventListener('click', async () => {
    const code = document.getElementById('fipe-code').value.trim();
    const resultDiv = document.getElementById('fipe-result');
    resultDiv.innerHTML = ''; // Limpar resultados anteriores

    if (!code) {
        resultDiv.innerHTML = `<p>Por favor, insira um código FIPE válido.</p>`;
        return;
    }

    try {
        const response = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${code}`);
        if (!response.ok) {
            throw new Error('Erro na consulta à API. Verifique o código FIPE.');
        }
        const data = await response.json();

        if (data.length === 0) {
            resultDiv.innerHTML = `<p>Nenhum resultado encontrado para o código FIPE ${code}.</p>`;
            return;
        }

        // Exibir cada resultado de forma detalhada
        data.forEach((car, index) => {
            const carDetails = document.createElement('div');
            carDetails.style.border = '1px solid #ccc';
            carDetails.style.margin = '10px 0';
            carDetails.style.padding = '10px';

            carDetails.innerHTML = `
                <p><strong>Resultado ${index + 1}</strong></p>
                <p>Valor: ${car.valor}</p>
                <p>Marca: ${car.marca}</p>
                <p>Modelo: ${car.modelo}</p>
                <p>Ano Modelo: ${car.anoModelo}</p>
                <p>Combustível: ${car.combustivel}</p>
                <p>Código FIPE: ${car.codigoFipe}</p>
                <p>Mês de Referência: ${car.mesReferencia}</p>
                <p>Tipo de Veículo: ${car.tipoVeiculo}</p>
                <p>Sigla do Combustível: ${car.siglaCombustivel}</p>
                <p>Data da Consulta: ${car.dataConsulta}</p>
            `;
            resultDiv.appendChild(carDetails);
        });
    } catch (error) {
        resultDiv.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
});


