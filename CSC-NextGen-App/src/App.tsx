import { useMemo } from 'react'
import './App.css'

function App() {
  const currentYear = new Date().getFullYear()
  const generatedAt = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()),
    [],
  )

  const districtStats = [
    { label: 'Neighborhoods Connected', value: '142' },
    { label: 'Live Cameras Online', value: '987' },
    { label: 'Avg Dispatch Confirmation', value: '1m 42s' },
  ]

  const activeMissions = [
    {
      title: 'Transit Corridor Coverage',
      zone: 'Zone 04',
      status: 'On Track',
      eta: '26 min',
    },
    {
      title: 'School Perimeter Sweep',
      zone: 'Zone 11',
      status: 'Monitor',
      eta: '14 min',
    },
    {
      title: 'Harbor Gate Operations',
      zone: 'Zone 02',
      status: 'Escalated',
      eta: '7 min',
    },
  ]

  const platformModules = [
    'Rapid Alert Broadcast',
    'Field Team Routing',
    'Community Risk Signals',
    'Unified Evidence Vault',
    'Agency Coordination Desk',
    'Real-Time Incident Debriefs',
  ]

  return (
    <main className="app-shell">
      <section className="hero-band">
        <p className="kicker">CommunitySafeConnect CSC 2.0</p>
        <h1>City Safety Command, Reimagined for Fast Decisions</h1>
        <p className="hero-copy">
          A brighter command experience for supervisors, responders, and local partners.
          One surface. Live awareness. Clear action.
        </p>
        <div className="hero-cta-row">
          <button type="button" className="primary-btn">
            Launch Mission Board
          </button>
          <button type="button" className="ghost-btn">
            Open Incident Timeline
          </button>
        </div>
      </section>

      <section className="stats-grid" aria-label="District statistics">
        {districtStats.map((item) => (
          <article key={item.label} className="stat-card">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="board-grid">
        <article className="panel mission-panel">
          <div className="panel-head">
            <h2>Active Missions</h2>
            <span>Updated {generatedAt}</span>
          </div>
          <ul>
            {activeMissions.map((mission) => (
              <li key={mission.title} className="mission-row">
                <div>
                  <h3>{mission.title}</h3>
                  <p>
                    {mission.zone} • ETA {mission.eta}
                  </p>
                </div>
                <span className={`pill ${mission.status.toLowerCase().replace(' ', '-')}`}>
                  {mission.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel module-panel">
          <div className="panel-head">
            <h2>Platform Modules</h2>
            <span>6 Enabled</span>
          </div>
          <ul className="module-list">
            {platformModules.map((moduleName) => (
              <li key={moduleName}>{moduleName}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="footer-band" aria-label="System note">
        <p>
          This CSC-NextGen-App is intentionally separate from all other CommunitySafeConnect
          and CSC applications for business purposes: separate repository path, separate runtime,
          separate authentication, and no shared automatic data or service connections.
        </p>
        <p className="brand-copy">
          Powered by Armstrong Pack Company. Copyright {currentYear} Armstrong Pack Company.
          All rights reserved.
        </p>
      </section>
    </main>
  )
}

export default App
