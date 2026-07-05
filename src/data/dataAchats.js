import { useEffect } from "react";
import axios from "../api/axois";
import { useDispatch } from "react-redux";

const apiAchats = "/acheter";

export function useAchats() {
  const dispatch = useDispatch();

  // ── FETCH ──────────────────────────────────────────────────────────────
  const fetchAchats = async () => {
    try {
      const res = await axios.get(apiAchats);

      // Le backend renvoie { id, user_id, livre_id, date_achat, status, status_paye, user:{...}, livre:{...} }
      const mapped = res.data.map(achat => ({
        id           : achat.id,
        user_id      : achat.user_id ?? null,
        livre_id     : achat.livre_id ?? null,
        date_achat   : achat.date_achat ?? null,
        status       : achat.status ?? "En attente",
        status_paye  : achat.status_paye ?? "Non payé",
        type_livre   : achat.type_livre  
        // Relations eager-loaded depuis Laravel with(['user','livre'])
        // user         : achat.user ?? null,
        // livre        : achat.livre ?? null,
      }));

      return mapped;
    } catch (err) {
      console.error("Fetch achats error:", err);
      return [];
    }
  };

  // ── ADD ────────────────────────────────────────────────────────────────
  const addAchat = async (form) => {
    try {
      const payload = {
        user_id     : form.user_id,
        livre_id    : form.livre_id,
        date_achat  : form.date_achat || new Date().toISOString().split('T')[0],
        status      : form.status || "Physique",
        status_paye : form.status_paye || "Non payé",
        // type_livre : form.type_livre || "Physique",

      };
      const res = await axios.post(apiAchats, payload);
      return res.data;
    } catch (err) {
      console.error("Erreur add achat:", err.response?.data || err);
    }
  };

  // ── UPDATE ────────────────────────────────────────────────────────────
  const updateAchat = async (id, form) => {
    try {
      const payload = {
        status      : form.status,
        status_paye : form.status_paye,
      };
      const res = await axios.put(`${apiAchats}/${id}`, payload);
      return res.data;
    } catch (err) {
      console.error("Erreur update achat:", err.response?.data || err);
    }
  };

  // ── DELETE ────────────────────────────────────────────────────────────
  const deleteAchat = async (id) => {
    try {
      await axios.delete(`${apiAchats}/${id}`);
      return true;
    } catch (err) {
      console.error("Erreur delete achat:", err.response?.data || err);
      return false;
    }
  };

  // ── PAYMENT ────────────────────────────────────────────────────────────
  const processPayment = async (id, paymentForm) => {
    try {
      const payload = {
        cardName   : paymentForm.cardName,
        cardNumber : paymentForm.cardNumber,
        expiry     : paymentForm.expiry,
        cvv        : paymentForm.cvv,
      };
      const res = await axios.post(`${apiAchats}/${id}/payment`, payload);
      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      console.error("Erreur paiement:", err.response?.data || err);
      return {
        success: false,
        error: err.response?.data?.message || "Erreur lors du paiement",
      };
    }
  };

  return {
    fetchAchats,
    addAchat,
    updateAchat,
    deleteAchat,
    processPayment,
  };
}
