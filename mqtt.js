const mqtt = require('mqtt');
const { Pool } = require('pg');

// Configurações do broker MQTT
const brokerUrl = 'mqtt://test.mosquitto.org'; // Substitua pelo endereço do seu broker MQTT
const client = mqtt.connect(brokerUrl);

//testandoooo


// Configurações do PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teste', // asdha
    password: 'postgres',
    port: 5432,
});

// Nome da sua tabela
const tableName = 'valor';

// Tópico MQTT para receber valores do ESP32
const receiveTopic = 'esp32/values';

// Evento de conexão bem-sucedida
client.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    // Inscreva-se no tópico para receber valores
    client.subscribe(receiveTopic);
});

// Evento de recebimento de mensagem
client.on('message', (receivedTopic, message) => {
    console.log(`Mensagem recebida no tópico ${receivedTopic}: ${message.toString()}`);
    // Adicione lógica adicional aqui com base nos valores recebidos do ESP32

    // Armazenar a mensagem no PostgreSQL
    saveToPostgreSQL(message.toString());
});

// Lidar com desconexão
client.on('close', () => {
    console.log('Conexão fechada');
});

// Lidar com erros de conexão
client.on('error', (err) => {
    console.error(`Erro de conexão: ${err}`);
});

async function saveToPostgreSQL(data) {
    const client = await pool.connect();

    try {
        console.log('Conectado ao PostgreSQL');

        // Adicione a lógica para formatar e salvar seus dados conforme necessário
        const result = await client.query(`INSERT INTO ${tableName} (valor1, timestamp) VALUES ($1, $2) RETURNING *`, [data, new Date()]);
        console.log(`Registro inserido com sucesso. ID: ${result.rows[0].id}`);
    } finally {
        client.release();
    }
}
