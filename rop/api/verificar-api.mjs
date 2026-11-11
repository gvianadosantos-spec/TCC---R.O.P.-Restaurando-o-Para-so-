// Execute em outro terminal com a API já iniciada: node verificar-api.mjs
const URL_BASE = process.env.TEST_API_URL || 'http://localhost:5050';

const testes = [
  { nome: 'Express ativo', rota: '/health', conferir: (r) => r.status === 'ok' },
  { nome: 'Conexão MySQL e 60 animais', rota: '/health/banco', conferir: (r) => r.total_animais === 60 },
  { nome: 'Listagem completa', rota: '/animais', conferir: (r) => Array.isArray(r) && r.length === 60 },
  { nome: 'Filtro de mamíferos', rota: '/animais?categoria=Mamiferos', conferir: (r) => Array.isArray(r) && r.length === 10 },
  { nome: 'Busca de onça-pintada', rota: '/animais?nome=on%C3%A7a', conferir: (r) => Array.isArray(r) && r.some((a) => a.nome_popular === 'Onça-pintada') },
  { nome: 'Filtro combinado', rota: '/animais?categoria=Mamiferos&nome=on%C3%A7a', conferir: (r) => Array.isArray(r) && r.length >= 1 && r.every((a) => a.classe_especie === 'Mamíferos') },
  { nome: 'Ficha id_catalogo=1', rota: '/animais/1', conferir: (r) => r.id_catalogo === 1 && r.nome_popular === 'Onça-pintada' },
  { nome: 'Estatísticas', rota: '/animais/estatisticas', conferir: (r) => r.total === 60 && Array.isArray(r.por_categoria) && Array.isArray(r.por_status) },
  { nome: 'Rota legada de pesquisa', rota: '/pesquisa/on%C3%A7a', conferir: (r) => Array.isArray(r) && r.some((a) => a.nome_popular === 'Onça-pintada') }
];

let aprovados = 0;
for (const teste of testes) {
  try {
    const response = await fetch(URL_BASE + teste.rota, { signal: AbortSignal.timeout(7000) });
    const result = await response.json();
    if (response.ok && teste.conferir(result)) {
      console.log('OK    ' + teste.nome);
      aprovados += 1;
    } else {
      console.error('FALHOU ' + teste.nome + ` (HTTP ${response.status})`);
      console.error(JSON.stringify(result).slice(0, 350));
    }
  } catch (error) {
    console.error('ERRO  ' + teste.nome + ': ' + error.message);
  }
}
console.log(`\nRESULTADO: ${aprovados}/${testes.length} testes passaram.`);
if (aprovados !== testes.length) process.exitCode = 1;
