// import { useEffect, useState } from "react";
// import { useAchats } from "../data/dataAchats";
import "../css/Achats.css";
// export default function Achats({loans, setLoans, books, setBooks, members, showToast}) {
//   const { fetchAchats, updateAchat, deleteAchat } = useAchats();
//   const [achats, setAchats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Charger les achats au montage
//   useEffect(() => {
//     const loadAchats = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchAchats();
//         setAchats(data || []);
//       } catch (err) {
//         setError("Erreur lors du chargement des achats");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAchats();
//   }, []);

//   // Gérer la mise à jour du statut
//   const handleUpdateStatus = async (id, newStatus, newStatusPaye) => {
//     try {
//       await updateAchat(id, {
//         status: newStatus,
//         status_paye: newStatusPaye,
//       });
//       // Recharger les achats
//       const data = await fetchAchats();
//       setAchats(data || []);
//     } catch (err) {
//       setError("Erreur lors de la mise à jour");
//       console.error(err);
//     }
//   };

//   // Gérer la suppression
//   const handleDelete = async (id) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet achat ?")) {
//       try {
//         const success = await deleteAchat(id);
//         if (success) {
//           setAchats(achats.filter(a => a.id !== id));
//         }
//       } catch (err) {
//         setError("Erreur lors de la suppression");
//         console.error(err);
//       }
//     }
//   };

//   if (loading) return <div className="achats-container"><p>Chargement des achats...</p></div>;
//   if (error) return <div className="achats-container error"><p>{error}</p></div>;

//   return (
//     <div className="achats-container">
//       <h2>Gestion des Achats</h2>
//       {achats.length === 0 ? (
//         <p>Aucun achat trouvé.</p>
//       ) : (
//         <table className="achats-table">
//           <thead>
//             <tr>
//               {/* <th>ID</th> */}
//               <th>Utilisateur</th>
//               <th>Livre</th>
//               <th>Date d'achat</th>
//               <th>Statut</th>
//               <th>Paiement</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {achats.map(achat => (
//               <tr key={achat.id}>
//                 {/* <td>{achat.id}</td> */}
//                 <td>{achat.user?.name || "N/A"}</td>
//                 <td>{achat.livre?.titre || "N/A"}</td>
//                 <td>{achat.date_achat || "N/A"}</td>
//                 <td>
//                   <select
//                     value={achat.status}
//                     onChange={(e) =>
//                       handleUpdateStatus(achat.id, e.target.value, achat.status_paye)
//                     }
//                   >
//                     <option value="En attente">En attente</option>
//                     <option value="Confirmé">Confirmé</option>
//                     <option value="Livré">Livré</option>
//                     <option value="Annulé">Annulé</option>
//                   </select>
//                 </td>
//                 <td>
//                   <select
//                     value={achat.status_paye}
//                     onChange={(e) =>
//                       handleUpdateStatus(achat.id, achat.status, e.target.value)
//                     }
//                   >
//                     <option value="Non payé">Non payé</option>
//                     <option value="Payé">Payé</option>
//                     <option value="Remboursé">Remboursé</option>
//                   </select>
//                 </td>
//                 <td>
//                   <button
//                     className="btn-delete"
//                     onClick={() => handleDelete(achat.id)}
//                   >
//                     Supprimer
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useAchats } from "../data/dataAchats";

const STATUTS = ["En attente", "Confirmé", "Livré", "Annulé"];
const PAIEMENTS = ["Non payé", "Payé", "Remboursé"];
const TYPES_LIVRE = ["PDF", "Physique"];

const initialForm = {
  user_id: "", 
  livre_id: "",
  date_achat: "",
  // type_livre: "Physique",
  status: "Livre Physique",
  status_paye: "La demande est complète",

};

