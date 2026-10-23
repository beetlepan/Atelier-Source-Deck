import json

src = "toolkit.json"

with open(src, "r", encoding="utf-8") as f:
    original_raw = f.read()
    data = json.loads(original_raw)

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

update("kernelsu", version="v3.3.1", date="2026-10-12", stars="19.5k")
update("sukisu-ultra", version="v4.2.1-r1", date="2026-10-22", stars="6.6k")
update("magisk", stars="63.4k")
update("play-integrity-fix", stars="4.1k")
update("integrity-box", version="v45", date="2026-10-17", stars="2.8k")
update("hide-mock-location", stars="397")
update("zygisk-next", version="1.5.2", date="2026-10-13", stars="956")
update("wecatch", stars="289")
update("pogo-galaxy-store", version="0.433.1", date="2026-10-17")

if changed_ids:
    data["updated"] = "2026-10-23"

new_raw = json.dumps(data, ensure_ascii=False, indent=2) + "\n"

with open(src, "w", encoding="utf-8") as f:
    f.write(new_raw)

# Validate
with open(src, "r", encoding="utf-8") as f:
    json.load(f)

print("changed_ids:", changed_ids)
print("JSON valid after write")
