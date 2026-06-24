import '../css/dashbord.css';
import imgBook from '../images/books-bl.png';
import imgAdh  from '../images/people-bl.png';
import imgEmp  from '../images/give-book-bl.png';
import imgsta  from '../images/status.png';
import { useSelector } from 'react-redux';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Badge statut ──────────────────────────────────────────────────────────
const STATUS_CFG = {
  active:    { iconClass: 'db-status-icon--active',    badgeClass: 'db-badge--active',    label: 'Actif',     symbol: '📖' },
  retard:    { iconClass: 'db-status-icon--retard',    badgeClass: 'db-badge--retard',    label: 'Retard',    symbol: '⚠️'  },
  Retourner: { iconClass: 'db-status-icon--retourner', badgeClass: 'db-badge--retourner', label: 'Retourné',  symbol: '✅'  },
};
const DEFAULT_STATUS = { iconClass: 'db-status-icon--default', badgeClass: 'db-badge--default', label: '—', symbol: '📅' };

const Badge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? DEFAULT_STATUS;
  return <span className={`db-badge ${cfg.badgeClass}`}>{cfg.label}</span>;
};

const StatusIcon = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? DEFAULT_STATUS;
  return (
    <div className={`db-status-icon ${cfg.iconClass}`}>
      {cfg.symbol}
    </div>
  );
};

