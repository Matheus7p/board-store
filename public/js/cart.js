/* Manipulando o Carrinho */
const cart = document.getElementById('cartContainer');

/* Exibindo Jogos no Carrinho */
async function loadCart() {
    const userId = 1;

    try {
        const response = await fetch('/cart/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            const board = await response.json();
            cart.innerHTML = '';

            if (board.length == 0) {
                const message = document.createElement('div');
                message.style = 'color: white;'
                message.textContent = "Você não possui nenhum Jogo no Carrinho !";
                cart.appendChild(message);
            } else {
                const fragment = document.createDocumentFragment();

                board.forEach(board => {
                    const cartItem = createCartItemElement(board);
                    fragment.appendChild(cartItem);
                });

                cart.appendChild(fragment);

                const closeOrderButton = document.createElement('button');

                closeOrderButton.textContent = 'Fechar Pedido';
                closeOrderButton.className = 'btn btn-success'
                closeOrderButton.addEventListener('click', async function (event) {
                    try {
                        const response = await fetch('/cart/finish', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userId })
                        });
                        if (response.ok) {
                            alert("Pedido Gerado, Verifique-o na sua Página de Pedidos")
                            loadCart();
                        } else {
                            console.error('301 - Erro ao gerar Pedido.');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                });

                const divCenter = document.createElement('div');
                divCenter.className = 'd-grid gap-2 mt-2';

                divCenter.appendChild(closeOrderButton);
                cart.appendChild(divCenter);
            }
        } else {
            console.error('301 - Erro ao obter a lista de Jogos.');
        }
    } catch (error) {
        console.error(error);
    }
}

/* Cria uma estrutura individual para cada Jogo disponível no Banco */
function createCartItemElement(board) {
    const container = document.createElement('div');
    container.className = 'cart-item';

    const boardsGames = document.createElement('div');
    boardsGames.className = 'btn divBoardCart';
    boardsGames.textContent = ` Jogo: ${board.nameBoard}, Preço: ${board.valueBoard}, Quantidade: ${board.quantityCart}`;
    const deleteButton = document.createElement('button');

    deleteButton.textContent = 'Deletar';
    deleteButton.className = 'btn btn-outline-danger'
    deleteButton.classList.add('btn-delete');
    deleteButton.dataset.cartId = board.idCart;

    deleteButton.addEventListener('click', async function (event) {
        const cartId = event.target.dataset.cartId;
        try {
            const response = await fetch(`/cart/del/${cartId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadCart();
            } else {
                console.error('301 - Erro ao excluir jogo do carrinho.');
            }
        } catch (error) {
            console.error(error);
        }
    });

    const divCenter = document.createElement('div');
    divCenter.className = 'd-grid gap-2 mt-2';

    divCenter.appendChild(deleteButton);

    const divider = document.createElement('hr');
    container.appendChild(boardsGames);
    container.appendChild(divCenter);
    container.appendChild(divider);

    return container;
}


/* Botão para Abrir Carrinho */
const openCartButton = document.getElementById('openCart');
openCartButton.addEventListener('click', loadCart);