import { useState } from "react";
import {useAdherents}  from "../data/databese";
export default function Members({members,setMembers,showToast,books}){
  const {addAdherent, updateAdherent, deleteAdherent } = useAdherents();
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [sel,setSel]=useState(null);
  const [form,setForm]=useState({nom:"",livre:"",email:"",phone:"",datadahestion:"",status:'--'});
  const filtered=members?.filter(m=>
    {const q=search.toLowerCase();return!q||m.nom.toLowerCase().includes(q)||m.email.toLowerCase().includes(q)});
  const close=()=>{setModal(null);setSel(null)};
  const openAdd=()=>{setForm({nom:"",livre:"",email:"",phone:"",datadahestion:"",status: '--'});setModal("add")};
  const openEdit=m=>{setSel(m);setForm({...m});setModal("edit")};
  const openDel=m=>{setSel(m);setModal("del")};
   const save=()=>{
    if(!form.nom||!form.email){showToast("Nom et email requis","error");return}
    if(modal==="add"){
      setMembers(p=>[...p,{...form,id:Date.now(),datadahestion:new Date().toISOString().split("T")[0]}]);
      addAdherent(form);
      showToast("Adhérent ajouté","success");
     
    } else {
      setMembers(p=>p.map(m=>m.id===sel.id?{...m,...form}:m));
      showToast("Adhérent mis à jour","success");
      updateAdherent(sel.id,form);
    }
    close();
  };
  const del=()=>{setMembers(p=>p.filter(m=>m.id!==sel.id));showToast("Adhérent supprimé","success");close()};
  console.log(filtered)
  return (
    <div>
      <div className="t-card">
        <div className="t-head">
          <h2>👥 Gestion des Adhérents</h2>
          <div className="search-row">
            <input className="si" placeholder="Nom, email…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <button className="btn-add" onClick={openAdd}>+ Ajouter</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nom complet</th>
              {/* <th>Livre</th> */}
              <th>Email</th>
              <th>Téléphone</th>
              <th>Date d'adhésion</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0?(
            <tr>
              <td colSpan="6">
                <div className="empty">
                <div className="ei">👤</div>
                <p>Aucun adhérent</p>
                </div>
              </td>
            </tr>):
            filtered.map(m=>(
              <tr key={m.id}>
                <td><strong>{m.nom}</strong></td>
                {/* <td><strong>{m.livre}</strong></td> */}
                <td>{m.email}</td><td>{m.phone}</td>
                <td>{m.datadahestion}</td>
                <td><span className={`badge ${m.status=== "active"?"b-active":m.status === "inactive"?"b-borrow":m.status === "suspended"?"b-suspended":"b-active"}`}>{
                    // m.status === "active" ? "Active" : m.status === "inactive" ? "Inactive" : m.status === "suspended" ? "Emprunt en cours" :  "Active"
                    m.status
                }</span></td>
                <td>
                  <div className="row-acts">
                    <button className="bi bi-e" onClick={()=>{openEdit(m)}}>✏️</button>
                    <button className="bi bi-d" onClick={()=>{openDel(m);deleteAdherent(m.id)}}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==="add"||modal==="edit")&&(
        <div className="overlay" onClick={close}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-h">
              <h3>{modal==="add"?"Ajouter un Adhérent":"Modifier l'Adhérent"}</h3>
              <button className="btn-x" onClick={close}>✕</button>
            </div>
            {[["nom","Nom complet *"],["email","Email *"],["phone","Téléphone"],["datadahestion","Date d'adhésion"]].map(([f,l])=>(
              <div key={f} className="form-group">
                <label>{l}</label>
                <input type={f==="email"?"email":f==="datadahestion"?"date":"text"} value={form[f]||""} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))}/>
                </div>
            ))}
            <div className="form-group">
              <label>livre</label>
              <select value={form.livre} onChange={e=>setForm(p=>({...p,livre:e.target.value}))}>
                {books.map((b)=><option value={b.title}>{b.title}</option>)}
              </select>
            </div>
            {/* <div className="form-group">
              <label>Statut</label>
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Emprunt en cours</option>
              </select>
            </div> */}
            <div className="modal-f">
              <button className="btn-sec" onClick={close}>Annuler</button>
              <button className="btn-sub" onClick={save}>{modal==="add"?"Ajouter":"Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}
      {modal==="del"&&(
        <div className="overlay" onClick={close}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-h">
              <h3>Supprimer l'Adhérent</h3>
            <button className="btn-x" onClick={close}>✕</button>
            </div>
            <p className="confirm-txt">Supprimer <strong>"{sel?.nom}"</strong> ?</p>
            <div className="modal-f">
              <button className="btn-sec" onClick={close}>Annuler</button>
              <button className="btn-del" onClick={del}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
