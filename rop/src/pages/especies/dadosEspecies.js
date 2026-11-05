// R.O.P. — dados locais APENAS PARA TESTAR os filtros, cards e gráficos.
// As classificações, contagens, locais e descrições abaixo são ilustrativos.
// Não utilize estes registros como informação científica oficial.
// Para usar fotos suas, defina imagem: "/assets/pages/especies/nome-da-foto.jpg".

export const GRUPOS = [
  "Todos", "Mamíferos", "Aves", "Répteis", "Anfíbios", "Peixes", "Invertebrados"
];

export const ANIMAIS_TESTE = [
  {
    id: "demo-1", nome_popular: "Ararinha-azul", nome_cientifico: "Cyanopsitta spixii",
    grupo: "Aves", status_conservacao: "Extinto na Natureza", icone: "🦜",
    ocorrencia: "Brasil · Caatinga", populacao: "Consultar fonte atualizada",
    tendencia: "Desconhecida", causa: "Perda de habitat e captura ilegal (exemplo)",
    descricao: "Registro ilustrativo para demonstrar a ficha de espécies e a seção de extinção.", imagem: ""
  },
  {
    id: "demo-2", nome_popular: "Mutum-do-nordeste", nome_cientifico: "Pauxi mitu",
    grupo: "Aves", status_conservacao: "Extinto na Natureza", icone: "🐦",
    ocorrencia: "Brasil · Mata Atlântica", populacao: "Consultar fonte atualizada",
    tendencia: "Desconhecida", causa: "Alteração do habitat (exemplo)",
    descricao: "Registro de demonstração. Preencher futuramente com dados verificados.", imagem: ""
  },
  {
    id: "demo-3", nome_popular: "Arara-vermelha", nome_cientifico: "Ara chloropterus",
    grupo: "Aves", status_conservacao: "Menor Preocupação", icone: "🦜",
    ocorrencia: "Brasil", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Espécie demonstrativa para o filtro Aves.", imagem: ""
  },
  {
    id: "demo-4", nome_popular: "Papagaio-de-peito-roxo", nome_cientifico: "Amazona vinacea",
    grupo: "Aves", status_conservacao: "Vulnerável", icone: "🦜",
    ocorrencia: "Brasil · Mata Atlântica", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Espécie demonstrativa para testar cartões e pesquisa.", imagem: ""
  },
  {
    id: "demo-5", nome_popular: "Onça-pintada", nome_cientifico: "Panthera onca",
    grupo: "Mamíferos", status_conservacao: "Vulnerável", icone: "🐆",
    ocorrencia: "Brasil", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro demonstrativo; os dados devem ser confirmados antes da publicação.", imagem: ""
  },
  {
    id: "demo-6", nome_popular: "Mico-leão-dourado", nome_cientifico: "Leontopithecus rosalia",
    grupo: "Mamíferos", status_conservacao: "Ameaçado", icone: "🐒",
    ocorrencia: "Brasil · Mata Atlântica", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro de teste para a ficha de mamíferos.", imagem: ""
  },
  {
    id: "demo-7", nome_popular: "Rato-de-Vespucci", nome_cientifico: "Noronhomys vespuccii",
    grupo: "Mamíferos", status_conservacao: "Extinto", icone: "🐀",
    ocorrencia: "Brasil", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro ilustrativo inspirado na referência visual enviada.", imagem: ""
  },
  {
    id: "demo-8", nome_popular: "Tartaruga-de-pente", nome_cientifico: "Eretmochelys imbricata",
    grupo: "Répteis", status_conservacao: "Criticamente Ameaçado", icone: "🐢",
    ocorrencia: "Brasil · Litoral", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro demonstrativo da categoria Répteis.", imagem: ""
  },
  {
    id: "demo-9", nome_popular: "Jacaré-de-papo-amarelo", nome_cientifico: "Caiman latirostris",
    grupo: "Répteis", status_conservacao: "Menor Preocupação", icone: "🐊",
    ocorrencia: "Brasil", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro demonstrativo da categoria Répteis.", imagem: ""
  },
  {
    id: "demo-10", nome_popular: "Perereca-verde-de-fímbria", nome_cientifico: "Phrynomedusa fimbriata",
    grupo: "Anfíbios", status_conservacao: "Extinto", icone: "🐸",
    ocorrencia: "Brasil · Mata Atlântica", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro ilustrativo para testar a seção de extinção.", imagem: ""
  },
  {
    id: "demo-11", nome_popular: "Sapo-cururu", nome_cientifico: "Rhinella marina",
    grupo: "Anfíbios", status_conservacao: "Menor Preocupação", icone: "🐸",
    ocorrencia: "Brasil", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro ilustrativo de anfíbio para testar os filtros.", imagem: ""
  },
  {
    id: "demo-12", nome_popular: "Mero", nome_cientifico: "Epinephelus itajara",
    grupo: "Peixes", status_conservacao: "Criticamente Ameaçado", icone: "🐟",
    ocorrencia: "Brasil · Costa", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro demonstrativo de peixe.", imagem: ""
  },
  {
    id: "demo-13", nome_popular: "Surubim-do-Paraíba", nome_cientifico: "Steindachneridion parahybae",
    grupo: "Peixes", status_conservacao: "Ameaçado", icone: "🐟",
    ocorrencia: "Brasil", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro demonstrativo para o grupo Peixes.", imagem: ""
  },
  {
    id: "demo-14", nome_popular: "Mandaçaia-do-Pantanal", nome_cientifico: "Melipona orbignyi",
    grupo: "Invertebrados", status_conservacao: "Ameaçado", icone: "🐝",
    ocorrencia: "Brasil · Pantanal", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro ilustrativo inspirado na referência de interface enviada.", imagem: ""
  },
  {
    id: "demo-15", nome_popular: "Borboleta-da-praia", nome_cientifico: "Parides ascanius",
    grupo: "Invertebrados", status_conservacao: "Vulnerável", icone: "🦋",
    ocorrencia: "Brasil", populacao: "Não informada", tendencia: "Desconhecida",
    causa: "Não informada", descricao: "Registro demonstrativo de invertebrado.", imagem: ""
  }
];

