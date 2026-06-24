import { useState } from "react";
import useBooks,{ CATS } from "../data/databese";
export default function Books({books,setBooks,showToast}){
  const {addBook,updateBook,deleteBook} = useBooks();
  const [showBooks,setShowBooks] = useState(false);
  const [searsh,setSearsh] = useState('');
  const [up,setUp] = useState(false)
  const [idBook,setIdBook] = useState(null)
  const [page,setPage]=useState(1);
  const [form,setForm] = useState({
        titre:'',
        auteur:'',
        categorie:'',
        annee:'',
        pages:'',
        fileSize:'',
        extension:'',
        book_rank:'',
        showLiver:'',
        prix:'',
        qte:0,
        status:''
  });
  const [update,setUpdate] = useState({});
  const [showSupr,setShowSupr] = useState(false);
  const [idDel,setIdDel] = useState(null)
  const [statusSearch,setStatusSearch] = useState('')
  const [categorie,setCategorie] = useState('')
  const hendleAdd = ()=>{
        addBook(form)
        setBooks([...books,form])
  }
  const hendleDelete = (id)=>{
       setShowSupr(true)
       setIdDel(id)
  }
  const okDelete =()=>{
        deleteBook(idDel)
        setBooks(books.filter((b)=> b.id !== idDel))
        setShowSupr(false)
        alert('Supprimer avec succes')
  }

  const hendleUpdate =(id,book)=>{
        setIdBook(id);
        setUpdate({
        titre:book.titre,
        auteur:book.auteur,
        categorie:book.categorie,
        annee:book.annee,
        pages:book.pages,
        fileSize:book.fileSize,
        extension:book.extension,
        book_rank:book.book_rank,
        showLiver:book.showLiver,
        prix:book.prix,
        qte:book.qte,
        status:book.status
        })
        setUp(true)
        setShowBooks(true)
  }
  const saveUpdate =()=>{
        updateBook(idBook,update)
        setBooks(books.map((b)=>b.id === idBook?  update:b));
  }
  const filterBooks = books.filter((b)=> (b.title.toLowerCase().includes(searsh.toLocaleLowerCase()) || b.author.toLowerCase().includes(searsh.toLocaleLowerCase()))
        && (b.category === categorie || categorie === '') && (b.status === statusSearch || statusSearch === ''));
  const bookCategorie = [...new Set(books.map((b)=> b.category))]
  const pages=Math.ceil(filterBooks.length/5);
  const pageNext = filterBooks.slice((page-1)*5,page*5);
  return (
    <div>
      <div className="t-card">
        <div className="t-head">
          <h2>📚 Catalogue des Livres</h2>
          <div className="search-row">
            <input
            value={searsh}
            onChange={(e)=>setSearsh(e.target.value)}
            className="si" placeholder="Titre, auteur…"  />
            <select className="sel"  value={categorie}
               onChange={(e)=>setCategorie(e.target.value)}
            >
              <option value="">Toutes catégories</option>
              {bookCategorie.map((cat)=> <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select className="sel"
                value={statusSearch}
                onChange={(e)=>setStatusSearch(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value='1'>Disponible</option>
              <option value='0'>Indisponible</option>
            </select>
            <button className="btn-add"  onClick={()=>{setShowBooks(true);setUp(false);setForm({titre:'',auteur:'',categorie:'',annee:'',pages:'',fileSize:'',extension:'',book_rank:'',showLiver:'',prix:'',qte:0,status:''})}} >+ Ajouter</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Catégorie</th>
                <th>Année</th>
                <th>Pages</th>
                <th>Taille du fichier</th>
                <th>Extension</th>
                <th>Date d'ajout</th>
                <th>Rang</th>
                <th>Afficher le Livre</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Statut</th>
                <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {filterBooks.length === 0 ?(<tr>
              <td colSpan="15">
                <div className="empty">
                  <div className="ei">🔍</div>
                  <p>Aucun livre trouvé</p>
                </div>
              </td>
            </tr> ):
              (pageNext?.map((b)=><tr key={b.id} >
                <td>
                  <img src={b.image} alt={b.title} style={{ width: "40px", borderRadius: "4px" }} />
                </td>

                <td><strong>{b.title}</strong></td>
                <td>{b.author}</td>
                <td><span className="badge b-cat">{b.category}</span></td>
                <td>{b.annee}</td>
                <td>{b.pages}</td>
                <td>{b.fileSize}</td>
                <td>{b.extension}</td>
                <td>{b.creationDate}</td>
                <td>{b.book_rank}</td>
                <td>{b.showLiver}</td>
                <td>{b.prix} DH</td>
                <td>{b.qte}</td>
                <td>{b.status === "actif" ? "✔" : "❌"}</td>
                <td>
                  <div className="row-acts">
                    <button onClick={() => hendleUpdate(b.id, b)}>✏️</button>
                    <button onClick={() => hendleDelete(b.id)}>🗑️</button>
                  </div>
                </td>
              </tr>))}
           </tbody>
        </table>

          <div className="pagi">
            {pages>1&&<div className="pagi">
              <span className="pinfo">{filterBooks.length} livre(s) · Page {page}/{pages}</span>
            {Array.from({length: pages},(_,i)=>i+1).map(p=>
            <button key={p} className={`pb${p===page?" active":""}`} onClick={()=>setPage(p)}>{p}</button>)}</div>}
          </div>
      </div>

      <div>
        {showBooks&&<div className="overlay"  >
          <div className="modal"  >
            <div className="modal-h">
              <h3>{up ? 'Modifier le Livre' : 'Ajouter un Livre'}</h3>
              <button className="btn-x" onClick={()=> setShowBooks(false)} >✕</button>
            </div>
             <div className="grid2">
              <div className="form-group">
                <label>Titre</label>
                <input type="text" value={up?update.titre:form.titre} onChange={(e)=>up?setUpdate({...update,titre:e.target.value}):setForm({...form,titre:e.target.value})} />
              </div>
              
              <div className="form-group">
                <label>Auteur</label>
                <input type="text" value={up?update.auteur:form.auteur} onChange={(e)=>up?setUpdate({...update,auteur:e.target.value}):setForm({...form,auteur:e.target.value})}/>
              </div>
               </div>
              <div className="grid2"> 
              <div className="form-group">
                <label>Catégorie</label>
                <input type='text' value={up?update.categorie:form.categorie} onChange={(e)=>up?setUpdate({...update,categorie:e.target.value}):setForm({...form,categorie:e.target.value})}/>
              </div> 
                <div className="form-group">
                  <label>Année</label>
                  <input type="text" value={up?update.annee:form.annee} onChange={(e)=>up?setUpdate({...update,annee:e.target.value}):setForm({...form,annee:e.target.value})}/>
                </div> 
                </div>
                <div className="grid2">
                <div className="form-group">
                  <label>Pages</label>
                  <input type="number" min="1" value={up?update.pages:form.pages} onChange={(e)=>up?setUpdate({...update,pages:e.target.value}):setForm({...form,pages:e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Taille du fichier</label>
                  <input type="text" value={up?update.fileSize:form.fileSize} onChange={(e)=>up?setUpdate({...update,fileSize:e.target.value}):setForm({...form,fileSize:e.target.value})} />
                </div>
                </div>
                 <div className="grid2">
                <div className="form-group">
                  <label>Extension</label>
                  <input type="text" value={up?update.extension:form.extension} onChange={(e)=>up?setUpdate({...update,extension:e.target.value}):setForm({...form,extension:e.target.value})} />
                </div>
              
                <div className="form-group">
                  <label>Rang</label>
                  <input type="number" min="1" value={up?update.book_rank:form.book_rank} onChange={(e)=>up?setUpdate({...update,book_rank:e.target.value}):setForm({...form,book_rank:e.target.value})} />
                </div>
                </div>
                 <div className="grid2">
                <div className="form-group">
                  <label>Afficher le Livre</label>
                  <select value={up?update.showLiver:form.showLiver} onChange={(e)=>up?setUpdate({...update,showLiver:e.target.value}):setForm({...form,showLiver:e.target.value})}>
                    <option value="">-- Choisir --</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
             
                <div className="form-group">
                  <label>Prix (DH)</label>
                  <input type="number" min="0" step="0.01" value={up?update.prix:form.prix} onChange={(e)=>up?setUpdate({...update,prix:e.target.value}):setForm({...form,prix:e.target.value})} />
                </div>
                 </div>
              <div className="grid2">
                <div className="form-group">
                  <label>Quantité</label>
                  <input type="number" min="0" value={up?update.qte:form.qte} onChange={(e)=>up?setUpdate({...update,qte:e.target.value}):setForm({...form,qte:e.target.value})} />
                </div>
              
              {/* <div className="form-group">
                <label>Statut</label>
                <select value={up?update.status:form.status} onChange={(e)=>up?setUpdate({...update,status:e.target.value}):setForm({...form,status:e.target.value})}>
                  <option value="">-- Choisir --</option>
                  <option value='1'>dia</option>
                  <option value="0">Inactif</option>
                </select>
              </div> */}
              </div>
            <div className="modal-f">
              <button className="btn-sec" onClick={()=> setShowBooks(false)} >Annuler</button>
              <button className="btn-sub" onClick={()=>{if(up){saveUpdate()}else{hendleAdd()}}} >{up?'Modifier':'Ajouter'}</button>
            </div>

          </div>
        </div>}

        {showSupr&&<div className="overlay" >
          <div className="modal" >
            <div className="modal-h">
              <h3>Supprimer le Livre</h3>
              <button className="btn-x" onClick={()=> setShowSupr(false)}  >✕</button>
            </div>
            <p className="confirm-txt">Supprimer ce livre ? Cette action est irréversible.</p>
            <div className="modal-f">
              <button className="btn-sec" onClick={()=> setShowSupr(false)}  >Annuler</button>
              <button className="btn-del" onClick={okDelete} >Supprimer</button>
            </div>
          </div>
        </div> }
      </div>
    </div>
  );
}
