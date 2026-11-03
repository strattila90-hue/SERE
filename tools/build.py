#!/usr/bin/env python3
"""Markdown-szerű forrás (src/c*.md) -> sere-pixel/js/content.js"""
import json, re, glob, sys

src_dir, out = sys.argv[1], sys.argv[2]
chapters = []
for path in sorted(glob.glob(f"{src_dir}/c*.md")):
    ch, sec = None, None
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip("\n")
        if not line.strip():
            continue
        if line.startswith("# "):
            parts = [p.strip() for p in line[2:].split("|")]
            ch = {"id": parts[0], "title": parts[1], "sub": parts[2] if len(parts) > 2 else "", "sections": []}
            chapters.append(ch)
            continue
        if line.startswith("## "):
            parts = [p.strip() for p in line[3:].split("|")]
            sec = {"id": parts[0], "title": parts[1], "web": len(parts) > 2 and parts[2] == "web", "blocks": []}
            ch["sections"].append(sec)
            continue
        m = re.match(r"^(\d+)\.\s+(.*)", line)
        if line.startswith("- "):
            kind, text = "li", line[2:]
        elif m:
            kind, text = "ol", m.group(2)
        elif line.startswith("! "):
            kind, text = "warn", line[2:]
        elif line.startswith("+ "):
            kind, text = "ok", line[2:]
        elif line.startswith("> "):
            kind, text = "quote", line[2:]
        else:
            kind, text = "p", line
        # összevonás: egymást követő li / ol blokkok listává
        b = sec["blocks"]
        if kind in ("li", "ol") and b and b[-1]["t"] == kind:
            b[-1]["items"].append(text)
        elif kind in ("li", "ol"):
            b.append({"t": kind, "items": [text]})
        else:
            b.append({"t": kind, "x": text})

with open(out, "w", encoding="utf-8") as f:
    f.write("/* generálva: build.py — ne szerkeszd kézzel */\nwindow." + (sys.argv[3] if len(sys.argv) > 3 else "SERE_CONTENT") + "=")
    json.dump(chapters, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")
n = sum(len(c["sections"]) for c in chapters)
print(f"{len(chapters)} fejezet, {n} szakasz -> {out}")
