# MQTT IoT Hub

A TypeScript project to send data over MQTT to Azure IoT Hub.

## Features

- Connect to Azure IoT Hub using MQTT protocol
- Send telemetry data (temperature, humidity) to IoT Hub
- Mock sensor data generation
- Graceful shutdown handling
- Environment-based configuration

## Prerequisites

- Node.js (v16 or higher)
- An Azure account with an IoT Hub instance
- A registered device in your IoT Hub

## Azure IoT Hub Setup

1. **Create an IoT Hub** (if you don't have one):
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new IoT Hub resource
   - Choose your subscription, resource group, and region

2. **Register a Device**:
   - In your IoT Hub, go to "Devices" under Device management
   - Click "Add Device"
   - Enter a Device ID and save
   - Click on your device and copy the **Primary Connection String**

## Installation

1. Clone this repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

3. Add your Azure IoT Hub connection string to `.env`:

```env
AZURE_IOT_CONNECTION_STRING=HostName=<your-iot-hub>.azure-devices.net;DeviceId=<device-id>;SharedAccessKey=<key>
```

## Usage

### Development Mode

Run with ts-node (no build required):

```bash
npm run dev
```

### Production Mode

Build and run:

```bash
npm run build
npm start
```

### Watch Mode

Auto-compile on file changes:

```bash
npm run watch
```

## Project Structure

```
mqtt-iot-hub/
├── src/
│   └── index.ts          # Main application file
├── dist/                 # Compiled JavaScript (generated)
├── .env                  # Environment variables (not in git)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

The application:
1. Connects to Azure IoT Hub using the MQTT protocol
2. Generates mock sensor data (temperature and humidity)
3. Sends telemetry messages every 5 seconds
4. Handles errors and graceful shutdown (Ctrl+C)

## Monitoring Messages

To monitor messages sent to your IoT Hub:

### Using Azure CLI

```bash
az iot hub monitor-events --hub-name <your-iot-hub-name> --device-id <your-device-id>
```

### Using Azure Portal

1. Go to your IoT Hub in Azure Portal
2. Navigate to "Metrics" or use Azure Monitor
3. Set up monitoring for device-to-cloud messages

## Customization

### Modify Telemetry Data

Edit the `generateSensorData()` function in [src/index.ts](src/index.ts) to send your own data:

```typescript
function generateSensorData(): TelemetryData {
  return {
    temperature: 25.0,
    humidity: 60.0,
    timestamp: new Date().toISOString()
  };
}
```

### Change Send Interval

Modify the interval in the `main()` function (currently set to 5000ms):

```typescript
const intervalId = setInterval(async () => {
  // Send telemetry
}, 5000); // Change this value
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AZURE_IOT_CONNECTION_STRING` | Device connection string from Azure IoT Hub | Yes |

## Troubleshooting

### Connection Failed

- Verify your connection string is correct
- Ensure your device is registered in IoT Hub
- Check network connectivity
- Verify your IoT Hub is in an active state

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be v16+)

## License

ISC
