import api from "../api/axois";
import { useState } from "react";

export default function Login({onLogin,setAdminLog}){
  const [emailRegis,setEmailRegis]=useState("");

  const [passLog,setPassLog]=useState("");
  const [passRegis,setPassRegis]=useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirme: "",
  });
  const [usernameLog,setUsernameLog] = useState("");
  const [usernameRegis,setUsernameRegis] = useState("");
  const [passConferme,setPassConferme] = useState("");
 
  const [err,setErr]=useState("");
  const [isSignUp,setIsSignUp] = useState(false);

  const [infoAdminRegis,setInfoAdminRegis]=useState({});
  const [infoAdminLog,setInfoAdminLog]=useState({});
  console.log(fieldErrors)

  const submit = async (e) => {
  e.preventDefault();
  try {
    if (isSignUp) {
        
      const res = await api.post('/admin/register', {
        username: usernameRegis,
        email: emailRegis,
        password: passRegis,
        password_confirmation: passConferme,
      });

      setInfoAdminRegis(res.data);
       setErr(res.data.message);
    } else {
         
      const res = await api.post('/admin/login', {
        username: usernameLog,
        password: passLog,
      });
      setAdminLog(res.data.admin)
      setInfoAdminLog(res.data);
      // console.log(res.data);  
      JSON.parse(localStorage.getItem("admin"))
      if (res.data.token){
        localStorage.setItem("token",  res.data.token);
        localStorage.setItem("ok",  JSON.stringify(true));
        localStorage.setItem("admin", JSON.stringify(res.data.admin))

        onLogin();       setIsSignUp(true);

      } else {
              setFieldErrors({
          username: "",
          email: "",
          password: "",
          passwordConfirme: "",
        });
        setErr(res.data.message);
      } 
      // if(res.data.admin === null){ setErr("Email ou mot de passe incorrect.")}
        
     //      }
     console.log(res)
    }
  } catch (err) {
       setErr("");

      setFieldErrors({
    username: "",
    email: "",
    password: "",
    passwordConfirme: "",
  });

  if (err.response && err.response.data.errors) {
    const errors = err.response.data.errors;

    setFieldErrors({
      username: errors.username ? errors.username[0] : "",
      email: errors.email ? errors.email[0] : "",
      password: errors.password ? errors.password[0] : "",
      passwordConfirme: errors.password_confirmation ? errors.password_confirmation[0] : "",
    });

    return;  
  }

  setErr("Erreur inconnue");
  }
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
              <label>user name</label>
              <input type="text" value={!isSignUp ? usernameLog: usernameRegis} onChange={(e)=> !isSignUp 
                ? setUsernameLog(e.target.value)
                : setUsernameRegis(e.target.value) }/>{fieldErrors.username&&<p className="err">{fieldErrors.username}</p>}
            </div>

            {isSignUp &&<div className="form-group">
              <label>Email</label>
              <input type="text" value={emailRegis} onChange={e => setEmailRegis(e.target.value)}/>
            {fieldErrors.email&&<p className="err">{fieldErrors.email}</p>}
            </div>  }

            <div className="form-group">
              <label>password</label>

              <input 
                    type='password' 
                    placeholder="••••••••"
                    value={!isSignUp ?  passLog: passRegis} 
                    onChange={(e) => !isSignUp 
                        ?  setPassLog(e.target.value)
                        : setPassRegis(e.target.value)
                    } 
                />   {fieldErrors.password&&<p className="err">{fieldErrors.password}</p>}

             </div>

             {isSignUp &&<div className="form-group">
              <label>comfirme password</label>

              <input 
                    type='password' 
                    placeholder="••••••••"
                    value={passConferme} 
                    onChange={(e) =>  setPassConferme(e.target.value) } 
                />
                 {fieldErrors.passwordConfirme&&<p className="err">{fieldErrors.passwordConfirme}</p>}

             </div>}

            {err&&<p className="err" style={{color:err === 'Login success'||err === 'Utilisateur créé avec succès'?'green':''}}>{err}</p>}
            <button type="submit" className="btn-primary">  {isSignUp ? "Créer mon compte" : "Se connecter"} </button> 
            <p className="hint"></p>
             <p className="sign-switch">
                                {isSignUp ? 'Déjà un compte ?' : 'Pas de compte ?'}
                                <span onClick={() => { 
                                       setIsSignUp(!isSignUp);
                                       setErr('');
                                      setFieldErrors({
                                        username: "",
                                        email: "",
                                        password: "",
                                        passwordConfirme: "",
                                      });
                                }} style={{color:'blue',cursor:'pointer'}}>
                                    {isSignUp ? ' Se connecter' : " S'inscrire"}
                                </span>
                            </p>
          </form>
        </div>
      </div>
    </div>
  );
}