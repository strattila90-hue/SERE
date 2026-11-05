#!/usr/bin/env python3
"""SERE PIXEL — nyomtatható A4 PDF készítése 3 nyelven (hu, en, sk).

Használat (a repó gyökeréből):
    pip install playwright pypdf && python3 -m playwright install chromium
    python3 tools/pdf/make_pdf.py            # -> pdf/SERE-PIXEL-hu.pdf, -en.pdf, -sk.pdf

Két menetben dolgozik: az első menet után kikeresi, melyik oldalon kezdődnek a fejezetek,
és a második menetben beírja az oldalszámokat a tartalomjegyzékbe.
"""
import asyncio, functools, http.server, json, os, re, socketserver, sys, threading
from playwright.async_api import async_playwright
from pypdf import PdfReader

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'pdf')
LANGS = sys.argv[1:] or ['hu', 'en', 'sk']
VERSION = re.search(r"SERE_VERSION = '([^']+)'", open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()).group(1)
FOOT = {'hu': 'Gyakorló segédlet – nem helyettesíti a hivatalos kiképzést', 'en': 'Practice aid – does not replace official training', 'sk': 'Cvičná pomôcka – nenahrádza oficiálny výcvik'}


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Quiet, directory=ROOT)
    srv = socketserver.TCPServer(('127.0.0.1', 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def find_pages(path):
    pages = {}
    for i, p in enumerate(PdfReader(path).pages, 1):
        for m in re.findall(r'QXQ([A-Za-z0-9]+?)QXQ', (p.extract_text() or '').replace('\n', '')):
            pages.setdefault(m, i)
    return pages


async def render(pg, url, path, lang, pages):
    await pg.add_init_script(f"window.SERE_VERSION={json.dumps(VERSION)};window.__PAGES__={json.dumps(pages)};")
    await pg.goto(url)
    await pg.wait_for_function('window.__READY__ === true')
    await pg.evaluate('document.fonts.ready')
    await pg.wait_for_timeout(300)
    foot = (f'<div style="width:100%;font:8px Inter,sans-serif;color:#777;padding:0 15mm;display:flex;justify-content:space-between">'
            f'<span>SERE PIXEL · v{VERSION} · {FOOT[lang]}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')
    await pg.pdf(path=path, format='A4', print_background=True, prefer_css_page_size=True, display_header_footer=True,
                 header_template='<div></div>', footer_template=foot, outline=True, tagged=True)


async def main():
    os.makedirs(OUT, exist_ok=True)
    srv = serve(); port = srv.server_address[1]
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for lang in LANGS:
            url = f'http://127.0.0.1:{port}/tools/pdf/print.html?lang={lang}'
            path = os.path.join(OUT, f'SERE-PIXEL-{lang}.pdf')
            ctx = await b.new_context(); pg = await ctx.new_page()
            await render(pg, url, path, lang, {})
            pages = find_pages(path)
            await ctx.close(); ctx = await b.new_context(); pg = await ctx.new_page()
            await render(pg, url, path, lang, pages)
            n = len(PdfReader(path).pages)
            print(f'{lang}: {n} oldal, {os.path.getsize(path) // 1024} KB -> {path}')
            await ctx.close()
        await b.close()
    srv.shutdown()

asyncio.run(main())
# ellenőrzés: kérdések oldaltörése és megoldókulcs
import subprocess as _sp
_sp.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_pdf.py')])
