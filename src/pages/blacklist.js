import '../css/blacklist.css';
import { useSelector } from 'react-redux';

export default function Blacklist() {

  // ── Lire directement depuis Redux (données avec relations eager-loaded) ──
  // Structure: { id, emprunt_id, adherent_id, status, emprunt:{...}, adherent:{...} }
  const blacklistes = useSelector(state => state.blacklistes.blackliste);

  // ── Regrouper par adherent_id (un adhérent peut avoir plusieurs emprunts) ──
  const blacklistMap = {};

  blacklistes
    .filter(b => b.status === 'Bloqué')
    .forEach(b => {
      const key      = b.adherent_id;
      const adherent = b.adherent;
      const emprunt  = b.emprunt;

      if (!blacklistMap[key]) {
        blacklistMap[key] = {
          adherent_id : key,
          nom         : adherent?.nom   ?? `Adhérent #${key}`,
          email       : adherent?.email ?? '—',
          phone       : adherent?.phone ?? '—',
          livres      : [],
          joursRetard : 0,
        };
      }

      // Ajouter le livre de cet emprunt
      if (emprunt?.livre) {
        blacklistMap[key].livres.push(emprunt.livre);
      }

      // Garder le retard max
      blacklistMap[key].joursRetard = Math.max(
        blacklistMap[key].joursRetard,
        parseInt(emprunt?.retard) || 0
      );
    });

  const blacklist = Object.values(blacklistMap);

  return (
    <div className="bl-wrap">

      {/* ── En-tête ── */}
      <div className="bl-head">
        <div className="bl-head-left">
          <span className="bl-icon">🚫</span>
          <div>
            <h2 className="bl-title">Liste noire</h2>
            <p className="bl-sub">Adhérents avec emprunts en retard</p>
          </div>
        </div>
        <span className="bl-count-pill">
          {blacklist.length} adhérent{blacklist.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Table ── */}
      {blacklist.length === 0 ? (
        <div className="bl-empty">
          <div className="bl-empty-icon">✅</div>
          <p>Aucun adhérent en liste noire</p>
          <span>Tous les emprunts sont à jour</span>
        </div>
      ) : (
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Adhérent</th>
                <th>Contact</th>
                <th>Livre(s) en retard</th>
                <th>Retard max</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.map((row, i) => (
                <tr key={row.adherent_id}>
                  <td className="bl-td-num">{i + 1}</td>

                  {/* Adhérent */}
                  <td>
                    <div className="bl-member">
                      <div className="bl-avatar">
                        {row.nom.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="bl-member-name">{row.nom}</div>
                        <div className="bl-member-phone">{row.phone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td>
                    <div className="bl-email">{row.email}</div>
                  </td>

                  {/* Livres en retard */}
                  <td>
                    <div className="bl-livres">
                      {row.livres.map(l => (
                        <span key={l} className="bl-livre-tag">{l}</span>
                      ))}
                    </div>
                  </td>

                  {/* Jours de retard */}
                  <td>
                    <span className={`bl-retard-badge ${row.joursRetard >= 7 ? 'bl-retard-badge--critical' : 'bl-retard-badge--warn'}`}>
                      {row.joursRetard} jour{row.joursRetard !== 1 ? 's' : ''}
                    </span>
                  </td>

                  {/* Statut */}
                  <td>
                    <span className="bl-status-badge">🚫 Bloqué</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}