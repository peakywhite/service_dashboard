// src/VehicleInfo.tsx

export function VehicleInfo() {
  return (
    <section className="section grid-2">
      <div className="card-elevated">
        <h2>Fahrzeug Informationen</h2>
        <p className="section-subtitle">
          Geplante Ansicht für Fahrzeugstammdaten, Softwarestände und Wartungsfenster.
        </p>
        <ul className="bullet-list">
          <li>Zug / Fahrzeug-ID, Betreiber, Linie</li>
          <li>Installierte connect@rail-Module & Firmwarestände</li>
          <li>Nächste Wartung & geplante Software-Rollouts</li>
        </ul>
      </div>
      <div className="card-elevated vehicle-grid">
        <div>
          <span className="mini-label">Aktiv im Netz</span>
          <div className="mini-value">24</div>
        </div>
        <div>
          <span className="mini-label">In Wartung</span>
          <div className="mini-value mini-value-warn">2</div>
        </div>
        <div>
          <span className="mini-label">Software aktuell</span>
          <div className="mini-value">91%</div>
          <div className="mini-bar">
            <span style={{ width: '91%' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