export const normalizarTexto = (valor) => String(valor ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim();

const equivalencias = {
  "mamiferos": "Mamíferos", "mamifero": "Mamíferos", "mammalia": "Mamíferos",
  "aves": "Aves", "ave": "Aves",
  "repteis": "Répteis", "reptil": "Répteis", "reptilia": "Répteis",
  "anfibios": "Anfíbios", "anfibio": "Anfíbios", "amphibia": "Anfíbios",
  "peixes": "Peixes", "peixe": "Peixes",
  "invertebrados": "Invertebrados", "invertebrado": "Invertebrados"
};

export function grupoPadronizado(valor) {
  const nome = normalizarTexto(valor);
  return equivalencias[nome] || Object.entries(equivalencias).find(([chave]) => nome.startsWith(chave))?.[1] || "Não classificado";
}

export function statusPadronizado(valor) {
  const texto = normalizarTexto(valor);
  if (["extinto na natureza", "extinta na natureza", "ew"].includes(texto)) return "Extinto na Natureza";
  if (["extinto", "extinta", "ex"].includes(texto)) return "Extinto";
  if (["criticamente ameacado", "criticamente ameacada", "criticamente em perigo", "cr"].includes(texto)) return "Criticamente Ameaçado";
  if (["em perigo", "ameacado", "ameacada", "en"].includes(texto)) return "Ameaçado";
  if (["vulneravel", "vu"].includes(texto)) return "Vulnerável";
  if (["quase ameacado", "quase ameacada", "nt"].includes(texto)) return "Quase Ameaçado";
  if (["menor preocupacao", "lc"].includes(texto)) return "Menor Preocupação";
  return "Não informado";
}

// Preparado para quando sua rota GET /animais estiver disponível.
// Usa dados retornados pelo servidor, sem inventar imagens ou classificações ausentes.
export function adaptarAnimaisDaAPI(lista) {
  return lista.map((a, indice) => {
    const grupo = grupoPadronizado(a.grupo ?? a.classe_especie);
    return {
      id: String(a.id ?? `${grupo}-${a.id_animal ?? indice}`),
      nome_popular: a.nome_popular ?? a.nome ?? "Espécie sem nome",
      nome_cientifico: a.nome_cientifico ?? "Não informado",
      grupo,
      status_conservacao: statusPadronizado(a.status_conservacao),
      ocorrencia: a.ocorrencia ?? a.habitat ?? "Não informada",
      populacao: a.populacao ?? "Não informada",
      tendencia: a.tendencia ?? a.tendencia_populacional ?? "Desconhecida",
      causa: a.causa_extincao ?? a.causa ?? "Não informada",
      descricao: a.descricao ?? a.caracteristicas ?? "Sem descrição cadastrada.",
      imagem: a.imagem ?? a.imagem_url ?? "",
      icone: "🐾"
    };
  });
}
