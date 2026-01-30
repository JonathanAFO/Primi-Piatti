// JSON e DOM
document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = 'marmitas.json';
    let produtosData = []; // dados do JSON
    let carrinho = []; // carrinho global

    // Carregar dados JSON
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao carregar arquivo: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            produtosData = data;
            createElementsFromData(produtosData);
            initModalHandlers();
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));

    // --- Funções principais ---

    function createElementsFromData(data) {
        const container = document.getElementById('produtos-container');
        const modalContainer = document.getElementById('modais-container');
        if (!container || !modalContainer) return console.error("Containers não encontrados.");

        data.forEach(produto => {
            const precoFormatado = produto.preco.toFixed(2).replace('.', ',');

            // Cartão
            container.innerHTML += `
                <a href="#" class="cartao-produto" data-modal-target="modal-${produto.id}" style="display: none;">
                    <div class="imagem-quadrada">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                    </div>
                    <p class="marca">${produto.marca}</p>
                    <p class="nome-produto">${produto.nome}</p>
                    <p class="preco">R$ ${precoFormatado}</p>
                </a>
            `;

            // Modal vazio
            modalContainer.innerHTML += `
                <div id="modal-${produto.id}" class="modal">
                    <div class="modal-content">
                        <span class="close-btn">&times;</span>
                        <div class="modal-body-content"></div>
                    </div>
                </div>
            `;
        });
    }

    function initModalHandlers() {
        const openTriggers = document.querySelectorAll('[data-modal-target]');
        const closeButtons = document.querySelectorAll('.modal .close-btn');

        // abrir modal
        openTriggers.forEach(trigger => {
            trigger.addEventListener('click', e => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                const produtoId = parseInt(modalId.split('-')[1]);
                const produto = produtosData.find(p => p.id === produtoId);
                if (produto && modal) {
                    populateModalContent(modal, produto);
                    modal.classList.add('show');
                }
            });
        });

        // fechar modal
        closeButtons.forEach(btn => btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.classList.remove('show');
        }));

        // fechar ao clicar fora
        window.addEventListener('click', e => {
            if (e.target.classList.contains('modal')) e.target.classList.remove('show');
        });
    }

    function populateModalContent(modal, produto) {
        const body = modal.querySelector('.modal-body-content');
        const ingredientesList = produto.ingredientes.map(ing => `<li>${ing}</li>`).join('');
        const precoFormatado = produto.preco.toFixed(2).replace('.', ',');

        body.innerHTML = `
           
            <img src="${produto.imagem}" alt="${produto.nome}" class="modal-image">
            <div class="modal-titles">
                <h3>${produto.marca}</h3>
                <h1>${produto.nome}</h1>
            </div>
            
            <div class="modal-body">
                <div class="modal-details">
                    <form class="radio-form">
                        <h3>Ingredientes:</h3>
                        <ul style="list-style-type: none;">${ingredientesList}</ul>
                        <h3 style="margin-bottom:15px">Guarnição</h3>
                        <div class="linha-flex">
                            <label class="radio-container">
                                <input type="radio" name="escolha-${produto.id}" value="batata" checked> Batata Frita
                            </label>
                            <label class="radio-container">
                                <input type="radio" name="escolha-${produto.id}" value="farofa"> Farofa
                            </label>
                            <label class="item-separado radio-container">
                                <input type="radio" name="escolha-${produto.id}" value="cenoura"> Cenoura
                            </label>
                        </div>
                        <br>
                        <h3 style="margin-bottom:15px">Talheres</h3>
                        <label class="checkbox-container">
                            <input type="checkbox" name="talheres" value="sim_preciso"> preciso de talheres
                        </label>
                    </form>
                    <br><br>
                    <div class="quantidade-controle">
                        <button class="controle-btn btn-reduzir" disabled>-</button>
                        <span class="display-qtd">0</span>
                        <button class="controle-btn btn-aumentar">+</button>
                    </div>
                    <p class="modal-price">R$ ${precoFormatado}</p>
                </div>
                <button type="button" class="add-to-cart-btn btn btn-danger" onclick="fecharModalProduto()">Adicionar</button>
            </div>
            
            </div>
        `;

        iniciarControleQuantidadeModal(modal);

        const addBtn = modal.querySelector('.add-to-cart-btn');
        addBtn.addEventListener('click', () => {
            const qtd = parseInt(modal.querySelector('.display-qtd').textContent);
            if (qtd <= 0) return;
            adicionarAoCarrinho(produto, qtd);
            closeModal();
        });
    }

    function iniciarControleQuantidadeModal(modal) {
        let quantidade = 0;
        const display = modal.querySelector('.display-qtd');
        const btnAumentar = modal.querySelector('.btn-aumentar');
        const btnReduzir = modal.querySelector('.btn-reduzir');

        function updateDisplay() {
            display.textContent = quantidade;
            btnReduzir.disabled = quantidade <= 0;
        }

        btnAumentar.addEventListener('click', () => { quantidade++; updateDisplay(); });
        btnReduzir.addEventListener('click', () => { if (quantidade > 0) quantidade--; updateDisplay(); });

        updateDisplay();

        // Formatação de telefone
        const inputTelefone = document.getElementById('telefoneCliente');
        if (inputTelefone) {
            inputTelefone.addEventListener('input', e => {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            });
        }
    }

    // --- Funções externas ---
    window.obterLocalizacao = function () {
        const status = document.getElementById('statusLocalizacao');
        const inputEndereco = document.getElementById('enderecoManual');

        if (!navigator.geolocation) return status.innerHTML = "Geolocalização não suportada.";

        status.innerHTML = "Buscando coordenadas...";
        navigator.geolocation.getCurrentPosition(async pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            status.innerHTML = "Convertendo para endereço...";
            try {
                const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await resp.json();
                if (data.address) {
                    const rua = data.address.road || "";
                    const numero = data.address.house_number || "S/N";
                    const bairro = data.address.suburb || data.address.neighbourhood || "";
                    const cidade = data.address.city || data.address.town || "";
                    inputEndereco.value = `${rua}, ${numero} - ${bairro}, ${cidade}`;
                    status.innerHTML = "Endereço preenchido!";
                    status.style.color = "green";
                } else {
                    status.innerHTML = "Endereço não encontrado, digite manualmente.";
                }
            } catch (err) {
                console.error(err);
                status.innerHTML = "Erro ao buscar endereço. Digite manualmente.";
                inputEndereco.value = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
            }
        }, err => {
            status.innerHTML = "Erro: " + err.message;
            status.style.color = "red";
        });
    }

    window.goToCart = function () {
        const modal = document.getElementById('modalSacolaMobile');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    window.closeMobileCart = function () {
        const modal = document.getElementById('modalSacolaMobile');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }



    window.adicionarAoCarrinho = function (produto, quantidade) {
        const existente = carrinho.find(i => i.id === produto.id);
        if (existente) existente.quantidade += quantidade;
        else carrinho.push({ ...produto, quantidade });

        atualizarCarrinho();
    }

    window.atualizarCarrinho = function () {
        const containers = document.querySelectorAll('.sacola-itens');
        const totalEl = document.getElementById('total-sacola');
        const contador = document.getElementById('cartCount');
        const vazio = document.querySelector('.sacola-vazia');

        containers.forEach(c => c.innerHTML = '');

        let total = 0;

        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;

            const html = `
                <div class="item-sacola">
                    <div class="item-info">
                        <span class="item-nome">${item.nome}</span>
                        <span class="item-quantidade">Qtd: ${item.quantidade}</span>
                    </div>
    
                    <div class="item-valores">
                        <span class="item-preco">R$ ${item.preco.toFixed(2)}</span>
                        <span class="item-subtotal">R$ ${subtotal.toFixed(2)}</span>
                    </div>
                </div>
            `;

            containers.forEach(c => c.insertAdjacentHTML('beforeend', html));
            total += subtotal;
        });

        if (totalEl) totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
        if (contador) contador.textContent = carrinho.reduce((s, i) => s + i.quantidade, 0);
        if (vazio) vazio.style.display = carrinho.length ? 'none' : 'block';
    }


    window.openModal = function () {
        const modal = document.getElementById('modalSacolaMobile');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    window.closeModal = function () {
        const modal = document.getElementById('modalSacolaMobile');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

function fecharModalProduto() {
    document.getElementById('produtoModal').classList.remove('active');
}