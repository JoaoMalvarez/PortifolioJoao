// src/utils/asset.ts
// Monta o endereço correto de um arquivo da pasta public/.
// No seu computador o site fica em "/", mas no GitHub Pages fica em
// "/PortifolioJoao/". Esta função resolve os dois casos sozinha.
//
// asset('/personagens/p1.png')  ->  '/personagens/p1.png'              (local)
//                                   '/PortifolioJoao/personagens/p1.png' (GitHub Pages)
export function asset(caminho: string): string {
  return import.meta.env.BASE_URL + caminho.replace(/^\//, '')
}