export default function Achats({ loans, setLoans, books, setBooks, members, showToast }) {
  const { fetchAchats, addAchat, updateAchat, deleteAchat } = useAchats();
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filter/search state
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterTypeLivre, setFilterTypeLivre] = useState("");

  // ---------- Chargement ----------
  useEffect(() => {
    loadAchats();
  }, []);

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

  // ---------- Formulaire ----------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // if (name === "type_livre") {
      //   updated.status = value === "PDF" ? "Confirmé" : "En attente";
      // }
      return updated;
    });
  };
  console.log(form)
  const handleAddAchat = async () => {
    if (!form.livre_id) {
      setError("Veuillez renseigner l'utilisateur et le livre.");
      return;
    }
    try {
      setFormLoading(true);
      await addAchat(form);
      setForm(initialForm);
      setShowForm(false);
      await loadAchats();
      showToast?.("Achat ajouté avec succès");
    } catch (err) {
      setError("Erreur lors de l'ajout de l'achat");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setForm(initialForm);
    setShowForm(false);
    setError(null);
  };

  // ---------- Mise à jour statut / paiement ----------
  const handleUpdateStatus = async (id, newStatus, newStatusPaye) => {
    try {
      await updateAchat(id, { status: newStatus, status_paye: newStatusPaye });
      setAchats((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: newStatus, status_paye: newStatusPaye } : a
        )
      );
    } catch (err) {
      setError("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  const handleConfirmer = (achat) =>
    handleUpdateStatus(achat.id, "Confirmé", achat.status_paye);

  const handleAnnuler = (achat) =>
    handleUpdateStatus(achat.id, "Annulé", achat.status_paye);

  // ---------- Suppression ----------
  const handleDelete = async (id) => {
    //  console.log(id)
    // if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet achat ?")) return;
    try {
      const success = await deleteAchat(id);
      if (success) setAchats((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    }
  };

  // ---------- Filtrage (3 conditions indépendantes) ----------
  const achatsFiltres = achats.filter((a) => {
    const q = search.toLowerCase();
    
    const matchSearch =
      !q ||
      (a.user?.name || "").toLowerCase().includes(q) ||
      (a.livre?.titre || a.titre || "").toLowerCase().includes(q);

    const matchStatut = !filterStatut || a.status === filterStatut;

    const matchType = !filterTypeLivre || a.type_livre === filterTypeLivre;

    return matchSearch && matchStatut && matchType;
  });
  // ---------- Rendu ----------
  if (loading) return <div className="achats-container"><p>Chargement des achats...</p></div>;

  return (
    <div className="achats-container">
      {/* ── Header ── */}
      <div className="achats-header">
        <h2>Gestion des Achats</h2>
        <button
          className="btn-toggle-form"
          onClick={() => { setShowForm((v) => !v); setError(null); }}
        >
          {showForm ? "✕ Fermer" : "+ Nouvel Achat"}
        </button>
      </div>

      {error && (
        <div className="achats-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* ── Formulaire d'ajout (toggle) ── */}
      {showForm && (
        <div className="achats-form-card">
          <h3>Nouvel Achat</h3>
          <div className="achats-form-grid">
            {/* <div className="form-group">
              <label>Utilisateur</label>
              <input
                type="text"
                name="user"
                value={form.user}
                onChange={handleFormChange}
                placeholder="Nom d'utilisateur"
              />
            </div> */}
            <div className="form-group">
              <label>Titre du Livre</label>
              {/* <input
                type="text"
                name="titre"
                value={form.titre}
                onChange={handleFormChange}
                placeholder="Titre du livre"
              /> */}
               <select name="livre_id" value={form.livre_id} onChange={handleFormChange}>
                {books.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date d'Achat</label>
              <input
                type="date"
                name="date_achat"
                value={form.date_achat}
                onChange={handleFormChange}
              />
            </div>
            {/* <div className="form-group">
              <label>Type Livre</label>
              <select name="type_livre" value={form.type_livre} onChange={handleFormChange}>
                {TYPES_LIVRE.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div> */}
            {/* <div className="form-group">
              <label>Statut</label>
              <select name="status" value={form.status} onChange={handleFormChange}>
                {STATUTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Paiement</label>
              <select name="status_paye" value={form.status_paye} onChange={handleFormChange}>
                {PAIEMENTS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div> */}
          </div>
          <div className="form-actions-row">
            <button
              className="btn-add-achat"
              onClick={handleAddAchat}
              disabled={formLoading}
            >
              {formLoading ? "Ajout en cours…" : "Ajouter"}
            </button>
            <button className="btn-cancel-form" onClick={handleCancelForm}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ── Barre de recherche / filtres ── */}
      <div className="achats-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher par utilisateur ou titre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterTypeLivre}
          onChange={(e) => setFilterTypeLivre(e.target.value)}
        >
          <option value="">Tous les types</option>
          {TYPES_LIVRE.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      {achatsFiltres.length === 0 ? (
        <p className="achats-empty">Aucun achat trouvé.</p>
      ) : (
        <table className="achats-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Livre</th>
              <th>Date d'achat</th>
              {/* <th>Type Livre</th> */}
              <th>Statut</th>
              <th>Paiement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {achatsFiltres.map((achat) => {
                //  console.log(achat.id)
              const defaultStatus = achat.type_livre === "PDF" ? "Confirmé" : "En attente";
              const displayStatus = achat.status || defaultStatus;
              const title = books.find((b) => b.id === achat.livre_id)?.title || achat.livre?.titre || "N/A";
              return (
                <tr key={achat.id}>
                  <td>{achat.user?.name || "N/A"}</td>
                  <td>{title}</td>
                  <td>{achat.date_achat || "N/A"}</td>
                  <td>{achat.status || "N/A"}</td>
                   <td>{achat.status_paye || "N/A"}</td>
                  {/* Type Livre */}
                  {/* <td>
                    <span className={`badge-type ${achat.type_livre === "PDF" ? "badge-pdf" : "badge-physique"}`}>
                      {achat.type_livre || "N/A"}
                    </span>
                  </td> */}

                  {/* Statut (select) */}
                  {/* <td>
                    <select
                      value={displayStatus}
                      onChange={(e) =>
                        handleUpdateStatus(achat.id, e.target.value, achat.status_paye)
                      }
                    >
                      {STATUTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td> */}

                  {/* Paiement (select) */}
                  {/* <td>
                    <select
                      value={achat.status_paye}
                      onChange={(e) =>
                        handleUpdateStatus(achat.id, achat.status, e.target.value)
                      }
                    >
                      {PAIEMENTS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </td> */}

                  {/* Actions */}
                  <td className="achats-actions">
                    {achat.type_livre === "Physique" && (
                      <>
                        <button
                          className="btn-confirm"
                          onClick={() => handleConfirmer(achat)}
                          disabled={achat.status === "Confirmé"}
                        >
                          Confirmer
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => handleAnnuler(achat)}
                          disabled={achat.status === "Annulé"}
                        >
                          Annuler
                        </button>
                      </>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(achat.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}