// Enviando dados via MQTT

// Bibliotecas
//Conexão com a rede
#include <WiFi.h>
//biblioteca mqqt, é necessária a sua instalação
//https://github.com/knolleary/pubsubclient/releases/tag/v2.8
# include <PubSubClient.h>

// Conf. Rede
// Configuracao Rede WiFi
const char *ssid     = "Elizane";
const char *password = "18031310";

// Conf. MQTT
const char* BROKER_MQTT = "test.mosquitto.org"; //servidor MQTT
int BROKER_PORT = 1883; // Porta padrão servidor MQTT
# define ID_MQTT  "andre_01"
# define TOPIC_01  "esp32/values"

WiFiClient espClient;
PubSubClient MQTT(espClient);

void setup() {
  Serial.begin(115200);
  WiFi.setHostname("esp8266_Riedi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  delay(10000);
  Serial.println("IP: ");
  Serial.println(WiFi.localIP());
  conectaMQTT();
  //MQTT.setServer(BROKER_MQTT, BROKER_PORT);
}

void loop() {
  static long long temporizador_envio = 0;
  mantemConexoes();
  if (millis() > temporizador_envio + 1000)
  {
    enviaValores();
    temporizador_envio = millis();
  }
  MQTT.loop();
  mantemConexoes();

}

void conectaMQTT() { 
    MQTT.setServer(BROKER_MQTT, BROKER_PORT);
    while (!MQTT.connected()) {
        Serial.print("Conectando ao Broker MQTT: ");
        Serial.println(BROKER_MQTT);
        MQTT.connect(ID_MQTT);
        if (MQTT.connect(ID_MQTT)) {
          Serial.println("Conectado ao Broker com sucesso!");
        } 
        else {
            Serial.println("Não foi possivel se conectar ao broker.");
            Serial.println("Nova tentatica de conexao em 10s");
            delay(3000);
        }
    }
}

void enviaValores() {
  MQTT.publish(TOPIC_01, "1");
   
}

void mantemConexoes() {
    if (!MQTT.connected()) {
       conectaMQTT(); 
    }
}
