  import { useState, useEffect } from "react";
  import { useEmprunts } from "../data/databese";
  import axios from "../api/axois";
  import { useDispatch, useSelector } from "react-redux";
  import { SetUpdateStu } from "../app/redux/emruntsSlice";
import { useBlackliste } from "../data/dataBlackliste";
  export default function Loans({ loans, setLoans,setMembers, books, setBooks, members, showToast }) {
    const {fetchEmprunts, addEmprunts, updateEmprunts, deleteEmprunts } = useEmprunts();
    const {checkBlackliste} = useBlackliste()
    const [showadd,setShowAdd] = useState(false);
    const [idDel,setIdDel] = useState('')
    const [searsh,setSearsh] = useState('');
    const [okDel,setOkDel] = useState(false);
    const [update,setUpdate] = useState({});
    const [adherentId,setAdherentId] = useState(null);
    const setUpdateStu = useSelector((state) => state.emprunt.setUpdateStu);
    const reduxloans = useSelector((state) => state.emprunt.loans);

    const dispatch = useDispatch();
    // const [updateStau,setUpdateStu] = useState({})
    // const [sta,setSta] = useState(false)
    // console.log(updateStau)
    const { checkdate} = useEmprunts()
    const [form,setForm] = useState(
          { 
            livre_id:null,
            adherent_id:null,
            date_emprunt:'',
            date_retour_prevue:'',
            date_retour_effective: null,
          
          })
          //  console.log(update.retard)
  
    const hendleAdd = ()=>{
          addEmprunts(form)
          setLoans([...loans,form])
        
    }
   
     
    const verifidate = loans.filter((l)=> new Date() > new Date(l.date_retour_prevue)&&!['retard','Retourner'].includes(l.status)) || false
    console.log(verifidate) 
    console.log(loans)
    useEffect(()=>{
    if(verifidate.length > 0 ){
      verifidate?.map((l)=> 
      checkdate(l.id,l.date_retour_prevue,l.date_emprunt,l.adherent_id),
     
    );
      
    }
      // fetchEmprunts()
    },[loans,verifidate]) 
  
    const dateretard = (date_retour_prevue)=>{
          const retour_prevue = new Date(date_retour_prevue);
          const today = new Date();
          const retar = retour_prevue - today;
          const retardday = Math.ceil(retar/(1000 * 60 * 60 * 24));
          return {today,retardday}
    }
    const retourner = (id,l)=>{
        //  console.log(l)
          const {today,retardday} = dateretard(l.date_retour_prevue)
          setUpdate({
          id:id,
          livre_id:l.livre_id,
          user_id:l.adherent_id,
          date_emprunt:l.date_emprunt,
          date_retour_prevue:l.date_retour_prevue,
          date_retour_effective:today.toISOString().slice(0, 10),
          status:'Retourner',
          retard:retardday 
          })
          checkdate(id,l.date_retour_prevue,l.date_emprunt,l.adherent_id,'Retourner')

          setLoans(loans.map((l)=> l.id ===id ? {...l, date_retour_effective: new Date().toISOString().slice(0, 10)
                    ,status:'Retourner',retard:retardday}:l))
    }
    useEffect(()=>{
          if(update && update.id){updateEmprunts(update.id,update)} 
          },[update])
    const hendledelete = (id)=>{
          setOkDel(true);
          setIdDel(id)
    }
    const okDelete = ()=>{
          deleteEmprunts(idDel);
          setLoans(loans.filter((l)=>l.id !== idDel));
          setOkDel(false)
    }
    // const filterSearsh = loans.filter((l)=> l.adherent.toLowerCase().includes(searsh) || l.livre.toLowerCase().includes(searsh))
    // console.log(filterSearsh)
    // Calcule les données filtrées ET le statut en temps réel
    const filterSearsh = loans.map(l => {
        if (l.status === 'Retourner') return l;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // On remet à zéro pour comparer les jours
    const datePrevue = new Date(l.date_retour_prevue);
    datePrevue.setHours(0, 0, 0, 0);

    const isLate = today > datePrevue;
    const isToday = today.getTime() === datePrevue.getTime();
     
    const { retardday } = dateretard(l.date_retour_prevue);
    
    return {
        ...l,
        status: isLate ? 'retard' : (isToday ? 'Retourner' : 'active'),
        retard: isLate ? Math.abs(retardday) : 0,
    }
    }).filter(l => { 
        
        const member = members.find(m => m.id === l.adherent_id);
        const adherent = member ? member.nom : "Unknown";      
       return (
      adherent.toLowerCase().includes(searsh.toLowerCase()) || 
      l.livre.toLowerCase().includes(searsh.toLowerCase())
    )});
    useEffect(() => {
     fetchEmprunts();
    }, []);
    return (
      <div>
        {/* ── Card ── */}
        <div className="t-card">

          {/* Header */}
          <div className="t-head">
            <h2>📤 Gestion des Emprunts</h2>
            <div className="search-row">
              <input
                value={searsh}
                onChange={(e)=>setSearsh(e.target.value)}
                className="si"
                placeholder="Titre, adhérent…"
              />
              <button className="btn-add" onClick={()=> setShowAdd(true)} >+ Nouvel Emprunt</button>
            </div>
          </div>

          {/* Table */}
          <table>
            <thead>
              <tr>
                <th>Livre</th>
                <th>Adhérent</th>
                <th>Date Emprunt</th>
                <th>Retour Prévu</th>
                <th>Retour Effectif</th>
                <th>Retard</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                {filterSearsh.length === 0?(<tr>
                  <td colSpan="8">
                    <div className="empty">
                      <div className="ei">📋</div>
                      <p>Aucun emprunt</p>
                    </div>
                  </td>
                </tr>):(
              
                    filterSearsh.map((l)=>{ 
                      const livre = books.find(b => b.id === l.livre_id);
                      const member = members.find(m => m.id === l.adherent_id || m.user_id === l.user_id);
                      const adherent = member ? member.nom : "Unknown";
                      return(<tr  key={l.id}>
                      <td><strong>{livre ? livre.title : "Unknown"}</strong></td>
                      <td> {adherent}</td>
                      <td>{l.date_emprunt} </td>
                      <td>{l.date_retour_prevue} </td>
                      <td>{ l.status === 'Retourner' ? new Date().toISOString().slice(0, 10) : l.date_retour_effective || "--"}</td>
                      <td>{l.retard } Jour</td>
                      <td>
                        <span className={`badge ${
                          l.status === "active" ? "b-active" :
                          l.status === "retard" ? "b-over" : "b-ret"
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-acts">
                            {l.status !== 'Retourner'&&
                              <p
                              className="bi bi-r" title="Retourner" onClick={()=>{retourner(l.id,l)}} >
                              ↩️
                            </p>}
                          <p className="bi bi-d" onClick={()=>hendledelete(l.id)} >🗑️</p>
                        </div>
                      </td>
                    </tr>)}))}
                  
            </tbody>
          </table>
        </div>

        {/* ── Add Modal ── */}
          {showadd &&<div className="overlay"  >
            <div className="modal"  >

              <div className="modal-h">
                <h3>Nouvel Emprunt</h3>
                <button className="btn-x" onClick={()=> setShowAdd(false)}>✕</button>
              </div>

              <div className="form-group">
                <label>Livre </label>
                <select
                    value={form.livre_id}
                    onChange={(e)=> setForm({...form,livre_id:e.target.value})}
                >
                  <option value="">-- Sélectionner --</option>
                    {books.map((b)=>
                      loans.find((l)=>l.livre_id === b.id)?'':<option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Adhérent </label>
               <select
                  value={form.adherent_id}
                  onChange={(e)=> setForm({...form, adherent_id: e.target.value})}
                >
                  <option value="">-- Sélectionner --</option>

                  {members.map((m)=>(
                    loans.find((l)=> l.adherent_id === m.id) ? null :
                    <option key={m.id} value={m.id}>
                      {m.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid2">
                <div className="form-group">
                  <label>Date d'emprunt</label>
                  <input
                    value={form.date_emprunt}
                    onChange={(e)=> setForm({...form,date_emprunt:e.target.value})}
                    type="date"
                  />
                </div>
                <div className="form-group">
                  <label>Retour prévu</label>
                  <input 
                    value={form.date_retour_prevue}
                    onChange={(e)=> setForm({...form,date_retour_prevue:e.target.value})}
                    type="date"
                  />
                </div>
              </div>

              <div className="modal-f">
                <button className="btn-sec" onClick={()=> setShowAdd(false)}>Annuler</button>
                <button className="btn-sub" onClick={hendleAdd} >Enregistrer</button>
              </div>

            </div>
          </div>}
  
        {/* ── Delete Modal ── */}
          {okDel&&<div className="overlay"  >
            <div className="modal"  >

              <div className="modal-h">
                <h3>Supprimer l'Emprunt</h3>
                <button className="btn-x" onClick={()=>setOkDel(false)}>✕</button>
              </div>

              <p className="confirm-txt">
                Supprimer cet emprunt ? Si non retourné, le livre sera remis en disponibilité.
              </p>

              <div className="modal-f">
                <button className="btn-sec" onClick={()=>setOkDel(false)} >Annuler</button>
                <button className="btn-del"onClick={okDelete}  >Supprimer</button>
              </div>

            </div> 
          </div> }
      </div>
    );
  }