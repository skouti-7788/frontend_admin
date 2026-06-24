import { useState } from "react";
export default function Login({onLogin}){
  const [email,setEmail]=useState("admin@library.ma");
  const [pass,setPass]=useState("admin123");
  const [err,setErr]=useState("");
  const submit=(e)=>{
    e.preventDefault();
    if(email==="admin@library.ma"&&pass==="admin123") onLogin();
    else setErr("Email ou mot de passe incorrect.");
  };
  return (
    <div className="login-page">
      <div className="login-art">
        <div className="login-art-inner">
          <span className="login-art-icon">📚</span>
          <h1>Library<br/>Manager</h1>
          <p>Système de gestion de bibliothèque moderne et efficace.</p>
        </div>
      </div>
      <div className="login-form-wrap">
        <div style={{width:"100%"}}>
          <h2>Connexion</h2>
          <p>Bienvenue, veuillez vous connecter.</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}/></div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}}/></div>
            {err&&<p className="err">{err}</p>}
            <button type="submit" className="btn-primary">Se connecter →</button>
            <p className="hint">Demo : admin@library.ma / admin123</p>
          </form>
        </div>
      </div>
    </div>
  );
}