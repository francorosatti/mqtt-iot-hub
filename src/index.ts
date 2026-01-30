import { config } from 'dotenv';
import { Client } from 'azure-iot-device';
import { Mqtt as MqttProtocol } from 'azure-iot-device-mqtt';
import { Message } from 'azure-iot-device';

// Load environment variables
config();

// Azure IoT Hub connection string
// Format: HostName=<your-iot-hub>.azure-devices.net;DeviceId=<device-id>;SharedAccessKey=<key>
const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;

if (!connectionString) {
  console.error('Error: AZURE_IOT_CONNECTION_STRING environment variable is not set');
  process.exit(1);
}

// Extract deviceId from connection string
const deviceIdMatch = connectionString.match(/DeviceId=([^;]+)/);
const deviceId = deviceIdMatch ? deviceIdMatch[1] : 'unknown';

// Create MQTT client
const client = Client.fromConnectionString(connectionString, MqttProtocol);

// Interface for telemetry data
interface TelemetryData {
  deviceId: string;
  temperature: number;
  humidity: number;
  ts: string;
}

/**
 * Send telemetry data to Azure IoT Hub
 */
async function sendTelemetry(data: TelemetryData): Promise<void> {
  const message = new Message(JSON.stringify(data));

  // Add custom properties to the message (optional)
  message.contentType = 'application/json';
  message.contentEncoding = 'utf-8';

  return new Promise((resolve, reject) => {
    client.sendEvent(message, (err) => {
      if (err) {
        console.error('Failed to send message:', err.message);
        reject(err);
      } else {
        console.log('Message sent successfully:', JSON.stringify(data));
        resolve();
      }
    });
  });
}

/**
 * Generate mock sensor data
 */
function generateSensorData(): TelemetryData {
  return {
    deviceId: deviceId,
    temperature: 20 + Math.random() * 15, // Random temperature between 20-35°C
    humidity: 40 + Math.random() * 40,    // Random humidity between 40-80%
    ts: new Date().toISOString()          // ISO 8601 format: "2026-01-29T16:12:00.000Z"
  };
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    console.log('Connecting to Azure IoT Hub...');

    // Open the connection
    await new Promise<void>((resolve, reject) => {
      client.open((err) => {
        if (err) {
          console.error('Failed to connect:', err.message);
          reject(err);
        } else {
          console.log('Connected to Azure IoT Hub successfully');
          resolve();
        }
      });
    });

    // Send telemetry data every 5 seconds
    const intervalId = setInterval(async () => {
      try {
        const data = generateSensorData();
        await sendTelemetry(data);
      } catch (error) {
        console.error('Error sending telemetry:', error);
      }
    }, 30000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down...');
      clearInterval(intervalId);
      client.close(() => {
        console.log('Connection closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

// Run the application
main();
