import { useState, useCallback, useEffect } from "react";
import useBooks  from "./data/databese"
import {useAdherents, useEmprunts} from "./data/databese"
import Dashboard from "./pages/dashbord";
import Books from "./pages/books";
import Members from "./pages/mambers";
import Blacklist from "./pages/blacklist";
import Loans from "./pages/loans";
import Login from "./pages/login";
import Toasts from "./components/toasts";
import imgdach from './images/dashboard.png'
import imgBook from './images/books.png'
import imgAdh from './images/people.png'
import imgEmp from './images/give-book.png'
import imgAch from  './images/purchases.png'
import "./style.css";
import Achats from "./pages/Achats";
import api from "./api/axois";
export default function App(){
  const {book} = useBooks();
  const {Adherent} = useAdherents();
  const {emprunts} = useEmprunts();
  const [auth,setAuth]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [books,setBooks]=useState([]);
  const [members,setMembers]=useState([]);
  const [adminLog,setAdminLog] = useState({})
  // const [blacklist,setBlacklist]=useState([]);

   
  useEffect(()=>{
  const ok  =  JSON.parse(localStorage.getItem("ok")) || false;
   
  if(ok || ok === null ){ setAuth(true)}
  if(book) setBooks(book);
  if(Adherent) setMembers(Adherent);
  if(emprunts) setLoans(emprunts);
  },[book,Adherent,emprunts]);
  
  const [loans,setLoans]=useState([]);
  const [toasts,setToasts]=useState([]);
  
  const showToast=useCallback((message,type="success")=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,message,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);
  },[]);

  const nav=[
    {id:"dashboard",label:"Tableau de bord",icon:imgdach},
    {id:"books",label:"Livres",icon:imgBook},
    {id:"members",label:"Adhérents",icon:imgAdh},
    {id:"loans",label:"Emprunts",icon:imgEmp},
    {id:"achats",label:"Achats",icon:imgAch},
    // {id:"blacklist",label:"Liste Noire",icon:imgEmp},
  ];
  const titles={dashboard:"Tableau de Bord",books:"Catalogue des Livres",members:"Gestion des Adhérents",loans:"Gestion des Emprunts",blacklist:"Liste Noire"};
  const today=new Date().toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const handlelogout = async ()=>{
       try{
          // window.location.href = '/login';
          const  res = await api.post('/admin/logout')
          if(res.data.message){
          localStorage.removeItem("ok");
          localStorage.removeItem('token') ;
          localStorage.removeItem('admin') ;
          setAuth(false)
          }
          
         }catch(err){console.log(err)}
     
       
        }
  const admin = JSON.parse(localStorage.getItem('admin'))

  if(!auth) return <><Login setAdminLog={setAdminLog} onLogin={()=>setAuth(true)}/><Toasts toasts={toasts}/></>;

  return (
    <>
      <div className="app">
        <aside className="sidebar">
          <div className="sb-logo"><h2> LibraryManager</h2></div>
          <nav className="sb-nav">
            {/* <div className="nav-section">Navigation</div> */}
            {nav.map(n=>(
              <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
                <img className="nav-icon" src={n.icon} title={n.label}/>{n.label}
              </div>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="sb-user">
              <div className="avatar">{admin?.username?.charAt(0).toUpperCase() || '?'}</div>
              <div><span>Administrateur</span><small>{admin.email}</small></div>
            </div>
            <button className="btn-logout" onClick={handlelogout}> Se déconnecter</button>
          </div>
        </aside>
        <div className="main">
          <header className="topbar">
            <h1>{titles[page]}</h1>
            <span className="topbar-date">{today}</span>
          </header>
          <main className="page">
            {page==="dashboard"&&<Dashboard  books={books} imgBook={imgBook} imgAdh={imgAdh} imgEmp={imgEmp} imgdach={imgdach} members={members} loans={loans}/>}
            {page==="books"&&<Books books={books} setBooks={setBooks} showToast={showToast}/>}
            {page==="members"&&<Members setMembers={setMembers} members={members} books={books} showToast={showToast}/>}
            {page==="loans"&&<Loans loans={loans} setLoans={setLoans} books={books} setBooks={setBooks} members={members} showToast={showToast}/>}
            {page==="achats"&&<Achats loans={loans} setLoans={setLoans} books={books} setBooks={setBooks} members={members} showToast={showToast}/>}
            {page==="blacklist"&&<Blacklist loans={loans} members={members} showToast={showToast}/>}
          </main>
        </div>
      </div>
      <Toasts toasts={toasts}/>
    </>
  );
}

 