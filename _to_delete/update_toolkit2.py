import json

src = "toolkit.json"

with open(src, "r", encoding="utf-8") as f:
    data = json.load(f)

changed_ids = []
by_id = {u["id"]: u for u in data["updates"]}

def update(id_, version=None, date=None, stars=None):
    item = by_id[id_]
    did_change = False
    if version is not None and item.get("version") != version:
        item["version"] = version
        did_change = True
    if date is not None and item.get("date") != date:
        item["date"] = date
        did_change = True
    if stars is not None and item.get("stars") != stars:
        item["stars"] = stars
        did_change = True
    if did_change:
        changed_ids.append(id_)

# PGTools: user said 6.0.6, already matches current, no change

# Pokemod: 13.8.0 -> 13.8.3 (user-provided)
update("pokemod", version="13.8.3")

# PolygonX: 0.36.1 -> 0.37.3 (user-provided version "0.73.3" appears to be a transposition typo;
# the URL she gave ends in "-0.37.3.apk" and 0.37.x is the natural progression from the prior 0.37.0,
# so using 0.37.3 to match the URL)
update("polygonx", version="0.37.3")
by_id["polygonx"]["links"][0]["url"] = "https://polygonx.dl.assets.evermorelabs.io/apk/com.evermorelabs.polygonx-0.37.3.apk"

# pogo-play: 0.433.0 -> 0.433.1 (user-provided), date from Play Store "更新日期" seen this session: 2026-10-08
update("pogo-play", version="0.433.1", date="2026-10-08")

# play-integrity-fix: apply v4.9 now that user confirmed to update everything to latest
# (she had already manually confirmed v4.9-inject-s as official on 10/19, commit b2822a1)
update("play-integrity-fix", version="v4.9", date="2026-10-15", stars="4.1k")
by_id["play-integrity-fix"]["links"][0]["url"] = "https://github.com/KOWX712/PlayIntegrityFix/releases/tag/v4.9-inject-s"

if changed_ids:
    data["updated"] = "2026-10-23"

new_raw = json.dumps(data, ensure_ascii=False, indent=2) + "\n"

with open(src, "w", encoding="utf-8") as f:
    f.write(new_raw)

with open(src, "r", encoding="utf-8") as f:
    json.load(f)

print("changed_ids:", changed_ids)
print("JSON valid after write")
