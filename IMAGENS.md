# Imagens do site

Regra dos nomes: só letras minúsculas sem acento, números e hífen. **O site não acha a imagem se o nome estiver diferente, nem que seja um acento.**

Mockup de livro sempre em **PNG com fundo transparente** (JPEG desenha um retângulo branco em volta). O padrão dos mockups é 623 × 1080.

---

## Está tudo no lugar

Todas as imagens que o site referencia existem no pacote. Nenhuma imagem quebrada, nenhum bloco esperando arquivo, com uma exceção listada no fim.

```
img/
  palestra.jpg                seção "Palestras e eventos" na home
  favicon.png                 ícone da aba (ativo em todas as páginas)
  og-padrao.jpg               miniatura ao compartilhar link (1200 × 630)
  malha.svg                   malha de fundo de todo o site
  icone-instagram.svg  icone-youtube.svg  icone-tiktok.svg
  cerebro-duas-camadas.jpg    Virtologia, Trazemos o Futuro, Ondas, Aula 1
  senado.jpg                  Aula 1, Pós-graduação
  eduardo-padilha.jpg         Humanização 2.0 (vertical)
  autoridade-padilha.jpg      página do livro Sistemas Humanizados
  autoridade-victor-cesar.jpg página do livro Sistemas Humanizados
  hero-sistemas-livro.jpg     topo da página do livro Sistemas Humanizados
  certificado-guia.jpg        prêmio, na página do Guia
  + 5 fotos institucionais com nome longo, usadas na galeria da Pós-graduação

img/livros/                   capas
  fundamentos-da-virtologia.png
  manual-desenvolvimento-humano.png
  guia-das-virtudes.png
  teimosia-de-viver.png
  envelheci-e-dai.png
  sistemas-humanizados.avif

img/guia/                     página do Guia das Virtudes
  hero-guia.jpg  familia-guia.jpg  crianca-guia.jpg  crianca-mae-guia.jpg

img/noticias/                 carrossel da home (16:9)
  senado.jpg  secretario-seguranca-rj.jpg  instituto-dr-arnaldo.jpg
  ministra-das-mulheres.jpg  franco-da-rocha.jpg  rondonopolis-penitenciaria.jpg
  jp-news.jpg  policia-penal-londrina.jpg  socioeducativo-rondonopolis.jpg

img/trabalho/                 seção "Onde o trabalho acontece" na home (1:1)
  novo-eu.jpg  guia-das-virtudes.jpg  humanizacao-carceraria.jpg
```

---

## Pendências

Nenhuma imagem faltando. Todos os blocos do site estão ativos.

Restam apenas dois botões comentados no `index.html`, esperando páginas que ainda não existem:

- na seção "Onde o trabalho acontece", um botão para `/projetos/`
- na seção "Palestras e eventos", um botão para `/palestras/`

Para ativar qualquer um deles, abra `index.html`, encontre a linha comentada e remova o `<!--` do começo e o `ATIVAR quando ... -->` do fim.
