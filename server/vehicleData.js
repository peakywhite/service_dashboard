// server/vehicleData.js

/**
 * Typische Status-Werte:
 * - 'aktiv'    → im Fahrgastbetrieb
 * - 'wartung'  → in Werkstatt / geplant
 * - 'offline'  → keine Verbindung / abgestellt
 */

const vehicles = [
  {
    id: 'DE-ICE-401',
    name: 'ICE 3',
    fleet: 'BR 403',
    operator: 'DB Fernverkehr',
    country: 'DE',
    line: 'ICE 10',
    status: 'aktiv',
    location: 'Frankfurt (Main) Hbf',
    gps: { lat: 50.1071, lng: 8.6638 },
    lastSeen: '2025-12-11T09:12:00Z',
    softwareVersion: 'v3.2.1',
    softwareUpToDate: true,
    lastSoftwareRollout: '2025-12-01',
    nextSoftwareRollout: '2026-01-15',
    nextMaintenance: '2025-12-12',
    maintenanceDepot: 'Werk Frankfurt-Griesheim',
    buildYear: 2002,
    seats: 415,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-DE-ICE-401-01', 'SIM-DE-ICE-401-02'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.4.2' },
      { name: 'Passenger WiFi', firmware: 'v2.9.0' },
      { name: 'CCTV Bridge', firmware: 'v1.4.3' }
    ],
    notes: 'Regelmäßige ICE-Linie zwischen Köln und Berlin.'
  },

  {
    id: 'DE-ICE-415',
    name: 'ICE T',
    fleet: 'BR 415',
    operator: 'DB Fernverkehr',
    country: 'DE',
    line: 'ICE 28',
    status: 'aktiv',
    location: 'Leipzig Hbf',
    gps: { lat: 51.345, lng: 12.381 },
    lastSeen: '2025-12-11T09:05:00Z',
    softwareVersion: 'v3.2.1',
    softwareUpToDate: true,
    lastSoftwareRollout: '2025-11-25',
    nextSoftwareRollout: '2026-02-01',
    nextMaintenance: '2026-01-10',
    maintenanceDepot: 'Werk Leipzig-Engelsdorf',
    buildYear: 2000,
    seats: 250,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-DE-ICE-415-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.4.2' },
      { name: 'Passenger WiFi', firmware: 'v2.9.0' }
    ],
    notes: 'Neigetechnik-Triebzug; gute Funkabdeckung getestet.'
  },

  {
    id: 'DE-RE-2105',
    name: 'Talent 2',
    fleet: 'BR 442',
    operator: 'DB Regio',
    country: 'DE',
    line: 'RE 5',
    status: 'wartung',
    location: 'Werkstatt Köln',
    gps: { lat: 50.967, lng: 6.958 },
    lastSeen: '2025-12-11T06:10:00Z',
    softwareVersion: 'v3.0.4',
    softwareUpToDate: false,
    lastSoftwareRollout: '2025-07-10',
    nextSoftwareRollout: '2025-12-15',
    nextMaintenance: '2025-12-11',
    maintenanceDepot: 'AW Köln-Nippes',
    buildYear: 2012,
    seats: 220,
    wifiInstalled: false,
    simStatus: 'warn',
    sims: ['SIM-DE-RE-2105-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.1.0' },
      { name: 'Passenger Info', firmware: 'v1.8.3' }
    ],
    notes: 'Wartung inkl. Nachrüstung WLAN geplant.'
  },

  {
    id: 'DE-S-423-112',
    name: 'S-Bahn München',
    fleet: 'BR 423',
    operator: 'S-Bahn München',
    country: 'DE',
    line: 'S 8',
    status: 'aktiv',
    location: 'München Ost',
    gps: { lat: 48.1287, lng: 11.6033 },
    lastSeen: '2025-12-11T09:09:00Z',
    softwareVersion: 'v2.8.0',
    softwareUpToDate: false,
    lastSoftwareRollout: '2025-03-20',
    nextSoftwareRollout: '2026-03-01',
    nextMaintenance: '2026-02-05',
    maintenanceDepot: 'S-Bahn Werk Steinhausen',
    buildYear: 2001,
    seats: 192,
    wifiInstalled: false,
    simStatus: 'ok',
    sims: ['SIM-DE-S-423-112-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v4.9.1' },
      { name: 'Passenger Info', firmware: 'v1.7.0' }
    ],
    notes: 'Pilot für innerstädtische Funkoptimierung.'
  },

  // ---------------------------------------
  // SCHWEIZ
  // ---------------------------------------

  {
    id: 'CH-IC-800',
    name: 'RABe 501 Giruno',
    fleet: 'RABe 501',
    operator: 'SBB',
    country: 'CH',
    line: 'IC 2',
    status: 'aktiv',
    location: 'Basel SBB',
    gps: { lat: 47.5474, lng: 7.589 },
    lastSeen: '2025-12-11T09:04:00Z',
    softwareVersion: 'v3.2.1',
    softwareUpToDate: true,
    lastSoftwareRollout: '2025-10-10',
    nextSoftwareRollout: '2026-04-01',
    nextMaintenance: '2025-12-18',
    maintenanceDepot: 'Industriewerk Basel',
    buildYear: 2019,
    seats: 400,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-CH-IC-800-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.4.2' },
      { name: 'Passenger WiFi', firmware: 'v3.0.0' },
      { name: 'Passenger Info', firmware: 'v2.0.1' }
    ],
    notes: 'Internationaler Verkehr via Gotthard-Basistunnel.'
  },

  {
    id: 'CH-IR-200',
    name: 'FLIRT',
    fleet: 'RABe 523',
    operator: 'SBB',
    country: 'CH',
    line: 'IR 36',
    status: 'aktiv',
    location: 'Zürich HB',
    gps: { lat: 47.378, lng: 8.5402 },
    lastSeen: '2025-12-11T09:11:00Z',
    softwareVersion: 'v3.1.5',
    softwareUpToDate: true,
    lastSoftwareRollout: '2025-09-01',
    nextSoftwareRollout: '2026-01-20',
    nextMaintenance: '2026-01-05',
    maintenanceDepot: 'Werk Zürich Altstetten',
    buildYear: 2014,
    seats: 240,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-CH-IR-200-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.3.0' },
      { name: 'Passenger WiFi', firmware: 'v2.9.1' }
    ],
    notes: 'Hohe Fahrgastfrequenz; stabiler Datendurchsatz.'
  },

  // ---------------------------------------
  // ÖSTERREICH
  // ---------------------------------------

  {
    id: 'AT-RJX-90',
    name: 'Railjet',
    fleet: 'RJ 111',
    operator: 'ÖBB',
    country: 'AT',
    line: 'RJX 60',
    status: 'aktiv',
    location: 'Wien Hbf',
    gps: { lat: 48.1859, lng: 16.376 },
    lastSeen: '2025-12-11T09:02:00Z',
    softwareVersion: 'v3.1.0',
    softwareUpToDate: false,
    lastSoftwareRollout: '2025-06-15',
    nextSoftwareRollout: '2025-12-20',
    nextMaintenance: '2025-12-20',
    maintenanceDepot: 'Wien Jedlersdorf',
    buildYear: 2010,
    seats: 408,
    wifiInstalled: true,
    simStatus: 'warn',
    sims: ['SIM-AT-RJX-90-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.2.0' },
      { name: 'Passenger WiFi', firmware: 'v2.7.4' },
      { name: 'Media Server', firmware: 'v1.3.2' }
    ],
    notes: 'Einzelne SIM-Karten mit schwachem Signal gemeldet.'
  },

  {
    id: 'AT-REX-5022',
    name: 'Desiro',
    fleet: 'BR 5022',
    operator: 'ÖBB',
    country: 'AT',
    line: 'REX 3',
    status: 'offline',
    location: 'Abstellanlage Salzburg',
    gps: { lat: 47.812, lng: 13.045 },
    lastSeen: '2025-12-10T21:50:00Z',
    softwareVersion: 'v2.5.2',
    softwareUpToDate: false,
    lastSoftwareRollout: '2024-11-12',
    nextSoftwareRollout: '2026-03-10',
    nextMaintenance: '2026-02-20',
    maintenanceDepot: 'Salzburg Gnigl',
    buildYear: 2005,
    seats: 120,
    wifiInstalled: false,
    simStatus: 'critical',
    sims: ['SIM-AT-REX-5022-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v4.2.0' }
    ],
    notes: 'Außer Betrieb, Connectivity-Projekt erst ab Q2/26.'
  },

  // ---------------------------------------
  // FRANKREICH
  // ---------------------------------------

  {
    id: 'FR-TGV-280',
    name: 'TGV Duplex',
    fleet: 'TGV 2N2',
    operator: 'SNCF Voyageurs',
    country: 'FR',
    line: 'TGV 6803',
    status: 'aktiv',
    location: 'Paris Gare de Lyon',
    gps: { lat: 48.8443, lng: 2.373 },
    lastSeen: '2025-12-11T09:07:00Z',
    softwareVersion: 'v3.0.9',
    softwareUpToDate: false,
    lastSoftwareRollout: '2025-05-15',
    nextSoftwareRollout: '2026-01-30',
    nextMaintenance: '2026-01-15',
    maintenanceDepot: 'Technicentre Sud-Est',
    buildYear: 2013,
    seats: 509,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-FR-TGV-280-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.1.5' },
      { name: 'Passenger WiFi', firmware: 'v2.8.2' },
      { name: 'Passenger Info', firmware: 'v1.9.0' }
    ],
    notes: 'Internationaler Einsatz nach Genf & Zürich geplant.'
  },

  {
    id: 'FR-TER-84500',
    name: 'Régiolis',
    fleet: 'Z 84500',
    operator: 'SNCF TER',
    country: 'FR',
    line: 'TER 200',
    status: 'wartung',
    location: 'Technicentre Strasbourg',
    gps: { lat: 48.585, lng: 7.736 },
    lastSeen: '2025-12-11T05:30:00Z',
    softwareVersion: 'v2.9.0',
    softwareUpToDate: true,
    lastSoftwareRollout: '2025-08-10',
    nextSoftwareRollout: '2026-05-01',
    nextMaintenance: '2025-12-11',
    maintenanceDepot: 'Strasbourg',
    buildYear: 2016,
    seats: 260,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-FR-TER-84500-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.3.0' },
      { name: 'Passenger WiFi', firmware: 'v2.9.0' }
    ],
    notes: 'Geplante Wartung inkl. Türdiagnose-Upgrade.'
  },

  // ---------------------------------------
  // NIEDERLANDE
  // ---------------------------------------

  {
    id: 'NL-IC-2200',
    name: 'ICM Koploper',
    fleet: 'ICM-III',
    operator: 'NS',
    country: 'NL',
    line: 'IC 2200',
    status: 'aktiv',
    location: 'Amsterdam Centraal',
    gps: { lat: 52.378, lng: 4.9 },
    lastSeen: '2025-12-11T09:01:00Z',
    softwareVersion: 'v2.7.6',
    softwareUpToDate: false,
    lastSoftwareRollout: '2025-02-11',
    nextSoftwareRollout: '2026-02-11',
    nextMaintenance: '2026-01-02',
    maintenanceDepot: 'Onnen',
    buildYear: 1995,
    seats: 250,
    wifiInstalled: true,
    simStatus: 'warn',
    sims: ['SIM-NL-IC-2200-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v4.8.0' },
      { name: 'Passenger WiFi', firmware: 'v2.6.2' }
    ],
    notes: 'Ältere Flotte, Monitoring für Funklöcher relevant.'
  },

  {
    id: 'NL-SPR-7500',
    name: 'Sprinter SLT',
    fleet: 'SLT',
    operator: 'NS',
    country: 'NL',
    line: 'SPR 7500',
    status: 'aktiv',
    location: 'Utrecht Centraal',
    gps: { lat: 52.089, lng: 5.110 },
    lastSeen: '2025-12-11T09:10:00Z',
    softwareVersion: 'v3.1.0',
    softwareUpToDate: true,
    lastSoftwareRollout: '2025-09-20',
    nextSoftwareRollout: '2026-05-20',
    nextMaintenance: '2026-03-10',
    maintenanceDepot: 'Leidschendam',
    buildYear: 2011,
    seats: 200,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-NL-SPR-7500-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.2.1' },
      { name: 'Passenger WiFi', firmware: 'v2.9.1' }
    ],
    notes: 'Gute Telemetriedaten im Randstad-Gebiet.'
  },

  // ---------------------------------------
  // ITALIEN
  // ---------------------------------------

  {
    id: 'IT-FR-1000',
    name: 'Frecciarossa 1000',
    fleet: 'ETR 1000',
    operator: 'Trenitalia',
    country: 'IT',
    line: 'FR 9632',
    status: 'aktiv',
    location: 'Roma Termini',
    gps: { lat: 41.901, lng: 12.501 },
    lastSeen: '2025-12-11T09:03:00Z',
    softwareVersion: 'v3.2.0',
    softwareUpToDate: true,
    lastSoftwareRollout: '2025-10-01',
    nextSoftwareRollout: '2026-06-01',
    nextMaintenance: '2026-01-20',
    maintenanceDepot: 'Napoli Gianturco',
    buildYear: 2015,
    seats: 457,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-IT-FR-1000-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.4.0' },
      { name: 'Passenger WiFi', firmware: 'v3.0.0' },
      { name: 'Media Server', firmware: 'v1.4.0' }
    ],
    notes: 'Highspeed-Achse Turin–Neapel.'
  },

  {
    id: 'IT-REG-POP',
    name: 'POP',
    fleet: 'ETR 103',
    operator: 'Trenitalia',
    country: 'IT',
    line: 'R 2165',
    status: 'wartung',
    location: 'Officina Bologna',
    gps: { lat: 44.52, lng: 11.35 },
    lastSeen: '2025-12-11T04:55:00Z',
    softwareVersion: 'v2.9.5',
    softwareUpToDate: true,
    lastSoftwareRollout: '2025-08-15',
    nextSoftwareRollout: '2026-08-15',
    nextMaintenance: '2025-12-11',
    maintenanceDepot: 'Bologna',
    buildYear: 2019,
    seats: 220,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-IT-REG-POP-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.3.1' },
      { name: 'Passenger WiFi', firmware: 'v2.9.5' }
    ],
    notes: 'Regionale Flotte; Fokus auf Energie-Optimierung.'
  },

  // ---------------------------------------
  // SCHWEDEN
  // ---------------------------------------

  {
    id: 'SE-X2-200',
    name: 'X 2000',
    fleet: 'X2',
    operator: 'SJ',
    country: 'SE',
    line: 'X2 576',
    status: 'offline',
    location: 'Stockholm Hagalund',
    gps: { lat: 59.361, lng: 18.01 },
    lastSeen: '2025-12-10T18:30:00Z',
    softwareVersion: 'v2.6.0',
    softwareUpToDate: false,
    lastSoftwareRollout: '2024-10-10',
    nextSoftwareRollout: '2026-01-10',
    nextMaintenance: '2026-01-08',
    maintenanceDepot: 'Hagalund',
    buildYear: 1990,
    seats: 250,
    wifiInstalled: true,
    simStatus: 'warn',
    sims: ['SIM-SE-X2-200-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v4.5.0' },
      { name: 'Passenger WiFi', firmware: 'v2.3.0' }
    ],
    notes: 'Altbauflotte; Connectivity-Retrofit noch nicht abgeschlossen.'
  },

  // ---------------------------------------
  // GROSSBRITANNIEN
  // ---------------------------------------

  {
    id: 'GB-IC-390',
    name: 'Pendolino',
    fleet: 'Class 390',
    operator: 'Avanti West Coast',
    country: 'GB',
    line: '1A20',
    status: 'aktiv',
    location: 'London Euston',
    gps: { lat: 51.5282, lng: -0.1337 },
    lastSeen: '2025-12-11T09:06:00Z',
    softwareVersion: 'v3.0.2',
    softwareUpToDate: false,
    lastSoftwareRollout: '2025-05-01',
    nextSoftwareRollout: '2026-02-15',
    nextMaintenance: '2026-01-18',
    maintenanceDepot: 'Longsight Depot',
    buildYear: 2005,
    seats: 439,
    wifiInstalled: true,
    simStatus: 'ok',
    sims: ['SIM-GB-IC-390-01'],
    modules: [
      { name: 'Connectivity Gateway', firmware: 'v5.0.0' },
      { name: 'Passenger WiFi', firmware: 'v2.7.0' }
    ],
    notes: 'Strecke London–Manchester; hohe Auslastung.'
  }
];

/**
 * Filterbare Fahrzeugliste
 */
function getVehicles(filters = {}) {
  const { operator, status, country, search } = filters;

  return vehicles.filter(v => {
    if (operator && v.operator !== operator) return false;
    if (status && v.status !== status) return false;
    if (country && v.country !== country) return false;

    if (search && search.trim()) {
      const term = search.toLowerCase();
      const text = [
        v.id,
        v.name,
        v.fleet,
        v.operator,
        v.line,
        v.location,
        v.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!text.includes(term)) return false;
    }

    return true;
  });
}

/**
 * Einzelnes Fahrzeug anhand der ID
 */
function getVehicleById(id) {
  return vehicles.find(v => v.id === id) || null;
}

module.exports = {
  vehicles,
  getVehicles,
  getVehicleById,
};
