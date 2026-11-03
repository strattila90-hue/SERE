import json,glob,sys
d={l:json.load(open(f'tools/i18n/{l}.json')) for l in ('en','sk')}
for f in sorted(glob.glob('/home/claude/work/tr/t*.txt')):
    for line in open(f):
        p=[x.strip() for x in line.rstrip('\n').split('⟫')]
        if len(p)==3 and p[0]: d['en'][p[0]]=p[1]; d['sk'][p[0]]=p[2]
for l in d: json.dump(d[l],open(f'tools/i18n/{l}.json','w'),ensure_ascii=False,indent=0)
pat=open('tools/i18n/patterns.js').read()
for l in d:
    js='/* generálva — tools/i18n */\n'+(pat+'\n' if l=='en' else '')+f'window.SERE_I18N=window.SERE_I18N||{{}};window.SERE_I18N.{l}='+json.dumps(d[l],ensure_ascii=False,separators=(',',':'))+';\n'
    open(f'js/i18n.{l}.js','w').write(js)
print({l:len(d[l]) for l in d})
