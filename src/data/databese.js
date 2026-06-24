import { useEffect, useState } from "react";
import axios  from "../api/axois";
import { SetUpdateStu,ClearUpdateStu,SetLoans }   from '../app/redux/emruntsSlice';
import { useDispatch } from 'react-redux';
import  { useBlackliste } from "./dataBlackliste";
export  const CATS = ["Roman","Science","Histoire","Informatique","Philosophie","Art","Jeunesse","Biographie"];
export default function useBooks() {
  const [book, setBooks] = useState([]);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/livres");

        // const mapped = res.data.map(b => ({
        //   id: b.id,
        //   titre: b.titre ?? "",
        //   auteur: b.auteur ?? "",
        //   isbn: b.isbn ?? "",
        //   categorie: b.categorie ?? "",
        //   annee: b.annee ?? "",
        //   qte: Number(b.qte) || 0,
        //   disponibilite: Number(b.disponibilite) || 0,
        //   status: b.status ?? ""
        // }));

        setBooks(res.data.livres);
        // console.log(res.data.livres);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchBooks();
  }, []);


  // ➕ ADD
   const addBook = async (form) => {
    const payload = {
      titre: form.titre || '--',
      auteur: form.auteur|| '--',
      isbn: form.isbn|| '--',
      categorie: form.categorie|| '--',
      annee: form.annee|| '--',
      qte: form.qte|| 0,
      disponibilite: form.disponibilite|| 0,
      status: form.status 
    };
    const res = await axios.post(
      "/livres",
      payload
    );

    setBooks(prev => [...prev, res.data]);
  };

  // ✏️ UPDATE
  const updateBook = async (id, form) => {
  try {
    const res = await axios.put(
      `/livres/${id}`,
      {
        titre: form.titre,
        auteur: form.auteur,
        isbn: form.isbn,
        categorie: form.categorie,
        annee: form.annee ? Number(form.annee) : null,
        qte: Number(form.qte),
        disponibilite: Number(form.disponibilite),
        status: form.status 

      }
    );

    // ✅ Update state avec la réponse du backend
    setBooks(prev =>
      prev.map(b =>
        b.id === id ? res.data : b
      )
    );
  } catch (err) {
    console.error("Erreur update livre :", err.response?.data || err);
  }
  };

  // 🗑️ DELETE
  const deleteBook = async (id) => {
  try {
    await axios.delete(`/livres/${id}`);

    setBooks(prev => prev.filter(b => b.id !== id));
   } catch (err) {
     console.error(err.response?.data || err.message);
  }
};

  return { book, addBook, updateBook, deleteBook };
};
//===================================== function Adherents=======================================
export   function useAdherents() {
  const [Adherent, setAdherent] = useState([]);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/adherents");
       
        setAdherent(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchBooks();
  }, []);
 

  // ➕ ADD
   const addAdherent = async (form) => {
    try{
    const res = await axios.post(
      "/adherents",
      {
      nom: form.nom,
      email: form.email,
      phone: form.phone,
      datadahestion:  new Date().toISOString().split('T')[0],
      status: form.status 
      });
      
    setAdherent(prev => [...prev, res.data]);
    }catch(err){
          console.error("Erreur add adherent :", err.response?.data || err);
      //  console.log('Status:', error.response.status);
      //  console.log('Error data:', error.response.data);  
      //  console.log('Headers:', error.response.headers);
    }
  };

  // ✏️ UPDATE
  const updateAdherent = async (id, form) => {
  try {
    console.log(form)
    const res = await axios.put(
      `/adherents/${id}`,
      {
        nom: form.nom,
        email: form.email,
        phone: form.phone,
        datadahestion:  new Date().toISOString().split('T')[0],
        status: form.status ,
        // retard:form.retard
 
      }
    );

    // ✅ Update state avec la réponse du backend
    setAdherent(prev =>
      prev.map(b =>
        b.id === id ? res.data : b
      )
    );
  } catch (err) {
    console.error("Erreur update adherent :", err.response?.data || err);
  }
  };

  // 🗑️ DELETE
  const deleteAdherent = async (id) => {
  try {
    await axios.delete(`/adherents/${id}`);

    setAdherent(prev => prev.filter(b => b.id !== id));
   } catch (err) {
     console.error(err.response?.data || err.message);
  }
};
  return { Adherent, addAdherent, updateAdherent, deleteAdherent };
}
//==================================function useEmprunts ===========================================
const apiEmprunts = "/emprunts";
export function useEmprunts() {
  const {checkBlackliste} = useBlackliste()
  const [emprunts, setEmprunts] = useState([]);
  const dispatch = useDispatch();

  const fetchEmprunts = async () => {
    try {
      const res = await axios.get(apiEmprunts);
      const mapped = res.data.map(b => ({
        id: b.id,
        adherent_id: b.user_id ?? null,
        livre_id: b.livre_id ?? null,
        date_emprunt: b.date_emprunt ?? '',
        date_retour_prevue: b.date_retour_prevue ?? "",
        date_retour_effective: b.date_retour_effective ?? null,
        status: b.status ?? "",
        retard: b.retard ?? ""
      }));
      setEmprunts(mapped);
      dispatch(SetLoans(mapped));
      mapped.map((f) => checkdate(f.id, f.date_retour_prevue, f.date_emprunt));

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEmprunts();
  }, []);

  // ➕ ADD (Corrigé pour renvoyer la donnée de la DB avec le vrai ID)
  const addEmprunts = async (form) => {
    try {
      const payload = {
        livre_id: Number(form.livre_id),
        user_id: Number(form.adherent_id),
        date_emprunt: form.date_emprunt ?? '',
        date_retour_prevue: form.date_retour_prevue ?? "",
       };
      const res = await axios.post(apiEmprunts, payload);
      setEmprunts(prev => [...prev, res.data]); 
      fetchEmprunts()
      await checkdate(res.data.id, form.date_retour_prevue, form.date_emprunt)
      return res.data; // TRÈS IMPORTANT : On retourne l'objet avec l'ID généré par Laravel
    } catch (err) {
      console.error("Erreur add emprunt :", err.response?.data || err);
    }
  };

  // ✏️ UPDATE
  const updateEmprunts = async (id, form) => {
    try {
      const res = await axios.put(`${apiEmprunts}/${id}`, form);
      setEmprunts(prev => prev.map(b => b.id === id ? res.data : b));
      await checkdate(res.data.id, form.date_retour_prevue, form.date_emprunt)
    fetchEmprunts()
    } catch (err) {
      console.error("Erreur update emprunt :", err.response?.data || err);
    }
  };

  // 🗑️ DELETE
  const deleteEmprunts = async (id) => {
    try {
      await axios.delete(`${apiEmprunts}/${id}`);
      setEmprunts(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // chekdate
  const checkdate = async (id, date_retour_prevue, date_emprunt,adherent_id,status) => {
    console.log(id, date_retour_prevue, date_emprunt, adherent_id, status)
    try {
      const res = await axios.post('/emprunts/check', {
        id: id,
        date_retour_prevue: date_retour_prevue,
        date_emprunt: date_emprunt,
        status: status,
      });
      // dispatch(ClearUpdateStu());
      dispatch(SetUpdateStu(res.data));
      checkBlackliste(adherent_id)
    } catch (err) {
      console.error(err);
    }
  };

  return { emprunts, checkdate, fetchEmprunts, addEmprunts, updateEmprunts, deleteEmprunts };
}
 