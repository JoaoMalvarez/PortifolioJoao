// src/data/velas.ts
// Cada vela da igreja conta uma parte da sua história.
// Edite os textos à vontade: mantenha o que soar como VOCÊ.
export type Vela = {
  id: string
  titulo: string
  texto: string[]
  link?: { nome: string; url: string }
  imagem?: string // com "s" minúsculo
  x?: number
  y?: number
  w?: number
  cor?: string
}

export const velas: Vela[] = [
  {
    id: 'tema',
    titulo: 'Por que um mundo de RPG?',
    texto: [
      'Eu jogo RPG, e criar mundos e personagens é algo que hoje faço sem nem pensar.',
      'Escolhi esse tema porque, além de ser algo que eu amo, é assim que eu me imagino: construindo mundos, só que agora com código.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 40, 
    y: 85,
    w: 10,
  },
  {
    id: 'primeiro-jogo',
    titulo: 'O primeiro jogo',
    texto: [
      'Na infância, o jogo que eu mais amei foi LEGO Batman.',
      'Já o primeiro que me marcou de verdade foi Detroit: Become Human. Eu me apaixonei por ele antes mesmo de jogar, só assistindo outras pessoas jogarem.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 90, 
    y: 94,
    w: 10,
  },
  {
    id: 'cc',
    titulo: 'Por que Ciência da Computação?',
    texto: [
      'Eu sempre quis entender como um computador funciona por dentro.',
      'E sempre tive o sonho de conseguir criar algo meu, como um jogo.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 50, 
    y: 86,
    w: 10,
  },
  {
    id: 'primeiro-codigo',
    titulo: 'A primeira linha de código',
    texto: [
      'A primeira coisa que programei foi um Hello World em Python.',
      'Mas o primeiro código que fiz por vontade própria foi um projeto de RPG: você coloca a sua ficha de personagem e o programa responde quantos pontos você tem para distribuir nos dados. Era bem bruto (todos os dados precisavam ser digitados direto no código), mas eu achei maravilhoso.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 30, 
    y: 92,
    w: 10,
  },
  {
    id: 'fora-do-pc',
    titulo: 'Fora do computador',
    texto: [
      'Quando não estou programando, estou jogando, lendo um livro ou com as pessoas que gosto.',
      'Também jogo RPG de mesa com os meus amigos, que é onde boa parte das minhas ideias nasce.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 76, 
    y: 80,
    w: 10,
  },
  {
    id: 'desafio',
    titulo: 'O maior desafio',
    texto: [
      'O projeto que mais me deu trabalho foi o Interpret, do MackLEAPS, no qual eu e uma amiga fizemos grande parte do front-end do site.',
      'Foi onde eu aprendi a trabalhar em dupla em um projeto de verdade, com prazo e com gente de fora usando o resultado.',
    ],
    link: { nome: 'Ver o Interpret', url: 'https://mackleaps.mackenzie.br/interpret/' },
    imagem: '/igreja/Vela1.png',
    x: 25, 
    y: 80,
    w: 10,
  },
  {
    id: 'ferramenta',
    titulo: 'Minha ferramenta favorita',
    texto: [
      'O Vue.js. Ele é uma ferramenta para criar SPAs (sites de uma página só que trocam de tela sem recarregar) e é muito didático, porque dá para ir aprendendo enquanto se constrói.',
      'Este portfólio inteiro foi feito com ele.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 70, 
    y: 92,
    w: 10,
  },
  {
    id: 'curiosidade',
    titulo: 'Uma curiosidade',
    texto: [
      'Eu só tive um computador de verdade quando comecei a faculdade.',
      'Tudo o que eu sei antes disso veio de vontade e de aprender com o que eu tinha à mão.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 60, 
    y: 85,
    w: 10,
  },
  {
    id: 'conselho',
    titulo: 'Um conselho',
    texto: [
      'Se você se esforçar muito e quiser muito, você consegue o que quiser.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 10, 
    y: 94,
    w: 10,
  },
  {
    id: 'futuro',
    titulo: 'Onde me imagino',
    texto: [
      'Daqui a alguns anos, eu me vejo trabalhando com algo que gosto, numa casa boa e com a minha família por perto.',
    ],
    imagem: '/igreja/Vela1.png',
    x: 50, 
    y: 56.9,
    w: 2,
  },
]