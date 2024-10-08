// Função para verificar se a URL é de uma imagem
function verificarImagem(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);  // Se a imagem carregar, é uma imagem válida
        img.onerror = () => resolve(false);  // Se não carregar, não é uma imagem
        img.src = url;
    });
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

    // Verificar se a URL é uma imagem válida
    if (imagemUrl) {
        const isImage = await verificarImagem(imagemUrl);
        if (isImage) {
            imagemCartao.src = imagemUrl;
            imagemCartao.style.display = 'block';
        } else {
            imagemCartao.style.display = 'none';
            alert('Não é uma imagem');  // Exibir alerta caso a URL não seja de uma imagem
        }
    } else {
        imagemCartao.style.display = 'none';
    }

    // Verificar se deve exibir símbolo do Grêmio ou Internacional
    const time = verificarCorFundo(corFundo);
    if (time === 'gremio') {
        imagemSimbolo.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Gremio_logo.svg/120px-Gremio_logo.svg.png';
        imagemSimbolo.style.display = 'block';
    } else if (time === 'internacional') {
        imagemSimbolo.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Scinternacional1909.png/120px-Scinternacional1909.png';
        imagemSimbolo.style.display = 'block';
    } else {
        imagemSimbolo.style.display = 'none';
    }
}

// Inicializar com o estado padrão
atualizarCartao();

