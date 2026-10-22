import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import './doe.scss'
import Cabecalho from '../../componentes/cabecalho/cabecalho.jsx'
import Rodape from '../../componentes/rodape/rodape.jsx'

const CHAVE_PIX = 'bafecf50-5d98-4c11-a246-c0ea6bda7d76'
const CODIGO_PIX =
  '00020126580014BR.GOV.BCB.PIX0136bafecf50-5d98-4c11-a246-c0ea6bda7d765204000053039865802BR5925Guilherme Andre Viana dos6009SAO PAULO62140510biK9LTV80e6304BA0B'

const VALORES = [10, 25, 50, 100] 

const DIVISAO = [
  { texto: 'Ferramentas e estudos da equipe', percentual: 60, cor: 'ambar' },
  { texto: 'Divisão entre os integrantes do grupo', percentual: 40, cor: 'azul' },
]

const PERGUNTAS = [
  {
    pergunta: 'A R.O.P. existe?',
    resposta: 'Não. Nome, projetos, textos e números fazem parte de um trabalho acadêmico.',
  },
  {
    pergunta: 'Para quem vai minha doação?',
    resposta: 'Para o grupo de estudantes que desenvolveu o site. Você escolhe se quer ajudar.',
  },
  {
    pergunta: 'Preciso doar para usar o site?',
    resposta: 'Não. Toda a navegação é livre e a doação é totalmente opcional.',
  },
  {
    pergunta: 'Posso receber o dinheiro de volta?',
    resposta: 'Se o Pix foi feito por engano, o grupo devolve o valor sempre que for possível. Fale com a gente pelo telefone ou WhatsApp (11) 93087-5221 para combinar o estorno. Lembrando que a doação é voluntária.',
  },
]

