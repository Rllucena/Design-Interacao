// Captura dos elementos
const cartao = document.getElementById('cartao');
const tituloCartao = document.getElementById('titulo-cartao');
const textoCartao = document.getElementById('texto-cartao');
const imagemCartao = document.getElementById('imagem-cartao');
const imagemSimbolo = document.getElementById('imagem-simbolo');

// Função para verificar se a URL é de uma imagem
function verificarImagem(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);  // Se a imagem carregar, é uma imagem válida
        img.onerror = () => resolve(false);  // Se não carregar, não é uma imagem
        img.src = url;
    });
}

// Função para verificar se a cor é azul ou vermelha
function verificarCorFundo(cor) {
    const rgb = parseInt(cor.slice(1), 16); // Converte a cor HEX para RGB
    const r = (rgb >> 16) & 0xff;  // Valor vermelho
    const g = (rgb >> 8) & 0xff;   // Valor verde
    const b = rgb & 0xff;          // Valor azul

    // Verifica se é um tom de azul (onde o valor de B é o maior comparado ao R e G)
    if (b > r && b > g) {
        return 'gremio';
    }

    // Verifica se é um tom de vermelho (onde o valor de R é o maior comparado ao G e B)
    if (r > g && r > b) {
        return 'internacional';
    }

    // Verifica se é um tom de verde (onde o valor de G é o maior comparado ao R e B)
    if (g > r && g > b) {
        return 'RioGrande';
    }
    return '';
}

// Função para atualizar os estilos do cartão
async function atualizarCartao() {
    const corFundo = document.getElementById('fundo-cor').value;
    const bordaEstilo = document.getElementById('borda-estilo').value;
    const tamanhoTexto = document.getElementById('tamanho-texto').value;
    const tamanhoTitulo = document.getElementById('tamanho-titulo').value;
    const tamanhoImagem = document.getElementById('tamanho-imagem').value;
    const novoTitulo = document.getElementById('texto-titulo').value;
    const novoTexto = document.getElementById('texto-cartao-input').value;
    const imagemUrl = document.getElementById('imagem-url').value;

    // Atualizar cor de fundo e borda do cartão
    cartao.style.backgroundColor = corFundo;
    cartao.style.borderStyle = bordaEstilo;

    // Atualizar o tamanho do texto e do título do cartão
    textoCartao.style.fontSize = `${tamanhoTexto}px`;
    tituloCartao.style.fontSize = `${tamanhoTitulo}px`;

    // Atualizar o tamanho da imagem
    imagemCartao.style.width = `${tamanhoImagem}px`;
    imagemCartao.style.height = `${tamanhoImagem}px`;

    // Atualizar o título e o texto do cartão
    tituloCartao.textContent = novoTitulo;
    textoCartao.textContent = novoTexto;

    // Inserir a imagem no cartão, se a URL for válida
    // Verificar se a URL é uma imagem válida
    if (imagemUrl) {
        const isImage = await verificarImagem(imagemUrl);
        if (isImage) {
            imagemCartao.src = imagemUrl;
            imagemCartao.style.display = 'block';
        } else {
            imagemCartao.src = 'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png';  // Exibir um image not found no lugar da imagem
        }
    }
   
    // Verificar se deve exibir símbolo do Grêmio ou Internacional
    const time = verificarCorFundo(corFundo);
    if (time === 'gremio') {
        imagemSimbolo.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Gremio_logo.svg/120px-Gremio_logo.svg.png';
        imagemSimbolo.style.display = 'block';
    } else if (time === 'internacional') {
        imagemSimbolo.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Scinternacional1909.png/120px-Scinternacional1909.png';
        imagemSimbolo.style.display = 'block';
    } else if (time === 'RioGrande') {
        imagemSimbolo.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/S.C._Rio_Grande.png/1024px-S.C._Rio_Grande.png';
        imagemSimbolo.style.display = 'block';
    } else {
        imagemSimbolo.style.display = 'none';
    }
}

// Função para resetar os controles
function resetarControles() {
    document.getElementById('fundo-cor').value = '#ffffff';
    document.getElementById('borda-estilo').value = 'solid';
    document.getElementById('tamanho-texto').value = 16;
    document.getElementById('tamanho-titulo').value = 24;
    document.getElementById('tamanho-imagem').value = 100;
    document.getElementById('texto-titulo').value = 'Título do Cartão';
    document.getElementById('texto-cartao-input').value = 'Texto do cartão';
    document.getElementById('imagem-url').value = '';

    atualizarCartao();
}

// Atualizar o cartão sempre que houver mudança nos inputs
document.querySelectorAll('#controles input, #controles select').forEach((input) => {
    input.addEventListener('input', atualizarCartao);
});

// Inicializar com o estado padrão
atualizarCartao();
