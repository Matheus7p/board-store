const express = require("express");
const path = require('path');
const app = express();
const cart = require('./functionsSQL');



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile('/index.html', { root: __dirname });
})


app.get("/requests", function (req, res) {
    res.sendFile('/pages/requests.html', { root: __dirname });
})

app.get("/warPage", function (req, res) {
    res.sendFile('/pages/war_page.html', { root: __dirname });
})

app.get("/perfilPage", function (req, res) {
    res.sendFile('/pages/perfil_page.html', { root: __dirname });
})

app.get("/fdpPage", function (req, res) {
    res.sendFile('/pages/fdp_page.html', { root: __dirname });
})


app.post('/cart/add', (req, res) => {
    const {boardId, quantity, userId } = req.body;
    cart.add(boardId, quantity, userId, (error, results) => {
        if (error) {
            res.status(500).send('302 - Erro ao Adicionar Jogos ao Carrinho');
            return;
        }
        res.status(200).send('Jogos cadastrado com sucesso no Carrinho');
    });
});

app.post('/cart/get', async (req, res) => {
    const { userId } = req.body;
    let cartItens;
    try {
        cartItens = await cart.get(userId);
        res.json(cartItens);
    } catch (error) {
        console.error('Erro ao obter a lista de jogos: ', error);
        res.status(500).json({ error: 'Erro ao obter a lista de Jogos' });
    }
});


app.delete('/cart/del/:cartId', (req, res) => {
    const cartId = req.params.cartId;
    console.log(cartId);
    cart.del(cartId, (error, results) => {
        if (error) {
            res.status(500).send('302 - Erro ao Excluir Jogo do Carrinho');
            return;
        }
        res.status(200).send('Jogo excluido com sucesso do Carrinho');
    });

});

app.post('/cart/finish', async (req, res) => {
    const { userId } = req.body;
    let orderId;
    let cartItems;

    try {
        orderId = await cart.createOrder(userId);
        cartItems = await cart.get(userId);
        await cart.createOrderItems(cartItems, orderId);
        await cart.delAll(userId);

        res.status(200).send('Pedido gerado com sucesso do carrinho.');
    } catch (error) {
        console.error('Erro ao finalizar o pedido:', error);
        res.status(500).send('302 - Erro ao finalizar o pedido.');
    }

});

app.post("/itemsOrders/get", async function (req, res) {
    const userId = req.query.userId;
    let orderItens;
    try {
        orderItens = await cart.getItemsOrders(userId);
        res.json(orderItens);
    } catch (error) {
        console.error('Erro ao obter a lista de itens dos Pedidos: ', error);
        res.status(500).json({ error: '302 - Erro ao obter a lista de jogos.' });
    }
})


let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Servidor funcionando", host, port);
})


module.exports = app;