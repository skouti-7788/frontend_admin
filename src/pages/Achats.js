import { useEffect, useState } from "react";
import { useAchats } from "../data/dataAchats";

export default function Achats({loans, setLoans, books, setBooks, members, showToast}) {
  const { fetchAchats, updateAchat, deleteAchat } = useAchats();
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les achats au montage
  useEffect(() => {
    const loadAchats = async () => {
      try {
        setLoading(true);
        const data = await fetchAchats();
        setAchats(data || []);
      } catch (err) {
        setError("Erreur lors du chargement des achats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAchats();
  }, []);

  // Gérer la mise à jour du statut
  const handleUpdateStatus = async (id, newStatus, newStatusPaye) => {
    try {
      await updateAchat(id, {
        status: newStatus,
        status_paye: newStatusPaye,
      });
      // Recharger les achats
      const data = await fetchAchats();
      setAchats(data || []);
    } catch (err) {
      setError("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  // Gérer la suppression
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet achat ?")) {
      try {
        const success = await deleteAchat(id);
        if (success) {
          setAchats(achats.filter(a => a.id !== id));
        }
      } catch (err) {
        setError("Erreur lors de la suppression");
        console.error(err);
      }
    }
  };

  if (loading) return <div className="achats-container"><p>Chargement des achats...</p></div>;
  if (error) return <div className="achats-container error"><p>{error}</p></div>;

  return (
    <div className="achats-container">
      <h2>Gestion des Achats</h2>
      {achats.length === 0 ? (
        <p>Aucun achat trouvé.</p>
      ) : (
        <table className="achats-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Utilisateur</th>
              <th>Livre</th>
              <th>Date d'achat</th>
              <th>Statut</th>
              <th>Paiement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {achats.map(achat => (
              <tr key={achat.id}>
                {/* <td>{achat.id}</td> */}
                <td>{achat.user?.name || "N/A"}</td>
                <td>{achat.livre?.titre || "N/A"}</td>
                <td>{achat.date_achat || "N/A"}</td>
                <td>
                  <select
                    value={achat.status}
                    onChange={(e) =>
                      handleUpdateStatus(achat.id, e.target.value, achat.status_paye)
                    }
                  >
                    <option value="En attente">En attente</option>
                    <option value="Confirmé">Confirmé</option>
                    <option value="Livré">Livré</option>
                    <option value="Annulé">Annulé</option>
                  </select>
                </td>
                <td>
                  <select
                    value={achat.status_paye}
                    onChange={(e) =>
                      handleUpdateStatus(achat.id, achat.status, e.target.value)
                    }
                  >
                    <option value="Non payé">Non payé</option>
                    <option value="Payé">Payé</option>
                    <option value="Remboursé">Remboursé</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(achat.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
