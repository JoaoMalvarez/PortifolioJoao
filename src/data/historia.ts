// src/data/historia.ts
// ==========================================================
// A HISTÓRIA DO BOSQUE. É AQUI que você escreve tudo.
// O jogo (BosqueView.vue) só lê este arquivo.
// ==========================================================

// ----- tipos (não precisa mexer) -----
export type Teste = {
  dificuldade: number // o jogador precisa tirar isso ou mais no d20 (somando o bônus)
  bonus?: number // opcional: bônus somado ao dado (ex: 2 = "é uma ação fácil pra você")
  sucesso: string // id da cena se passar
  falha: string // id da cena se falhar
  dano?: number // vida perdida se falhar (opcional)
}

export type Escolha = {
  texto: string // texto do botão
  vai?: string // id da cena (vai direto, sem dado)
  teste?: Teste // OU rola um d20
}

export type Cena = {
  id: string // nome único da cena (usado em "vai", "sucesso" e "falha")
  titulo?: string
  texto: string[] // cada item é um parágrafo
  fundo?: string // opcional: imagem só desta cena (ex: '/bosque/Lobo.jpg')
  escolhas?: Escolha[]
  status?: string // status de como voce está
  fim?: 'vitoria' | 'derrota' | 'fim' // marque nas cenas que terminam o jogo
}

// ----- configuração -----
export const configuracao = {
  inicio: 'comeco', // id da primeira cena
  vidaInicial: 3, // quantos corações o jogador tem
  statusInicial: 'zonzo', // após acordar após o comerciante te enganar
  cenaSemVida: 'derrota-vida', // cena (com fim) para quando a vida chega a 0
}

