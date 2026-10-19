"""Gera /sistemas-humanizados/b/ (variante B) a partir de /sistemas-humanizados/ (controle A).

A única diferença de conteúdo é o bloco de vídeo "Veja o livro por dentro", inserido logo
depois dos cartões de compra iniciais e antes de "Nesta página". Todo o resto (textos, preços,
ordem, botões, checkout, pixel, GA) vem da página A.

Sempre que a página A mudar, rode de novo, na raiz do repositório:
    python3 _ferramentas/gerar_variante_b_livro.py

Pastas que começam com "_" não são publicadas pelo GitHub Pages.
"""
import re, pathlib, sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
A = RAIZ / 'sistemas-humanizados' / 'index.html'
B = RAIZ / 'sistemas-humanizados' / 'b' / 'index.html'

VIDEO_ID = 'DPeaNqJu2bc'
# Capa do vídeo (imagem leve mostrada antes do clique). Enquanto ela não existir,
# a capa provisória usa a capa do livro sobre fundo escuro.
CAPA = 'img/livro-por-dentro-capa.jpg'

def bloco_video(prefixo, tem_capa):
    if tem_capa:
        miolo = f'<img src="{prefixo}{CAPA}" alt="Eduardo Casarotto com o livro Sistemas Humanizados: o que tem nesse livro?" width="1080" height="1350" loading="lazy">'
    else:
        miolo = (f'<span class="v45-padrao"><img src="{prefixo}img/livros/sistemas-humanizados.avif" alt="" '
                 'width="560" height="1032" loading="lazy"><span>As páginas e o conteúdo real do livro</span>'
                 '<span class="video45-play" aria-hidden="true"></span></span>')
    return f'''
    <div class="video45-bloco" id="por-dentro">
      <h2>Veja o livro por dentro</h2>
      <div class="video45">
        <button type="button" class="video45-capa{' com-capa' if tem_capa else ''}" data-yt="{VIDEO_ID}" data-titulo="Veja o livro Sistemas Humanizados por dentro" aria-label="Assistir ao vídeo: veja o livro por dentro">
          {miolo}{'' if not tem_capa else chr(10)+'          <span class="video45-play" aria-hidden="true"></span>'}
        </button>
      </div>
    </div>
'''

def gerar():
    s = A.read_text(encoding='utf-8')
    # 1. caminhos relativos: a B fica um nível abaixo
    s = re.sub(r'((?:href|src)=")\.\./', r'\1../../', s)
    # 2. não concorrer na busca: noindex + canonical da A (a A já declara o próprio canonical)
    assert '<link rel="canonical" href="https://institutovirtudes.com.br/sistemas-humanizados/">' in s
    s = s.replace('<link rel="canonical"', '<meta name="robots" content="noindex, follow">\n<link rel="canonical"', 1)
    # 3. identifica a variante (eventos e checkout)
    s, n = re.subn(r'<body([^>]*)data-variante="a"', r'<body\1data-variante="b"', s, count=1)
    assert n == 1, 'A página A precisa ter data-variante="a" no <body>'
    s = s.replace('data-src-checkout="livro-sh-a"', 'data-src-checkout="livro-sh-b"', 1)
    # Ofertas próprias da página B na Greenn (físico e digital)
    for de, para in (('https://payfast.greenn.com.br/125356"', 'https://payfast.greenn.com.br/125356/offer/ShfwB0"'),
                     ('https://payfast.greenn.com.br/154084"', 'https://payfast.greenn.com.br/154084/offer/JhJu2t"')):
        assert s.count(de) == 2, de
        s = s.replace(de, para)
    # 4. bloco de vídeo entre os cartões de compra iniciais e "Nesta página"
    m = re.search(r'(<div class="precos" id="versoes">.*?\n    </div>\n)(\s*<nav class="indice")', s, re.S)
    assert m, 'Não encontrei os cartões de compra seguidos de "Nesta página"'
    tem_capa = (RAIZ / CAPA).exists()
    s = s[:m.end(1)] + bloco_video('../../', tem_capa) + s[m.start(2):]
    B.parent.mkdir(parents=True, exist_ok=True)
    B.write_text(s, encoding='utf-8')
    print('ok:', B.relative_to(RAIZ), '| capa própria' if tem_capa else '| capa provisória')

if __name__ == '__main__':
    gerar()
