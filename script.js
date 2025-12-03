/**
 * Configura a rolagem horizontal suave e os botões de navegação
 * para um contêiner específico.
 * * @param {string} listId O ID do elemento que contém os itens e será rolado.
 */
function setupHorizontalScroll(listId) {
    // 1. Encontra os elementos
    const lista = document.getElementById(listId);

    // Se a lista não for encontrada, sai da função.
    if (!lista) {
        console.error(`Elemento com ID '${listId}' não encontrado.`);
        return;
    }

    // O wrapper é o pai imediato da lista (onde estão os botões)
    const wrapper = lista.parentElement;

    // Assume que os botões têm as classes 'prev-btn' e 'next-btn' e estão no wrapper
    const prevBtn = wrapper.querySelector('.prev-btn');
    const nextBtn = wrapper.querySelector('.next-btn');

    const scrollAmount = 400; // Quantidade de pixels a rolar por clique

    // 2. Lógica de Rolagem
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            lista.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            lista.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // 3. Lógica de Visibilidade dos Botões
    const checkScroll = () => {
        // Verifica se a largura total do conteúdo é maior que a largura visível
        const canScroll = lista.scrollWidth > lista.clientWidth;

        // Se não houver rolagem possível, oculta ambos os botões (se existirem)
        if (!canScroll) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        const isStart = lista.scrollLeft < 10; // Quase no início
        const isEnd = lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - 10; // Quase no fim (com margem de 10px)

        // Alterna a visibilidade
        if (prevBtn) prevBtn.style.display = isStart ? 'none' : 'block';
        if (nextBtn) nextBtn.style.display = isEnd ? 'none' : 'block';
    };

    // 4. Ativação dos Eventos
    lista.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    // Inicializa a verificação para definir o estado inicial dos botões
    checkScroll();
}

// --- CHAMADAS DA FUNÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Marmitas (usando o ID 'listaMarmitas')
    setupHorizontalScroll('listaMarmitas');

    // 2. Menu Especiais do Dia (usando o ID 'listaEspeciais')
    setupHorizontalScroll('listaEspeciais');


    setupHorizontalScroll('listaMarmitas2');
    setupHorizontalScroll('listaMarmitas3');
    setupHorizontalScroll('listaMarmitas4');
    setupHorizontalScroll('listaMarmitas5');

    // 2. Menu Especiais do Dia (usando o ID 'listaEspeciais')
    setupHorizontalScroll('listaEspeciais2');

    // 3. Outro Menu (se você tiver)
    // setupHorizontalScroll('outroMenuId');
});



// Modal do produto
function abrirModalProduto(id, nome, valor, descricao, imagemURL) {
    // 1. Preenche os elementos do modal com os dados
    document.getElementById('modal-nome').innerText = nome;
    document.getElementById('modal-valor').innerText = valor;
    document.getElementById('modal-descricao').innerText = descricao;

    // 2. Define a imagem do produto
    const imgElement = document.getElementById('modal-imagem');
    imgElement.src = imagemURL;
    imgElement.alt = "Imagem da " + nome;

    // 3. Define os links de compra e detalhes (usando o ID do produto)
    document.getElementById('modal-link-compra').href = "/carrinho/adicionar/" + id;
    document.getElementById('modal-link-completo').href = "/produto/detalhes/" + id;

    // 4. Mostra o modal
    document.getElementById('quick-view-modal').style.display = 'block';
}

// Opcional: Fechar o modal ao clicar fora dele
window.onclick = function (event) {
    const modal = document.getElementById('quick-view-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}