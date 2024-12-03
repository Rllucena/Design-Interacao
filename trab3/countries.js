export async function loadCountries() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Rllucena/Design-Interacao/main/trab3/paises.json');
        if (!response.ok) throw new Error('Erro ao carregar os países.');

        const countries = await response.json();
        const select = document.getElementById('country-select');

        //**map, filter ou reduce**
        countries.forEach((country) => {
            const option = document.createElement('option');
            option.value = country.sigla;
            option.textContent = country.nome_pais;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro:', error.message);
        alert('Não foi possível carregar os países. Tente novamente mais tarde.');
    }
}

export function displayCountryInfo(sigla) {
    fetch('https://raw.githubusercontent.com/Rllucena/Design-Interacao/main/trab3/paises.json')
        .then((response) => response.json())
        .then((countries) => {
            const country = countries.find((c) => c.sigla === sigla);
            const infoDiv = document.getElementById('country-info');
            infoDiv.innerHTML = `
                <p><strong>País:</strong> ${country.nome_pais}</p>
                <p><strong>Gentílico:</strong> ${country.gentilico}</p>
                <p><strong>Nome Internacional:</strong> ${country.nome_pais_int}</p>
                <p><strong>Sigla:</strong> ${country.sigla}</p>
            `;
        })
        .catch((error) => {
            console.error('Erro:', error.message);
            alert('Erro ao buscar informações do país.');
        });
}