function Doe() {
  const [valorFixo, setValorFixo] = useState(25)
  const [outroValor, setOutroValor] = useState('')
  const [entendeu, setEntendeu] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarPix, setMostrarPix] = useState(false)
  const [copiado, setCopiado] = useState(null)

  const valor = outroValor ? Number(outroValor) : valorFixo

  function escolherValor(v) {
    setValorFixo(v)
    setOutroValor('')
  }

  function digitarOutroValor(e) {
    setOutroValor(e.target.value)
    setValorFixo(null)
  }

  function doar() {
    if (!valor || valor < 1) {
      setErro('Informe um valor de pelo menos R$ 1.')
      setMostrarPix(false)
      return
    }
    if (!entendeu) {
      setErro('Marque a caixa acima para confirmar que entendeu o aviso.')
      setMostrarPix(false)
      return
    }
    setErro('')
    setMostrarPix(true)
  }

  async function copiar(id, texto) {
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      const campo = document.createElement('textarea')
      campo.value = texto
      campo.style.position = 'fixed'
      campo.style.opacity = '0'
      document.body.appendChild(campo)
      campo.select()
      document.execCommand('copy')
      document.body.removeChild(campo)
    }
    setCopiado(id)
    setTimeout(() => setCopiado(null), 1800)
  }

  return (
    <div className='doe-corpo'>
      <Cabecalho />

      <header className='doe-topo'>
        <div className='doe-largura'>
          <h1>Salve vidas. Restaure o paraíso.</h1>
          <p>
            Na história da R.O.P., sua doação cuidaria de animais silvestres que perderam seu
            habitat. Na vida real, ela apoia o grupo de estudantes que desenvolveu este site.
          </p>
        </div>
      </header>

      <main className='doe-largura'>
        <div className='doe-grade'>
          <section className='doe-cartao' aria-labelledby='doe-titulo-form'>
            <h2 id='doe-titulo-form'>Faça sua doação</h2>
            <p className='doe-sub'>Doação voluntária e única. Qualquer valor ajuda o grupo.</p>

            <div className='doe-valores' role='group' aria-label='Valor'>
              {VALORES.map((v) => (
                <button
                  key={v}
                  type='button'
                  aria-pressed={valorFixo === v}
                  onClick={() => escolherValor(v)}
                >
                  R$ {v}
                </button>
              ))}
            </div>

            <label className='doe-outro'>
              <span>R$</span>
              <input
                type='number'
                min='1'
                placeholder='Outro valor'
                aria-label='Outro valor'
                value={outroValor}
                onChange={digitarOutroValor}
              />
            </label>

            <label className='doe-confirma'>
              <input
                type='checkbox'
                checked={entendeu}
                onChange={(e) => setEntendeu(e.target.checked)}
              />
              <span>
                Entendo que a R.O.P. é fictícia e que o valor vai para o grupo que desenvolveu
                este site, não para animais.
              </span>
            </label>

            <button type='button' className='doe-botao' onClick={doar}>
              Doar R$ {valor}
            </button>

            {erro && (
              <p className='doe-erro' role='alert'>
                {erro}
              </p>
            )}

            {mostrarPix && (
              <div className='doe-pix' role='status'>
                <p>
                  Obrigado! Escaneie o QR Code ou copie o código no app do seu banco. Informe o
                  valor de R$ {valor} na hora de pagar.
                </p>
                <div className='doe-qr'>
                  <QRCodeSVG value={CODIGO_PIX} size={200} level='M' />
                </div>
                <button
                  type='button'
                  className='doe-copiar'
                  onClick={() => copiar('codigo', CODIGO_PIX)}
                >
                  {copiado === 'codigo' ? 'Copiado!' : 'Copiar código Pix'}
                </button>
                <button
                  type='button'
                  className='doe-copiar contorno'
                  onClick={() => copiar('chave', CHAVE_PIX)}
                >
                  {copiado === 'chave' ? 'Copiado!' : 'Copiar só a chave'}
                </button>
              </div>
            )}
          </section>

          <aside className='doe-cartao doe-lateral' aria-labelledby='doe-titulo-divisao'>
            <h3 id='doe-titulo-divisao'>Para onde vai o dinheiro</h3>
            <div className='doe-barra' aria-hidden='true'>
              {DIVISAO.map((item) => (
                <i
                  key={item.texto}
                  className={item.cor}
                  style={{ width: `${item.percentual}%` }}
                />
              ))}
            </div>
            <ul className='doe-legenda'>
              {DIVISAO.map((item) => (
                <li key={item.texto}>
                  <span className={`doe-bolinha ${item.cor}`} />
                  <em>{item.percentual}%</em>
                  <span>{item.texto}</span>
                </li>
              ))}
            </ul>
            <h3>Quem recebe</h3>
            <p className='doe-sub'>
              Os estudantes que projetaram e programaram este site como trabalho de conclusão de
              curso. Nenhum valor é repassado a organizações ambientais.
            </p>
          </aside>
        </div>

        <section className='doe-sobre'>
          <h2>Uma ONG inventada, uma doação real</h2>
          <p>
            A R.O.P. foi criada como cenário para o nosso TCC: onça, boto, arara e jacaré, que
            aparecem na marca, representam a fauna que a história defende. Como a causa é
            fictícia, preferimos deixar tudo claro antes de você doar. Se quiser ajudar a fauna
            brasileira de verdade, procure ONGs reconhecidas como o Projeto Tamar.
          </p>
        </section>

        <section className='doe-sobre doe-faq' aria-label='Perguntas frequentes'>
          <h2>Perguntas frequentes</h2>
          {PERGUNTAS.map((item) => (
            <details key={item.pergunta}>
              <summary>{item.pergunta}</summary>
              <p>{item.resposta}</p>
            </details>
          ))}
        </section>

        <section className='doe-final'>
          <h2>Quer apoiar o nosso TCC?</h2>
          <p>
            Mesmo uma doação pequena ajuda a manter o projeto no ar. Obrigado por visitar a
            R.O.P.
          </p>
        </section>
      </main>

      <Rodape />
    </div>
  )
}

export default Doe