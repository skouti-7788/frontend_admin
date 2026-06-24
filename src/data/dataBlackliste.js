import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setBlacklistes } from "../app/redux/blacklistesSlice";

const apiBlacklistes = "/blacklistes";

export function useBlackliste() {
  const dispatch = useDispatch();

  // ── FETCH ──────────────────────────────────────────────────────────────
  const fetchBlacklistes = async () => {
    try {
      const res = await axios.get(apiBlacklistes);

      // Le backend renvoie { id, emprunt_id, adherent_id, status, emprunt:{...}, adherent:{...} }
      const mapped = res.data.map(b => ({
        id          : b.id,
        emprunt_id  : b.emprunt_id  ?? null,
        adherent_id : b.adherent_id ?? null,
        status      : b.status      ?? "Bloqué",
        // Relations eager-loaded depuis Laravel with(['emprunt','adherent'])
        emprunt     : b.emprunt     ?? null,
        adherent    : b.adherent    ?? null,
      }));

      dispatch(setBlacklistes(mapped));
    } catch (err) {
      console.error("Fetch blackliste error:", err);
    }
  };

  useEffect(() => {
    fetchBlacklistes();
  }, []);

  // ── ADD ────────────────────────────────────────────────────────────────
  const addBlackliste = async (form) => {
    try {
      const payload = {
        emprunt_id  : form.emprunt_id,
        adherent_id : form.adherent_id,
        // status optionnel, défaut "Bloqué" côté backend
      };
      const res = await axios.post(apiBlacklistes, payload);
      await fetchBlacklistes(); // Reload pour avoir les relations eager-loaded
      return res.data;
    } catch (err) {
      console.error("Erreur add blackliste:", err.response?.data || err);
    }
  };

  // ── UPDATE (changer status: Bloqué ↔ Levé) ────────────────────────────
  const updateBlackliste = async (id, form) => {
    try {
      const res = await axios.put(`${apiBlacklistes}/${id}`, form);
      await fetchBlacklistes();
      return res.data;
    } catch (err) {
      console.error("Erreur update blackliste:", err.response?.data || err);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────────────────
  const deleteBlackliste = async (id) => {
    try {
      await axios.delete(`${apiBlacklistes}/${id}`);
      await fetchBlacklistes();
    } catch (err) {
      console.error("Erreur delete blackliste:", err.response?.data || err.message);
    }
  };

  // ── CHECK (vérifie si un adhérent est bloqué) ──────────────────────────
  // Le backend attend: { adherent_id }  →  renvoie { blocked, message, emprunts_retard }
  const checkBlackliste = async (adherent_id) => {
    try {
      const res = await axios.get(`${apiBlacklistes}/check`, {
        params: { adherent_id }
      });
      return res.data; // { blocked: true/false, message, emprunts_retard: [] }
    } catch (err) {
      console.error("Erreur check blackliste:", err.response?.data || err);
      return null;
    }
  };

  return {
    fetchBlacklistes,
    addBlackliste,
    updateBlackliste,
    deleteBlackliste,
    // checkBlackliste,
  };
}