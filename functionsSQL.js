const connection = require('./conecction');
const util = require('util');
const queryAsync = util.promisify(connection.query).bind(connection);

function add( boardId, quantity, userId, callback) {
    const sql = 'INSERT INTO cart(idBoard, idUsuario, quantityCart) VALUES (?, ?, ?);';
    connection.query(sql, [boardId, userId, quantity], (error, results, fields) => {
        if (error) {
            console.error('303 - Erro ao Adicionar Jogo ao Carrinho penis', error);
            callback(error, null);
            return;
        }
        console.log('Jogo cadastrado com sucesso');
        callback(null, results);
    });
}

async function get(userId) {
    const query = 'SELECT c.idCart, b.nameBoard, b.valueBoard, c.quantityCart, c.idBoard FROM cart c INNER JOIN board b ON b.idBoard = c.idBoard WHERE c.idUsuario = ?';

    try {
        const results = await queryAsync(query, userId);
        return results;
    } catch (error) {
        console.error('Erro ao obter a lista de Jogos: ', error);
        throw error;
    }
}

function del(cartId, callback) {
    const sql = 'DELETE FROM cart WHERE idCart = ?';
    connection.query(sql, cartId, (error, results, fields) => {
        if (error) {
            console.error('303 - Erro ao Remover Jogo do Carrinho', error);
            callback(error, null);
            return;
        }
        console.log('Jogo Removido com sucesso');
        callback(null, results);
    });
}

async function createOrder(userId) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO request(idUsuario) VALUES (?)';
        connection.query(sql, userId, (error, results, fields) => {
            if (error) {
                console.error('Erro ao gerar Pedido', error);
                reject(error);
            } else {
                console.log('Pedido Gerado');
                resolve(results.insertId);
            }
        });
    });
}


async function createOrderItems(cart, orderId) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < cart.length; i++) {
            let sql = "INSERT INTO itemsRequest(idRequest, idBoard, amount) VALUES (?, ? ,?) ";

            let data = [orderId, cart[i].idBoard, cart[i].quantityCart];
            connection.query(sql, data, function (error, results, fields) {
                if (error) {
                    console.error('303 - Erro ao gerar itens do Pedido', error);
                    reject(error);
                } else {
                    console.log('Itens do Pedido Gerado');
                    resolve(results.insertId);
                }
            });
        }
    });
}

function delAll(userId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM cart WHERE idUsuario = ?';
        connection.query(sql, userId, (error, results, fields) => {
            if (error) {
                console.error('303 - Erro ao Remover Todos os Jogos do Carrinho', error);
                reject(error);
            } else {
                console.log('Itens do Carrinho removidos');
                resolve(results.affectedRows);
            }
        });
    });
}

async function getItemsOrders(userId) {
    let query = "SELECT b.nameBoard, b.valueBoard, i.amount, i.idRequest, DATE(r.dataRequest) as dataRequest FROM itemsRequest i INNER JOIN board b  ON i.idBoard = b.idBoard INNER JOIN request r ON i.idRequest = r.idRequest WHERE r.idUsuario = 1 ORDER BY i.idRequest";

    try {
        const results = await queryAsync(query, userId);
        return results;
    } catch (error) {
        console.error('Erro ao obter a lista de mangas: ', error);
        throw error;
    }
}


module.exports = {
    add, del, get, createOrder, createOrderItems, delAll, getItemsOrders
};
