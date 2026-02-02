// JSON

document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = 'marmitas.json';
    let produtosData = []; // Variável para armazenar os dados do JSON globalmente

    // VARIÁVEIS GLOBAIS (adicione no topo do seu arquivo JS)
    let carrinho = []; // Array para armazenar os produtos no carrinho






    // Função Principal para carregar os dados
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            produtosData = data; // Salva os dados para uso posterior

            // Cria os cartões (gatilhos) e os modais na página
            createElementsFromData(produtosData);

            // Inicializa a lógica de abrir/fechar modais após a criação dos elementos
            initModalHandlers();
        })
        .catch(error => {
            console.error('Houve um erro ao carregar os dados:', error);
        });

    // --- Funções de Manipulação do DOM e Modal ---

    /**
     * Função para criar a estrutura HTML dos cartões e dos modais.
     */
    function createElementsFromData(data) {
        const container = document.getElementById('produtos-container');
        const modalContainer = document.getElementById('modais-container'); // Onde os modais serão injetados

        // Certifique-se de que os containers existem no seu HTML!
        if (!container || !modalContainer) {
            console.error("Containers 'produtos-container' ou 'modais-container' não encontrados.");
            return;
        }

        data.forEach(produto => {
            // 1. Criação do Cartão (Gatilho)
            const precoFormatado = produto.preco.toFixed(2).replace('.', ',');
            const cardHTML = `
            
                <a href="#" class="cartao-produto" data-modal-target="modal-${produto.id}" style="display: none;">
                    <div class="imagem-quadrada">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                    </div>
                    <p class="marca">${produto.marca}</p>
                    <p class="nome-produto">${produto.nome}</p>
                    <p class="preco">R$ ${precoFormatado}</p>
                </a>
            
            `;
            container.innerHTML += cardHTML;

            // 2. Criação da Estrutura Vazia do Modal
            // O conteúdo será preenchido no clique. O modal precisa do ID correto.
            const modalHTML = `
                <div id="modal-${produto.id}" class="modal">
                    <div class="modal-content">
                        <span class="close-btn">&times;</span>
                        <div class="modal-body-content">
                            </div>
                    </div>
                </div>
            `;
            modalContainer.innerHTML += modalHTML;
        });
    }

    /**
     * Função que configura os ouvintes de evento para os modais.
     */
    function initModalHandlers() {
        const openModalTriggers = document.querySelectorAll('[data-modal-target]');
        const closeModalButtons = document.querySelectorAll('.modal .close-btn');

        // A. Abre o modal e POPULA seu conteúdo
        openModalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault();

                const modalId = trigger.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);

                // **PASSO NOVO E CRUCIAL:** Obter e Injetar o Conteúdo
                // Pega o ID numérico do produto (ex: de "modal-1" pega "1")
                const produtoId = parseInt(modalId.split('-')[1]);
                const produto = produtosData.find(p => p.id === produtoId);

                if (produto && modal) {
                    populateModalContent(modal, produto); // Chama a função para preencher
                    modal.classList.add('show');
                }
            });
        });

        // B. Fecha o modal (lógica de fechar permanece a mesma)
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                modal.classList.remove('show');
            });
        });

        // C. Fecha ao clicar fora
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('show');
            }
        });
    }

    /**
     * Função para preencher o conteúdo do modal com os dados do produto.
     * @param {HTMLElement} modal - O elemento modal a ser populado.
     * @param {Object} produto - O objeto de dados do JSON.
     */
    function populateModalContent(modal, produto) {
        const bodyContent = modal.querySelector('.modal-body-content');

        // Formata a lista de ingredientes
        const ingredientesList = produto.ingredientes.map(ing => `<li>${ing}</li>`).join('');
        const precoFormatado = produto.preco.toFixed(2).replace('.', ',');

        bodyContent.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" class="modal-image">
        
        <div class="modal-titles">
            <h3>${produto.marca}</h3>
            <h1>${produto.nome}</h1>
            
        </div>
        <div class="modal-body">
            <div class="modal-details">
                
                <form class="radio-form">
                    <h3 style="">Ingredientes:</h3>
                    
                    <ul style="list-style-type: none;">${ingredientesList}</ul>
                    <h3 style="margin-bottom:15px">Guarnição</h3>
                    
                    <div class="linha-flex">
                        <label class="radio-container">
                        <input type="radio" name="escolha" value="opcao_a" checked>
                            Batata Frita
                        </label>
        
                        <label class="radio-container">
                            <input type="radio" name="escolha" value="opcao_b">
                            Farofa
                        </label>

                        <label class="item-separado radio-container">
                            <input type="radio" name="escolha" value="opcao_c">
                            Cenoura
                        </label>
                    </div>
                
                    
                    <br>
                    <h3 style="margin-bottom:15px">Talheres</h3>
                    
                    <label for="talheres_checkbox" class="checkbox-container">
                    <input type="checkbox" id="talheres_checkbox" name="talheres" value="sim_preciso">
                        preciso de talheres
                    </label>
                </form>
                <br>
                <br>

                <div class="quantidade-controle">
                    <button id="btnReduzir" class="controle-btn" disabled>-</button>
                    
                    <span id="quantidade" class="display-qtd">0</span>
                    
                    <button id="btnAumentar" class="controle-btn">+</button>
                </div>

                <p class="modal-price">R$ ${precoFormatado}</p>
            </div>
                <button type="button" class="add-to-cart-btn btn btn-danger" data-product-id="${produto.id}" >Adicionar</button>
            </div>
    `;
        iniciarControleQuantidadeModal(modal);
    }

    /**
     * NOVO CÓDIGO: Função para inicializar o controle de quantidade do modal.
     * @param {HTMLElement} modal - O elemento modal recém-preenchido.
     */

    function iniciarControleQuantidadeModal(modal) {
        // Definimos a quantidade DENTRO do escopo da função, assim cada modal
        // terá seu próprio contador, começando em 0.
        let quantidadeMarmitas = 0;

        // Usamos 'modal.querySelector' para garantir que estamos pegando os
        // botões DENTRO deste modal específico.
        const display = modal.querySelector('#quantidade');
        const btnAumentar = modal.querySelector('#btnAumentar');
        const btnReduzir = modal.querySelector('#btnReduzir');

        // Função central para atualizar o display e o estado do botão
        function updateControle() {
            if (!display || !btnReduzir) return; // Proteção, caso não encontre

            display.textContent = quantidadeMarmitas;

            // Lógica: Desabilita se for <= 0, habilita se for > 0
            btnReduzir.disabled = (quantidadeMarmitas <= 0);
        }

        // Lógica para o botão de AUMENTAR
        btnAumentar.addEventListener('click', () => {
            quantidadeMarmitas++;
            updateControle();
        });

        // Lógica para o botão de REDUZIR
        btnReduzir.addEventListener('click', () => {
            if (quantidadeMarmitas > 0) {
                quantidadeMarmitas--;
                updateControle();
            }
        });

        // Formata o telefone automaticamente: (00) 00000-0000
        const inputTelefone = document.getElementById('telefoneCliente');
        inputTelefone.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });

        const nomePedido = document.getElementById('nomeCliente').value;
        const telefonePedido = document.getElementById('telefoneCliente').value;
        const enderecoPedido = document.getElementById('enderecoManual').value;


        // Aqui e para montar a msg do whatsapp com um else

        // Inicialização: Garante que o display e o estado do botão estejam corretos ao abrir o modal
        updateControle();
    }

});





//função de localização
function obterLocalizacao() {
    const status = document.getElementById('statusLocalizacao');
    const inputEndereco = document.getElementById('enderecoManual');

    if (!navigator.geolocation) {
        status.innerHTML = "Geolocalização não suportada.";
        return;
    }

    status.innerHTML = "Buscando coordenadas...";

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        status.innerHTML = "Convertendo para endereço...";

        try {
            // Chamada para a API gratuita do OpenStreetMap
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();

            if (data.address) {
                const rua = data.address.road || "";
                const numero = data.address.house_number || "S/N";
                const bairro = data.address.suburb || data.address.neighbourhood || "";
                const cidade = data.address.city || data.address.town || "";

                // Monta a string bonitinha para o usuário
                const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade}`;

                inputEndereco.value = enderecoCompleto;
                status.innerHTML = "Endereço preenchido!";
                status.style.color = "green";
            } else {
                status.innerHTML = "Endereço não encontrado, digite manualmente.";
            }
        } catch (error) {
            console.error(error);
            status.innerHTML = "Erro ao buscar endereço. Digite manualmente.";
            inputEndereco.value = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
        }
    }, (error) => {
        status.innerHTML = "Erro: " + error.message;
        status.style.color = "red";
    });
}