// ─── Tooltip graphique ─────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip-label">{label}</div>
      <div className="db-tooltip-value">
        {payload[0].value} emprunt{payload[0].value !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

// ─── Barre de progression ──────────────────────────────────────────────────
const ProgressBar = ({ value, max }) => (
  <div className="db-progress-track">
    <div
      className="db-progress-bar"
      style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
    />
  </div>
);

// ─── Médaille ──────────────────────────────────────────────────────────────
const MEDAL_CLASSES = ['db-medal--1', 'db-medal--2', 'db-medal--3'];

const Medal = ({ rank }) => (
  <div className={`db-medal ${MEDAL_CLASSES[rank] ?? 'db-medal--n'}`}>
    {rank + 1}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
export default function Dashboard({ books = [], members = [], loans: loansProp = [] }) {

  const reduxLoans = useSelector((state) => state.emprunt.loans);
  const loans = (reduxLoans?.length > 0) ? reduxLoans : loansProp;

  // ── Stats ──
  // const totalBooks   = books.reduce((s, b) => s + (parseInt(b.qte) || 0), 0);
  const available    = books.reduce((s, b) => s + (parseInt(b.status) || 0), 0);
  const overdueCount = loans.filter(l => l.status === 'retard').length;
  const returnCount  = loans.filter(l => l.status === 'Retourner').length;
  const activeCount  = loans.filter(l => l.status === 'active').length;

  // ── Graphique 6 derniers mois ──
  const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  const currentMonth = new Date().getMonth();
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const idx = (currentMonth - 5 + i + 12) % 12;
    return {
      m: MONTHS[idx],
      v: loans.filter(l => {
        const d = new Date(l.date_emprunt);
        return !isNaN(d) && d.getMonth() === idx;
      }).length,
    };
  });
  const monthlyTotal = monthly.reduce((s, d) => s + d.v, 0);
  const monthlyBest  = Math.max(...monthly.map(d => d.v), 0);

  // ── Top livres ──
  const topBooks = [...books]
    .sort((a, b) =>
      (parseInt(b.qte) - parseInt(b.disponibilite)) -
      (parseInt(a.qte) - parseInt(a.disponibilite))
    )
    .slice(0, 4);
  const maxEmprunts = topBooks.length
    ? (parseInt(topBooks[0].qte) || 0) - (parseInt(topBooks[0].disponibilite) || 0)
    : 1;

  // ── Derniers emprunts ──
  const recentLoans = [...loans].reverse().slice(0, 4);

  return (
    <div className="dashboard-container">

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="stats-grid">
        {[
          [imgBook, 'Total Livres',    books.length],
          [imgAdh,  'Adhérents',       members.length],
          [imgsta,  'Disponibles',     available],
          [imgEmp,  'Emprunts ',       loans.length],
          
        ].map(([ic, lb, vl]) => (
          <div key={lb} className="stat-card">
            <img className="stat-icon" style={{ width: 35 }} src={ic} alt={lb} />
            <div className="stat-val">{vl}</div>
            <div className="stat-lbl">{lb}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">

        {/* ── Graphique ────────────────────────────────────────────────── */}
        <div className="db-card">
          <p className="db-card-title">
            <span></span> Emprunts par mois
          </p>

          <div className="db-chart-stats">
            <div>
              <div className="db-chart-stat-val db-chart-stat-val--purple">{monthlyTotal}</div>
              <div className="db-chart-stat-lbl">Total · 6 mois</div>
            </div>
            <div>
              <div className="db-chart-stat-val db-chart-stat-val--green">{monthlyBest}</div>
              <div className="db-chart-stat-lbl">Meilleur mois</div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={monthly} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7F77DD" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#7F77DD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#e8e6df" strokeDasharray="4 4" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#888780' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#888780' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#7F77DD', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone" dataKey="v"
                stroke="#7F77DD" strokeWidth={2.5} fill="url(#grad)"
                dot={{ r: 4, fill: '#7F77DD', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#534AB7', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Derniers emprunts ─────────────────────────────────────────── */}
        <div className="db-card">
          <p className="db-card-title">
            <span></span> Derniers emprunts
          </p>

          {recentLoans.length === 0 ? (
            <div className="db-empty">Aucun emprunt enregistré</div>
          ) : recentLoans.map((l) =>{
              const livre = books.find(b => b.id === l.livre_id)?.title || 'Livre inconnu';
              const adherent = members.find(m => m.id === l.adherent_id)?.nom || 'Adhérent inconnu';
            return(
                <div key={l.id} className="db-row">
                  <StatusIcon status={l.status} />
                  <div className="db-row-body">
                    <div className="db-row-title">{livre}</div>
                    <div className="db-row-meta">{adherent} · {l.date_emprunt}</div>
                  </div>
                  <Badge status={l.status} />
                </div>
          )})}
        </div>

        {/* ── Alertes ───────────────────────────────────────────────────── */}
        <div className="db-card">
          <p className="db-card-title">
            <span></span> Alertes
          </p>

          {overdueCount === 0 && returnCount === 0 ? (
            <div className="db-alert-block db-alert-block--ok">
              <div className="db-alert-icon db-alert-icon--ok">✅</div>
              <div className="db-alert-body">
                <div className="db-alert-title db-alert-title--ok">Tout est en ordre</div>
                <div className="db-alert-sub db-alert-sub--ok">Aucune alerte à signaler</div>
              </div>
            </div>
          ) : (
            <div className="db-alerts-list">
              {overdueCount > 0 && (
                <div className="db-alert-block db-alert-block--retard">
                  <div className="db-alert-icon db-alert-icon--retard">⚠️</div>
                  <div className="db-alert-body">
                    <div className="db-alert-title db-alert-title--retard">
                      {overdueCount} emprunt{overdueCount > 1 ? 's' : ''} en retard
                    </div>
                    <div className="db-alert-sub db-alert-sub--retard">Retours dépassés</div>
                  </div>
                  <span className="db-count-pill db-count-pill--retard">{overdueCount}</span>
                </div>
              )}

              {returnCount > 0 && (
                <div className="db-alert-block db-alert-block--retour">
                  <div className="db-alert-icon db-alert-icon--retour">📅</div>
                  <div className="db-alert-body">
                    <div className="db-alert-title db-alert-title--retour">
                      {returnCount} à rendre aujourd'hui
                    </div>
                    <div className="db-alert-sub db-alert-sub--retour">Prévus pour ce jour</div>
                  </div>
                  <span className="db-count-pill db-count-pill--retour">{returnCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Top livres ────────────────────────────────────────────────── */}
        <div className="db-card">
          <p className="db-card-title">
            <span></span> Livres les + empruntés
          </p>

          {topBooks.length === 0 ? (
            <div className="db-empty">Aucune donnée disponible</div>
          ) : topBooks.map((b, i) => {
            const nbEmprunts = (parseInt(b.qte) || 0) - (parseInt(b.disponibilite) || 0);
            return (
              <div key={b.id} className="db-row">
                <Medal rank={i} />
                <div className="db-row-body">
                  <div className="db-row-title">{b.title}</div>
                  <div className="db-row-meta">{b.author}</div>
                </div>
                <div className="db-book-right">
                  <span className="db-book-count">{nbEmprunts} empr.</span>
                  <ProgressBar value={nbEmprunts} max={maxEmprunts} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}