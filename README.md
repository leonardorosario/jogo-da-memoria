# Jogo da Memória – React Native (Expo)

Trabalho N2 de Programação Mobile. App feito com React Native + Expo + JavaScript + SQLite.

## Como executar

```bash
npm install
npx expo start
```

Depois é só abrir no celular com o app **Expo Go** (lendo o QR Code) ou num emulador Android/iOS.

## Funcionalidades

- **Figuras**: cadastrar figuras (imagem da galeria + descrição), listar e excluir.
  Não salva sem imagem nem sem descrição. Os dados ficam no SQLite do aparelho.
- **Jogar**: sorteia 6 figuras, duplica e embaralha em 12 cartas (fechadas com "?").
  Vira duas cartas por vez; se acertar, o par fica aberto; se errar, conta um erro e as cartas fecham.
  Ao final mostra a mensagem de conclusão e o total de erros.
- **Bônus**
  - Cronômetro em tempo real.
  - Animação de virar a carta (`Animated`).
  - Ranking com os 5 melhores (jogador, pontuação, data), salvo no SQLite.
    Pontuação = 100 − 5 por erro − 1 a cada 5 segundos.

> É preciso cadastrar pelo menos 6 figuras antes de jogar.

## Estrutura

```
App.js                 -> abas (Figuras / Jogar / Ranking)
src/db.js              -> banco SQLite (figuras e recordes)
src/CadastroScreen.js  -> tela de cadastro
src/JogoScreen.js      -> tela do jogo
src/Carta.js           -> carta com animação
src/RankingScreen.js   -> tela de ranking
```

Ao entregar no Moodle, apague a pasta `node_modules`.
