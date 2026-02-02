// JSON e DOM
document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = 'marmitas.json';
    let produtosData = [];
    let carrinho = [];

    // ================== LOAD JSON ==================
    fetch(jsonUrl)
        .then(r => r.json())
        .then(data => {
            produtosData = data;
            createElementsFromData(produtosData);
            initModalHandlers();
            injectModalStyles();
        });

    // ================== FILTRO CATEGORIAS ==================
    document.querySelectorAll('.item-categoria').forEach(cat => {
        cat.addEventListener('click', e => {
            e.preventDefault();
            const categoria = cat.dataset.categoria;

            document.querySelectorAll('.cartao-produto').forEach(prod => {
                prod.style.display =
                    !categoria || prod.dataset.categoria === categoria
                        ? 'block'
                        : 'none';
            });

            document.getElementById('produtos-container')
                ?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ================== CRIA PRODUTOS E MODAIS ==================
    function createElementsFromData(data) {
        const container = document.getElementById('produtos-container');
        const modalContainer = document.getElementById('modais-container');

        data.forEach(produto => {
            const preco = produto.preco.toFixed(2).replace('.', ',');

            container.insertAdjacentHTML('beforeend', `
                <a href="#" class="cartao-produto" data-categoria="${produto.categoria}"
                   data-modal-target="modal-${produto.id}" style="display:none">
                    <div class="imagem-quadrada">
                        <img src="${produto.imagem}">
                    </div>
                    <p class="marca">${produto.marca}</p>
                    <p class="nome-produto">${produto.nome}</p>
                    <p class="preco">R$ ${preco}</p>
                </a>
            `);

            modalContainer.insertAdjacentHTML('beforeend', `
                <div id="modal-${produto.id}" class="modal">
                    <div class="modal-content">
                        <span class="close-btn">&times;</span>
                        <div class="modal-body-content"></div>
                    </div>
                </div>
            `);
        });
    }

    // ================== MODAL HANDLERS ==================
    function initModalHandlers() {
        document.addEventListener('click', e => {
            const trigger = e.target.closest('[data-modal-target]');
            if (!trigger) return;

            e.preventDefault();
            const modalId = trigger.dataset.modalTarget;
            const produtoId = +modalId.split('-')[1];
            const produto = produtosData.find(p => p.id === produtoId);
            const modal = document.getElementById(modalId);

            populateModalContent(modal, produto);
            modal.classList.add('show');
        });

        document.addEventListener('click', e => {
            if (e.target.classList.contains('close-btn') ||
                e.target.classList.contains('modal')) {
                e.target.closest('.modal')?.classList.remove('show');
            }
        });
    }

    // ================== POPULATE MODAL ==================
    function populateModalContent(modal, produto) {
        const body = modal.querySelector('.modal-body-content');
        const preco = produto.preco.toFixed(2).replace('.', ',');
    
        let quantidade = 0;
    
        // lista de ingredientes (vem do JSON)
        const ingredientesHTML = produto.ingredientes && produto.ingredientes.length
            ? produto.ingredientes.map(i => `<li>${i}</li>`).join('')
            : '<li>Informação não disponível</li>';
    
        body.innerHTML = `
            <div class="modal-produto">
    
                <img src="${produto.imagem}" class="modal-header-img">
    
                <div class="modal-content-inner">
    
                    <h3 class="modal-marca">${produto.marca}</h3>
                    <h1 class="modal-nome">${produto.nome}</h1>
    
                    <!-- INGREDIENTES -->
                    <div class="ingredientes-box">
                        <h4>Ingredientes</h4>
                        <ul class="ingredientes-list">
                            ${ingredientesHTML}
                        </ul>
                    </div>
    
                    <!-- GUARNIÇÃO -->
                    <h4>Guarnição</h4>
                    <div class="linha-flex">
                        <label><input type="radio" name="guarnicao" checked> Batata</label>
                        <label><input type="radio" name="guarnicao"> Farofa</label>
                        <label><input type="radio" name="guarnicao"> Cenoura</label>
                    </div>
    
                    <!-- TALHERES -->
                    <label class="checkbox">
                        <input type="checkbox"> Preciso de talheres
                    </label>
    
                    <!-- QUANTIDADE -->
                    <div class="quantidade-controle">
                        <button class="menos" disabled>-</button>
                        <span class="qtd">0</span>
                        <button class="mais">+</button>
                    </div>
    
                    <!-- PREÇO -->
                    <p class="modal-price">R$ ${preco}</p>
    
                    <!-- BOTÃO -->
                    <button class="add-to-cart">
                        Adicionar ao pedido
                    </button>
    
                </div>
            </div>
        `;
    
        const menos = body.querySelector('.menos');
        const mais = body.querySelector('.mais');
        const qtdEl = body.querySelector('.qtd');
    
        mais.onclick = () => {
            quantidade++;
            qtdEl.textContent = quantidade;
            menos.disabled = false;
        };
    
        menos.onclick = () => {
            if (quantidade > 0) quantidade--;
            qtdEl.textContent = quantidade;
            menos.disabled = quantidade === 0;
        };
    
        body.querySelector('.add-to-cart').onclick = () => {
            if (quantidade === 0) {
                alert('Selecione a quantidade');
                return;
            }
    
            adicionarAoCarrinho(produto, quantidade);
            showToast('Pedido adicionado!');
            modal.classList.remove('show');
        };
    }
    

    // ================== CARRINHO ==================
    window.adicionarAoCarrinho = function (produto, quantidade) {
        const item = carrinho.find(i => i.id === produto.id);
        item ? item.quantidade += quantidade : carrinho.push({ ...produto, quantidade });
        atualizarCarrinho();
    };

    window.atualizarCarrinho = function () {
        document.querySelectorAll('.sacola-itens').forEach(c => c.innerHTML = '');
        let total = 0;

        carrinho.forEach(item => {
            const sub = item.preco * item.quantidade;
            total += sub;

            document.querySelectorAll('.sacola-itens').forEach(c =>
                c.insertAdjacentHTML('beforeend', `
                    <div class="item-sacola">
                        <span>${item.nome} x${item.quantidade}</span>
                        <span>R$ ${sub.toFixed(2)}</span>
                    </div>
                `)
            );
        });

        document.getElementById('total-sacola').textContent = `Total: R$ ${total.toFixed(2)}`;
        document.getElementById('cartCount').textContent =
            carrinho.reduce((s, i) => s + i.quantidade, 0);
    };

    // ================== TOAST ==================
    function showToast(texto) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = texto;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2000);
    }

    // ================== STYLES ==================
    function injectModalStyles() {
        if (document.getElementById('modal-style')) return;
    
        const style = document.createElement('style');
        style.id = 'modal-style';
    
        style.innerHTML = `
        /* ===== MODAL BASE ===== */
        .modal {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
    
        .modal.show {
            display: flex;
        }
    
        .modal-content {
            background: #fff;
            width: 95%;
            max-width: 420px;
            max-height: 90vh;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            animation: slideUp .3s ease;
        }
    
        @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    
        .close-btn {
            position: absolute;
            top: 10px;
            right: 14px;
            font-size: 26px;
            cursor: pointer;
            z-index: 10;
        }
    
        /* ===== CONTEÚDO ===== */
        .modal-produto {
            display: flex;
            flex-direction: column;
        }
    
        .modal-header-img {
            width: 100%;
            height: 220px;
            object-fit: cover;
        }
    
        .modal-content-inner {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    
        .modal-content-inner h3 {
            font-size: 14px;
            color: #777;
            margin: 0;
        }
    
        .modal-content-inner h1 {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
            line-height: 1.2;
        }
    
        /* ===== OPÇÕES ===== */
        .linha-flex {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
    
        .linha-flex label {
            background: #f4f4f4;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
        }
    
        .linha-flex input {
            margin-right: 6px;
        }
    
        .checkbox {
            font-size: 14px;
        }
    
        /* ===== QUANTIDADE ===== */
        .quantidade-controle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            margin: 10px 0;
        }
    
        .quantidade-controle button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            font-size: 20px;
            cursor: pointer;
            background: #eee;
        }
    
        .quantidade-controle span {
            font-size: 18px;
            font-weight: 600;
            min-width: 24px;
            text-align: center;
        }
    
        /* ===== PREÇO ===== */
        .modal-price {
            font-size: 22px;
            font-weight: 700;
            color: #e63946;
            text-align: center;
        }
    
        /* ===== BOTÃO ===== */
        .add-to-cart {
            margin-top: 8px;
            background: #e63946;
            color: #fff;
            border: none;
            padding: 14px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: background .2s;
        }
    
        .add-to-cart:hover {
            background: #c92f3b;
        }
    
        /* ===== TOAST ===== */
        .toast {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: #fff;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2s ease;
        }
    
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, 20px); }
            20% { opacity: 1; transform: translate(-50%, 0); }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
        `;
    
        document.head.appendChild(style);
    }
    
});


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