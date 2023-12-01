const mqtt = require('mqtt');
const { Sequelize, DataTypes } = require('sequelize');

// Configurações do broker MQTT
const brokerUrl = 'mqtt://test.mosquitto.org'; // Substitua pelo endereço do seu broker MQTT
const client = mqtt.connect(brokerUrl);

// Configurações do Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Nome do arquivo de banco de dados SQLite
});

// Modelo Sequelize para a tabela 'valor'
const Valor = sequelize.define('valor', {
  valor1: {
    type: DataTypes.STRING, // Altere o tipo de dados conforme necessário
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Sincronizar o modelo com o banco de dados
sequelize.sync();

// Tópico MQTT para receber valores do ESP32
const receiveTopic = 'esp32/values';

// Evento de conexão bem-sucedida
client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  // Inscreva-se no tópico para receber valores
  client.subscribe(receiveTopic);
});

// Evento de recebimento de mensagem
client.on('message', async (receivedTopic, message) => {
  console.log(`Mensagem recebida no tópico ${receivedTopic}: ${message.toString()}`);
  // Adicione lógica adicional aqui com base nos valores recebidos do ESP32

  // Armazenar a mensagem no SQLite usando Sequelize
  await saveToSQLite(message.toString());
});

// Lidar com desconexão
client.on('close', () => {
  console.log('Conexão fechada');
});

// Lidar com erros de conexão
client.on('error', (err) => {
  console.error(`Erro de conexão: ${err}`);
});

async function saveToSQLite(data) {
  try {
    console.log('Conectado ao SQLite');

    // Adicione a lógica para formatar e salvar seus dados conforme necessário
    const result = await Valor.create({
      valor1: data,
      timestamp: new Date(),
    });

    console.log(`Registro inserido com sucesso. ID: ${result.id}`);
  } catch (error) {
    console.error(`Erro ao inserir registro no SQLite: ${error.message}`);
  }
}
