#!/usr/bin/env python3
"""SERE PIXEL PDF ellenőrzés: minden vizsgakérdés a 4 válaszával egy oldalon van-e,
hiánytalan-e a kérdéssor, és a megoldókulcs a helyes válaszra mutat-e. (pdftotext kell hozzá)"""
import json, re, subprocess, sys
from pypdf import PdfReader
import os
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
# kvíz és fordítások betöltése node-dal
QZ=json.loads(subprocess.check_output(['node','-e',"global.window={};require('./js/quiz.js');console.log(JSON.stringify(window.SERE_QUIZ))"],cwd=ROOT))
TR={l:json.load(open(f'{ROOT}/tools/i18n/{l}.json')) for l in ('en','sk')}
order=[c for c in QZ]
norm=lambda s: re.sub(r'[^\w]','',s.lower())
ok_all=True
for lang in ('hu','en','sk'):
    T=(lambda s:s) if lang=='hu' else (lambda s,l=lang: TR[l].get(s,s))
    r=PdfReader(f'{ROOT}/pdf/SERE-PIXEL-{lang}.pdf')
    pdf=f'{ROOT}/pdf/SERE-PIXEL-{lang}.pdf'
    texts=subprocess.run(['pdftotext','-layout',pdf,'-'],capture_output=True,text=True).stdout.split('\f')[:len(r.pages)]
    start=next(i for i,t in enumerate(texts) if 'QXQexam' in t); end=next(i for i,t in enumerate(texts) if 'QXQkey' in t)
    problems=[]; found={}   # (fejezet, kérdés#) -> oldal
    exam_pages=list(range(start,end))
    # minden vizsgaoldal: kérdésszámok és A-D válaszok ugyanazon az oldalon
    per_page=[]
    for i in exam_pages:
        t=texts[i]
        qs=[(m.start(),int(m.group(1))) for m in re.finditer(r'(?m)^ {0,4}(\d{1,2})\. ',t)]
        for k,(pos,n) in enumerate(qs):
            seg=t[pos: qs[k+1][0] if k+1<len(qs) else len(t)]
            letters=set(re.findall(r'(?:^|\s)([A-D])\)',seg))
            if letters!={'A','B','C','D'}: problems.append(f'{i+1}. oldal, {n}. kérdés: válaszok hiányoznak ezen az oldalon ({sorted(letters)})')
        per_page.append((i+1,[n for _,n in qs]))
        # oldal eleje nem lehet magányos válasz
        first=next((x for x in t.split('\n') if x.strip() and 'QXQ' not in x), '')
        if re.match(r'^\s*[A-D]\)',first): problems.append(f'{i+1}. oldal a tetején egy előző kérdés válaszával kezdődik')
    # fejezetenként: 1..N egy oldalon, hiánytalanul
    # egy fejezet folytatódhat a következő oldalon (ha nem 1-gyel kezdődik) – összevonjuk
    chap_pages=[]
    for pg,nums in per_page:
        if not nums: continue
        if chap_pages and nums[0]!=1: chap_pages[-1]=(chap_pages[-1][0],chap_pages[-1][1]+nums,chap_pages[-1][2]+[pg])
        else: chap_pages.append((pg,nums,[pg]))
    spans=[c for c in chap_pages if len(c[2])>1]
    pages_of={c[0]:c[2] for c in chap_pages}
    chap_pages=[(c[0],c[1]) for c in chap_pages]
    if len(chap_pages)!=len(order): problems.append(f'{len(chap_pages)} kérdéses oldal, de {len(order)} fejezet')
    for (pg,nums),cid in zip(chap_pages,order):
        if nums!=list(range(1,len(QZ[cid])+1)): problems.append(f'{pg}. oldal ({cid}): kérdésszámok {nums}')
    # megoldókulcs ellenőrzése: a kulcs betűje a helyes választ jelöli-e
    keytxt=' '.join(texts[end:end+3])
    keys=re.findall(r'((?:\d{1,2}\.\s*[A-D]\s*)+)',keytxt)
    allkeys=[re.findall(r'(\d{1,2})\.\s*([A-D])',k) for k in keys]
    flat=[x for k in allkeys for x in k]
    seq=[];cur=[]
    for n,L in flat:
        if n=='1' and cur: seq.append(cur);cur=[]
        cur.append(L)
    if cur: seq.append(cur)
    keymis=0; checked=0
    span_of={c[0]:c[2] for c in [(x[0],None,y) for x,y in zip(chap_pages,[[p] for p,_ in chap_pages])]}
    for (pg,nums),cid,ks in zip(chap_pages,order,seq):
        t='\n'.join(texts[q-1] for q in pages_of[pg])
        qs=[(m.start(),int(m.group(1))) for m in re.finditer(r'(?m)^ {0,4}(\d{1,2})\. ',t)]
        for k,(pos,n) in enumerate(qs):
            seg=t[pos: qs[k+1][0] if k+1<len(qs) else len(t)]
            opts={}
            for line in seg.split('\n'):
                for L,v in re.findall(r'([A-D])\) (.+?)(?=\s{2,}[A-D]\) |$)',line.strip()): opts[L]=v.strip()
            checked+=1; good=norm(T(QZ[cid][n-1][1]))[:14]
            hit=[L for L,v in opts.items() if norm(v).startswith(good[:min(len(good),len(norm(v)))]) and norm(v)]
            if not hit or ks[n-1] not in hit: keymis+=1; problems.append(f'{cid} {n}. kérdés: kulcs {ks[n-1]}, helyes válasz itt: {hit}')
    if len(seq)!=len(order): problems.append(f'kulcs: {len(seq)} fejezet a {len(order)} helyett')
    nq=sum(len(QZ[c]) for c in order)
    if spans: print(f'   ({lang}: két oldalra kifutó kérdéssor, kérdés nem vágódik: '+', '.join(f"{c[2]}" for c in spans)+')')
    print(f'{lang.upper()}: {len(r.pages)} oldal | vizsga {start+1}–{end}. oldal | {len(chap_pages)} fejezet, {nq} kérdés, kulcs ellenőrizve: {checked} | ' + ('HIBÁTLAN' if not problems else f'{len(problems)} HIBA'))
    for x in problems[:15]: print('   -',x)
    ok_all &= not problems
sys.exit(0 if ok_all else 1)
