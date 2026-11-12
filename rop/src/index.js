import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route } from "react-router-dom";

import Transicoes from "./componentes/transicoes/Transicoes.jsx";

import App from "./pages/APP/app.jsx";
import Doe from "./pages/doe/doe.jsx";
import Especies from "./pages/especies/especies.jsx";
import Orientacoes from "./pages/orientacoes/orientacoes.jsx";
import Inicio from "./pages/inicio/inicio.jsx";
import Login from "./pages/login/login.jsx";
import Loja from "./pages/loja/loja.jsx";
import Noticias from "./pages/noticias/noticias.jsx";
import Registro from "./pages/registro/registro.jsx";
import EsqueciSenha from "./pages/esqueciSenha/esqueciSenha.jsx";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <BrowserRouter>
    <Transicoes>
      <Route path="/app" element={<App />} />
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/especies" element={<Especies />} />
      <Route path="/orientacoes" element={<Orientacoes />} />
      <Route path="/noticias" element={<Noticias />} />
      <Route path="/loja" element={<Loja />} />
      <Route path="/doe" element={<Doe />} />
      <Route
        path="/esqueci-senha"
        element={<EsqueciSenha />}
      />
    </Transicoes>
  </BrowserRouter>
);