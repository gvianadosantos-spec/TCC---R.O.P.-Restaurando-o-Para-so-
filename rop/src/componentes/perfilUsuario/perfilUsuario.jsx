import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import './perfilUsuario.scss';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5050').replace(/\/+$/, '');

function formatarData(valor) {
  if (!valor) return 'Não informado';
  const texto = String(valor);
  const data = /^\d{4}-\d{2}-\d{2}/.test(texto)
    ? new Date(`${texto.slice(0, 10)}T12:00:00`)
    : new Date(texto);
  return Number.isNaN(data.getTime()) ? 'Não informado' : data.toLocaleDateString('pt-BR');
}

function dataParaInput(valor) {
  if (!valor) return '';
  const texto = String(valor);
  return /^\d{4}-\d{2}-\d{2}/.test(texto) ? texto.slice(0, 10) : '';
}

function hojeLocal() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Mantém o método já utilizado pelo perfil: imagem quadrada compactada em JPG.
async function prepararImagem(arquivo) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
    throw new Error('Escolha uma imagem JPG, PNG ou WebP.');
  }
  if (arquivo.size > 5 * 1024 * 1024) {
    throw new Error('A foto precisa ter no máximo 5 MB.');
  }

  const url = URL.createObjectURL(arquivo);
  try {
    const imagem = new Image();
    await new Promise((resolve, reject) => {
      imagem.onload = resolve;
      imagem.onerror = () => reject(new Error('Não foi possível abrir essa imagem.'));
      imagem.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Seu navegador não conseguiu preparar a foto.');

    ctx.fillStyle = '#153d35';
    ctx.fillRect(0, 0, 256, 256);
    const lado = Math.min(imagem.naturalWidth, imagem.naturalHeight);
    ctx.drawImage(
      imagem,
      (imagem.naturalWidth - lado) / 2,
      (imagem.naturalHeight - lado) / 2,
      lado, lado,
      0, 0, 256, 256
    );

    const resultado = canvas.toDataURL('image/jpeg', 0.78);
    if (resultado.length > 210000) {
      throw new Error('A foto ficou muito grande. Escolha outra imagem.');
    }
    return resultado;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function IconeEditar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4L16.5 3.5Z" />
    </svg>
  );
}

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [aberto, setAberto] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [editarNome, setEditarNome] = useState(false);
  const [editarAniversario, setEditarAniversario] = useState(false);
  const [nome, setNome] = useState('');
  const [aniversario, setAniversario] = useState('');

  const arquivoRef = useRef(null);
  const fecharRef = useRef(null);
  const painelRef = useRef(null);
  const botaoPerfilRef = useRef(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const token = sessionStorage.getItem('rop_token');
      if (!token) {
        if (ativo) {
          setUsuario(null);
          setAberto(false);
          setCarregandoPerfil(false);
        }
        return;
      }

      if (ativo) setCarregandoPerfil(true);
      try {
        const resposta = await fetch(`${API_URL}/cadastro/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resposta.status === 401) {
          sessionStorage.removeItem('rop_token');
          if (ativo) {
            setUsuario(null);
            setAberto(false);
          }
          return;
        }
        if (!resposta.ok) throw new Error('Não foi possível consultar seu perfil.');
        const dados = await resposta.json();
        if (ativo) {
          setUsuario(dados);
          setNome(dados.nome_usuario || '');
          setAniversario(dataParaInput(dados.data_nascimento));
          setMensagem('');
        }
      } catch (erro) {
        if (ativo) setMensagem(erro.message);
      } finally {
        if (ativo) setCarregandoPerfil(false);
      }
    }

    carregar();
    window.addEventListener('rop:login', carregar);
    return () => {
      ativo = false;
      window.removeEventListener('rop:login', carregar);
    };
  }, []);

  useEffect(() => {
    if (!aberto) return;

    const botaoPerfil = botaoPerfilRef.current;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => fecharRef.current?.focus());

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') {
        setAberto(false);
        return;
      }

      if (evento.key !== 'Tab' || !painelRef.current) return;
      const focaveis = Array.from(
        painelRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((item) => item.getClientRects().length > 0);
      if (!focaveis.length) return;

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    window.addEventListener('keydown', aoPressionarTecla);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', aoPressionarTecla);
      window.requestAnimationFrame(() => botaoPerfil?.focus());
    };
  }, [aberto]);

  function fecharPerfil() {
    setAberto(false);
    setEditarNome(false);
    setEditarAniversario(false);
  }

  async function atualizarPerfil(campos, sucesso) {
    const token = sessionStorage.getItem('rop_token');
    if (!token) {
      setMensagem('Sua sessão expirou. Faça login novamente.');
      return false;
    }

    setSalvando(true);
    setMensagem('');
    try {
      const resposta = await fetch(`${API_URL}/cadastro/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(campos)
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível atualizar o perfil.');
      setUsuario(dados);
      setNome(dados.nome_usuario || '');
      setAniversario(dataParaInput(dados.data_nascimento));
      setMensagem(sucesso);
      return true;
    } catch (erro) {
      setMensagem(erro.message);
      return false;
    } finally {
      setSalvando(false);
    }
  }

  async function salvarNome(evento) {
    evento.preventDefault();
    if (await atualizarPerfil({ nome_usuario: nome.trim() }, 'Nome atualizado com sucesso.')) {
      setEditarNome(false);
    }
  }

  async function salvarAniversario(evento) {
    evento.preventDefault();
    if (await atualizarPerfil({ data_nascimento: aniversario || null }, 'Aniversário atualizado com sucesso.')) {
      setEditarAniversario(false);
    }
  }

  async function trocarFoto(evento) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    try {
      setMensagem('Preparando sua foto…');
      const imagem = await prepararImagem(arquivo);
      await atualizarPerfil({ foto_perfil: imagem }, 'Foto atualizada com sucesso.');
    } catch (erro) {
      setMensagem(erro.message);
    } finally {
      evento.target.value = '';
    }
  }

  async function removerFoto() {
    await atualizarPerfil({ foto_perfil: null }, 'Foto removida.');
  }

  function sair() {
    sessionStorage.removeItem('rop_token');
    setUsuario(null);
    setAberto(false);
    window.dispatchEvent(new Event('rop:login'));
    window.location.assign('/inicio');
  }

  const foto = usuario?.foto_perfil;
  const inicial = usuario?.nome_usuario?.trim()?.charAt(0).toUpperCase() || 'U';

  if (!usuario) {
    return (
      <Link to="/" className="comp-login" aria-label="Entrar na R.O.P.">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
        </svg>
        <span>{carregandoPerfil ? 'Entrando…' : 'Login'}</span>
      </Link>
    );
  }

  return (
    <>
      <button
        ref={botaoPerfilRef}
        className="perfil-botao"
        type="button"
        onClick={() => {
          setMensagem('');
          setAberto(true);
        }}
        aria-label="Abrir meu perfil"
        aria-expanded={aberto}
      >
        {foto ? <img src={foto} alt="" /> : <span className="perfil-inicial">{inicial}</span>}
        <span className="perfil-botao-texto">Meu perfil</span>
      </button>

      {aberto && createPortal(
        <div className="perfil-modal">
          <button
            className="perfil-fundo"
            type="button"
            aria-label="Fechar perfil"
            onClick={fecharPerfil}
            tabIndex={-1}
          />

          <aside
            ref={painelRef}
            className="perfil-painel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="perfil-titulo"
          >
            <div className="perfil-topo">
              <button
                ref={fecharRef}
                className="perfil-voltar"
                type="button"
                onClick={fecharPerfil}
                aria-label="Fechar painel de perfil"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m14 6-6 6 6 6" />
                  <path d="M8 12h12" />
                </svg>
              </button>
              <div className="perfil-topo-texto">
                <span>MINHA CONTA</span>
                <h2 id="perfil-titulo">Meu perfil</h2>
              </div>
              <span className="perfil-topo-selo">R.O.P.</span>
            </div>

            <div className="perfil-conteudo">
              <section className="perfil-identidade" aria-label="Identificação da conta">
                <span className="perfil-identidade-brilho" aria-hidden="true" />
                <button
                  className="perfil-foto"
                  type="button"
                  onClick={() => arquivoRef.current?.click()}
                  aria-label="Alterar foto de perfil"
                  disabled={salvando}
                >
                  {foto ? <img src={foto} alt="Minha foto de perfil" /> : <span>{inicial}</span>}
                  <span className="perfil-camera" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
                      <circle cx="12" cy="13" r="3.4" />
                    </svg>
                  </span>
                </button>
                <input
                  ref={arquivoRef}
                  className="perfil-arquivo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={trocarFoto}
                  aria-label="Escolher foto de perfil"
                />
                <strong className="perfil-nome">{usuario.nome_usuario}</strong>
                <p className="perfil-descricao">Membro da comunidade R.O.P.</p>
                <div className="perfil-acoes-foto">
                  <button type="button" onClick={() => arquivoRef.current?.click()} disabled={salvando}>
                    Trocar foto
                  </button>
                  {foto && (
                    <button type="button" onClick={removerFoto} disabled={salvando}>
                      Remover foto
                    </button>
                  )}
                </div>
              </section>

              {mensagem && <p role="status" className="perfil-mensagem">{mensagem}</p>}

              <section className="perfil-secao" aria-label="Informações pessoais">
                <div className="perfil-secao-titulo">
                  <span aria-hidden="true">01</span>
                  <h3>Informações pessoais</h3>
                </div>
                <div className="perfil-dados">
                  <div className="perfil-item">
                    <div>
                      <small>Nome</small>
                      {!editarNome && <strong>{usuario.nome_usuario}</strong>}
                    </div>
                    {!editarNome && (
                      <button className="perfil-editar" onClick={() => setEditarNome(true)} type="button" aria-label="Editar nome" title="Editar nome">
                        <IconeEditar />
                      </button>
                    )}
                  </div>
                  {editarNome && (
                    <form className="perfil-edicao" onSubmit={salvarNome}>
                      <label htmlFor="perfil-edicao-nome">Alterar nome</label>
                      <input id="perfil-edicao-nome" value={nome} maxLength={100} minLength={3} onChange={(e) => setNome(e.target.value)} required />
                      <div className="perfil-edicao-acoes">
                        <button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
                        <button type="button" onClick={() => { setEditarNome(false); setNome(usuario.nome_usuario); }}>Cancelar</button>
                      </div>
                    </form>
                  )}

                  <div className="perfil-item">
                    <div>
                      <small>E-mail</small>
                      <strong>{usuario.email}</strong>
                    </div>
                  </div>

                  <div className="perfil-item">
                    <div>
                      <small>Aniversário</small>
                      {!editarAniversario && <strong>{formatarData(usuario.data_nascimento)}</strong>}
                    </div>
                    {!editarAniversario && (
                      <button className="perfil-editar" onClick={() => setEditarAniversario(true)} type="button" aria-label="Editar aniversário" title="Editar aniversário">
                        <IconeEditar />
                      </button>
                    )}
                  </div>
                  {editarAniversario && (
                    <form className="perfil-edicao" onSubmit={salvarAniversario}>
                      <label htmlFor="perfil-edicao-data">Alterar aniversário</label>
                      <input id="perfil-edicao-data" type="date" value={aniversario} max={hojeLocal()} onChange={(e) => setAniversario(e.target.value)} />
                      <small>Opcional. Para remover a data, limpe o campo e salve.</small>
                      <div className="perfil-edicao-acoes">
                        <button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
                        <button type="button" onClick={() => { setEditarAniversario(false); setAniversario(dataParaInput(usuario.data_nascimento)); }}>Cancelar</button>
                      </div>
                    </form>
                  )}

                  <div className="perfil-item">
                    <div>
                      <small>Membro desde</small>
                      <strong>{formatarData(usuario.criado_em)}</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="perfil-secao perfil-secao-seguranca" aria-label="Segurança da conta">
                <div className="perfil-secao-titulo">
                  <span aria-hidden="true">02</span>
                  <h3>Segurança da conta</h3>
                </div>
                <Link className="perfil-seguranca" to="/esqueci-senha" onClick={fecharPerfil}>
                  <span>Alterar minha senha</span>
                  <span className="perfil-seguranca-seta" aria-hidden="true">→</span>
                </Link>
                <p className="perfil-nota">Você receberá um link de recuperação no e-mail cadastrado.</p>
              </section>

              <button type="button" className="perfil-sair" onClick={sair}>Sair da minha conta</button>
              <p className="perfil-rodape">R.O.P. · Restaurando o Paraíso</p>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}