import React from 'react';
import ReactDOM from 'react-dom/client';


import App from './pages/APP/app.jsx';
import Doe from './pages/doe/doe.jsx';
import Especies from './pages/especies/especies.jsx';
import Inicio from './pages/inicio/inicio.jsx';
import Login from './pages/login/login.jsx';
import Loja from './pages/loja/loja.jsx';
import Noticias from './pages/noticias/noticias.jsx';
import Resgistro from './pages/registro/registro.jsx';
import EsqueciSenha from './pages/esqueciSenha/esqueciSenha.jsx';


import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <BrowserRouter>
      <Routes>
          <Route  path='/app' element= {<App/>}/>
          <Route  path='/' element= {<Login/>}/>
          <Route  path='/registro' element= {<Resgistro/>}/>
          <Route  path='/inicio' element= {<Inicio/>}/>
          <Route  path='/especies' element= {<Especies/>}/>
          <Route  path='/noticias' element= {<Noticias/>}/>
          <Route  path='/loja' element= {<Loja/>}/>
          <Route  path='/doe' element= {<Doe/>}/>
          <Route  path='/esqueci-senha' element= {<EsqueciSenha/>}/>
      </Routes>
    </BrowserRouter>
);  