// ----- cenas -----
// Imagens: tudo fica em public/bosque/ e o caminho começa em /bosque/ (nunca /public/)
export const cenas: Cena[] = [
  {
    id: 'comeco',
    titulo: 'A Entrada do Bosque',
    texto: [
      'Após conversar com um comerciante suspeito e ele te prometer uma vida de riquezas, você acorda em uma floresta, nela você vê um brilho na distância.',
      'Há uma trilha de terra e, mais adiante, um riacho com pedras, que está no caminho do brilho.',
    ],
    fundo: '/bosque/comeco.jpg',
    escolhas: [
      { texto: 'Seguir pela trilha de terra', vai: 'trilha' },
      {
        texto: 'Ir a caminho do brilho e atravessar o riacho pulando nas pedras',
        teste: { dificuldade: 10, sucesso: 'teste', falha: 'riacho-falha' },
      },
    ],
  },
  {
    id: 'riacho-falha',
    titulo: 'Escorregou!',
    texto: ['Seu pé escorrega e você cai na água gelada. Suas roupas ficam encharcadas, mas você se levanta.'],
    fundo: '/bosque/riacho-falha.jpg',
    escolhas: [{ texto: 'Seguir até a clareira', vai: 'teste' }],
  },
  {
    id: 'teste',
    titulo: 'Teste de Percepção',
    texto: ['Enquanto você caminha para a luz você começa a perceber algo...'],
    fundo: '/bosque/comeco.jpg', // provisório: troque quando tiver uma imagem só desta cena
    escolhas: [
      {
        texto: 'Seguir até a clareira',
        teste: { dificuldade: 10, sucesso: 'clareira', falha: 'buraco', dano: 1 },
      },
    ],
  },
  {
    id: 'buraco',
    titulo: 'A queda',
    texto: [
      'Você não percebe e acaba caindo em uma armadilha antiga.',
      'Por algum milagre você conseguiu cair em alguns cipós que te seguram para o que seria uma queda fatal.',
      'A partir disso, você consegue se soltar e se depara em uma masmorra.',
      'O buraco está muito acima para você alcançar com suas mãos, e para trás tem outro buraco que leva para uma armadilha.',
    ],
    fundo: '/bosque/buraco.jpg',
    escolhas: [{ texto: 'Seguir em frente', vai: 'masmorra' }],
  },
  {
    id: 'clareira',
    titulo: 'A Clareira',
    texto: [
      'Você atravessa a mata e consegue desviar de uma armadilha, que olhando para baixo, parece ser fatal, com espinhos afiados no fundo.',
      'Ao chegar de onde a luz vinha, você se depara com um baú, parece que dentro tem muitos tesouros, e ele te chama, como se fosse feito para você.',
      'Após todos esses desafios, você pensa: "Eu mereço", e o baú concorda, você deve abri-lo',
    ],
    fundo: '/bosque/clareira.jpg',
    escolhas: [
      {
        texto: 'Fugir do encanto do baú',
        teste: { dificuldade: 15, bonus: 1, sucesso: 'fuga', falha: 'mimico' },
      },
      { texto: 'Abri-lo, sem hesitar', vai: 'mimico' },
    ],
  },
  {
    id: 'mimico',
    titulo: 'Um Mímico????',
    texto: [
      'Ao abrir o baú sem nem perceber, você olha dentro dele tem uma grande e maravilhosa... LÍNGUA???',
      'Você percebe tarde demais que era uma armadilha, e que o baú na verdade era um mímico, que quer te devorar, mas você já está dentro dele.',
    ],
    fundo: '/bosque/mimico.jpg',
    escolhas: [
      {
        texto: 'Se libertar!',
        teste: { dificuldade: 15, sucesso: 'final-triste', falha: 'mimico', dano: 1 },
      },
    ],
  },
  {
    id: 'trilha',
    titulo: 'A caverna',
    texto: [
      'Após uma longa caminhada, passando por várias árvores e animais, você se depara com uma caverna escura e medonha.',
      'Ao olhar para trás, você percebe que suas pegadas sumiram, e que a árvore que você acabou de passar está de certa forma diferente.',
    ],
    fundo: '/bosque/caverna.jpg',
    escolhas: [
      {
        texto: 'Entrar na caverna',
        vai: 'caverna',
      },
      {
        texto: 'Tentar voltar o caminho',
        teste: { dificuldade: 9, sucesso: 'clareira', falha: 'perdido' },
      },
    ],
  },
  {
    id: 'caverna',
    titulo: 'A escuridão',
    texto: [
      'Na escuridão, um leve toque pode te assustar, ou até a falta dele. Andando com muito cuidado pela caverna você ouve metal batendo com tudo no chão atrás de você.',
      'Ao olhar para trás, você percebe que a caverna era a porta da frente de uma masmorra.',
      'Com seu coração a mil, você segue em frente, você encontra com uma luz externa, que ilumina uma armadilha fatal, após atravessá-la você encontra uma porta de ferro.',
      'O que você deseja fazer?',
    ],
    fundo: '/bosque/dentro_caverna.jpg',
    escolhas: [
      {
        texto: 'Tentar virar a maçaneta',
        vai: 'masmorra2',
      },
      {
        texto: 'Tentar arrombar a porta',
        teste: { dificuldade: 12, sucesso: 'masmorra2', falha: 'masmorra', dano: 1 },
      },
      {
        texto: 'Tentar orar aos deuses por iluminação',
        teste: { dificuldade: 2, sucesso: 'masmorra2', falha: 'abandonado-pelos-deuses', dano: 1 },
      },
    ],
  },
  {
    id: 'masmorra',
    titulo: 'A Porta',
    texto: [
      'E você se depara com uma porta de ferro...',
      'Como vai seguir o caminho?',
    ],
    fundo: '/bosque/porta.jpg',
    escolhas: [
      {
        texto: 'Tentar virar a maçaneta',
        vai: 'masmorra2',
      },
      {
        texto: 'Tentar arrombar a porta',
        teste: { dificuldade: 12, sucesso: 'masmorra2', falha: 'masmorra', dano: 1 },
      },
      {
        texto: 'Tentar orar aos deuses por iluminação',
        teste: { dificuldade: 2, sucesso: 'masmorra2', falha: 'abandonado-pelos-deuses', dano: 1 },
      },
    ],
  },
  {
    id: 'abandonado-pelos-deuses',
    titulo: 'A Porta',
    texto: [
      'Após orar muito, ninguém te responde, nem mesmo os deuses mais nefastos, com uma tristeza no coração e na alma você percebe que a porta já estava aberta...',
      'Você segue o caminho, percebendo que poderia viver sem saber que nenhum deus sequer olhou para você.',
    ],
    fundo: '/bosque/porta.jpg',
    escolhas: [
      {
        texto: 'Tentar virar a maçaneta',
        vai: 'masmorra2',
      },
      {
        texto: 'Tentar arrombar a porta',
        teste: { dificuldade: 12, sucesso: 'masmorra2', falha: 'masmorra', dano: 1 },
      },
      {
        texto: 'Tentar encontrar um canto escuro para chorar',
        vai: 'fim-fatal',
      },
    ],
  },
  {
    id: 'perdido',
    titulo: 'O Perdido',
    texto: [
      'Você se encontra perdido na floresta, mas após 2 luas passarem você encontra o mesmo riacho que você encontrou 2 dias atrás, com frio, fome e medo, você decide comer umas frutas que encontrou perto e descansar um pouco.',
      'Após acordar você tem a mesma escolha a fazer:',
    ],
    fundo: '/bosque/perdido.jpg',
    escolhas: [
      { texto: 'Seguir pela trilha de terra', vai: 'trilha' },
      {
        texto: 'Ir a caminho do brilho e atravessar o riacho pulando nas pedras',
        teste: { dificuldade: 10, sucesso: 'teste', falha: 'riacho-falha' },
      },
    ],
  },
  {
    id: 'fuga',
    titulo: 'A fuga',
    texto: [
      'Após fugir do encanto da ganância, você acha que está a salvo, até que...',
      'Você sente a gravidade te levando ao chão, você conseguiu cair na armadilha. Lembrando que a queda parecia ser fatal, lágrimas saem dos seus olhos, e você vê a sua vida passando na frente dos seus olhos.',
      'Até que você dá de cara na grama, seu cérebro te enganou!',
    ],
    fundo: '/bosque/buraco.jpg',
    escolhas: [
      { texto: 'Continuar caminho', vai: 'buraco' },
      { texto: 'Voltar para o baú', vai: 'clareira' },
    ],
  },
  {
    id: 'masmorra2',
    titulo: 'Time skip',
    texto: [
      'Após atravessar a porta (da forma que você conseguiu), você realiza vários desafios, como pular armadilhas de fogo, aprender magia, fugir de goblins',
      'Você percebe que chegou ao fim da masmorra, com um tesouro final, o maior desejo de todos os aventureiros! E assim que você se dá conta, você se tornou um aventureiro, você realizou feitos incríveis, e o mais incrível de tudo, você se divertiu.',
      'Abriu o baú, na qual tinha um pergaminho, nele você leu sobre uma aventura incrível, e no fim estava o seu nome, você sempre esteve destinado a isso.',
      'Com isso, você foi embora, voltou para o seu emprego e se demitiu, e decidiu se tornar um aventureiro.',
      'Meses depois de tudo isso você se encontra de frente a uma guilda, e você deu seu primeiro passo para seu futuro.',
    ],
    fundo: '/bosque/end1.jpg',
    fim: 'vitoria',
  },
  {
    id: 'fim-fatal', // easter egg
    titulo: 'O seu fim',
    texto: [
      'Com a realização de que nem o deus de tudo que é de ruim lhe quer, você decide encontrar um canto para chorar em paz, mas sem querer e sem forças, tropeça e cai na armadilha',
      'Após longos agonizantes segundos de queda, você chega ao fim, e percebe que nem o deus da morte lhe quer, logo, você se tornou imortal.',
      'Abandonado pelos deuses? Sim',
      'Imortal? Também',
      'E no fim você decide dedicar a sua vida para melhorar a dos outros, pois você não vai fazer o mesmo que os deuses um dia fizeram a você com pessoas que merecem o bem.',
    ],
    fundo: '/bosque/end2.jpg',
    fim: 'fim',
  },
  {
    id: 'final-triste',
    titulo: 'O final',
    texto: [
      'Após escapar da boca do mímico, você começa a ficar cada vez mais cansado, pode ser pelo tanto de esforço que você realizou, ou pelo buraco na barriga causado por ele.',
      'Mas independente da causa, você decide descansar em uma árvore, sua visão começa a ficar turva, e quando você finalmente decide descansar seus olhos pela última vez, você vê uma figura se aproximando.',
      'Seu corpo não consegue reagir, e sua mente só torce que essa figura te ajude, e por fim você fecha os olhos e...',
    ],
    fundo: '/bosque/end3.jpg',
    fim: 'fim',
  },
  {
    id: 'derrota-vida',
    titulo: 'A Jornada Termina',
    texto: ['Suas forças se esgotam. O bosque guarda silêncio... e esse pode ser seu fim, a menos que você queira'],
    fundo: '/bosque/derrota.jpg',
    fim: 'derrota',
  },
]

// Verificação: só roda no modo de desenvolvimento
if (import.meta.env.DEV) {
  const ids = new Set(cenas.map((c) => c.id))
  const checar = (de: string, para?: string) => {
    if (para && !ids.has(para)) console.warn(`[historia] "${de}" aponta para "${para}", que não existe`)
  }
  checar('configuracao.inicio', configuracao.inicio)
  checar('configuracao.cenaSemVida', configuracao.cenaSemVida)
  cenas.forEach((c) =>
    c.escolhas?.forEach((e) => {
      checar(c.id, e.vai)
      checar(c.id, e.teste?.sucesso)
      checar(c.id, e.teste?.falha)
    }),
  )
}