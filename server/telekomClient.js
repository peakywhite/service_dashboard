// server/telekomClient.js
// Aktuell: Mock-Daten. Später hier echte Telekom-M2M-API einbauen.

async function getSimCardsMock() {
  // Jedes Objekt entspricht einer SIM-Karte
  return [
    {
      id: 'SIM001',
      iccid: '8949012345678900001',
      eid: '89033023456789000012345678900001',
      msisdn: '491700000001',
      imeisv: '3520990017614801',
      simStatus: 'online',              // z.B. online/offline/suspended
      activeDataConnection: true,
      dataUsageKb: 123456,              // in Kilobyte
      abuseStatus: 'ok',
      limitProfile: 'Standard',
      tariff: 'M2M Connect L',
      orderNumber: 'ORD-2024-0001',
      zfNumber: 'ZF-0001',
      device: 'connect@rail Gateway v2',
      serialNumber: 'CRGW-2024-0001',
      project: 'Pilot Stuttgart-Ulm',
      customer: 'DB Regio',
    },
    {
      id: 'SIM002',
      iccid: '8949012345678900002',
      eid: '89033023456789000012345678900002',
      msisdn: '491700000002',
      imeisv: '3520990017614802',
      simStatus: 'offline',
      activeDataConnection: false,
      dataUsageKb: 0,
      abuseStatus: 'alert',
      limitProfile: 'Roaming Limit',
      tariff: 'M2M Connect S',
      orderNumber: 'ORD-2024-0002',
      zfNumber: 'ZF-0002',
      device: 'connect@rail Gateway v2',
      serialNumber: 'CRGW-2024-0002',
      project: 'IC Nord-Süd',
      customer: 'DB Fernverkehr',
    },
    {
      id: 'SIM003',
      iccid: '8949012345678900003',
      eid: '89033023456789000012345678900003',
      msisdn: '491700000003',
      imeisv: '3520990017614803',
      simStatus: 'online',
      activeDataConnection: true,
      dataUsageKb: 51200,
      abuseStatus: 'ok',
      limitProfile: 'High Traffic',
      tariff: 'M2M Connect XL',
      orderNumber: 'ORD-2024-0003',
      zfNumber: 'ZF-0003',
      device: 'Onboard Router v1',
      serialNumber: 'OBR-2024-0003',
      project: 'connect@rail Demo',
      customer: 'ZF Testzug',
    },
  ];
}

async function getVehiclesMock() {
  return [
    {
      id: 'ZUG-001',
      name: 'RE 5 – Stuttgart ↔ Ulm',
      operator: 'DB Regio',
      softwareUpToDate: true,
      sims: ['491700000001'],
    },
    {
      id: 'ZUG-002',
      name: 'IC 2010 – München ↔ Hamburg',
      operator: 'DB Fernverkehr',
      softwareUpToDate: false,
      sims: ['491700000002', '491700000003'],
    },
  ];
}

module.exports = {
  getSimCardsMock,
  getVehiclesMock,
};
