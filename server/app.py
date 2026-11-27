#!/usr/bin/env python3
"""JanAwaz demo municipal backend (prototype demo, not a real government service).

Stdlib-only HTTP server: serves the static frontend and a small JSON API
backed by SQLite. Every complaint carries demo=true and a DEMO- reference so
nothing here can be mistaken for a real municipal filing.
"""
import json
import os
import re
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
STATIC = ROOT / "static"
DB_PATH = os.environ.get("JANAWAZ_DB", str(ROOT / "data" / "complaints.db"))

SCHEMA = """
CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref TEXT UNIQUE NOT NULL,
    language TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    status TEXT NOT NULL,
    demo INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
);
"""

SEED = [
    ("DEMO-2026-0001", "mr", "street_light",
     "Amchya gallitli street light aath divsapasoon band aahe.",
     "Galli no. 4, Shaniwar Peth", "8 divas", "Assigned to ward team (demo)"),
    ("DEMO-2026-0002", "hi", "water",
     "Hamare mohalle mein teen din se paani ki supply nahi aa rahi.",
     "Ward 12, Shivaji Nagar", "3 din", "In progress (demo)"),
    ("DEMO-2026-0003", "hi", "sanitation",
     "Road par kachra paanch din se nahi uthaya gaya.",
     "MG Road, near bus stand", "5 din", "Filed (demo)"),
]

CATEGORIES = {"water", "street_light", "sanitation"}


def get_db():
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.execute(SCHEMA)
    return db


def seed_if_empty(db):
    count = db.execute("SELECT COUNT(*) AS c FROM complaints").fetchone()["c"]
    if count:
        return
    for ref, lang, cat, desc, loc, dur, status in SEED:
        db.execute(
            "INSERT INTO complaints (ref, language, category, description,"
            " location, duration, status, demo, created_at) VALUES (?,?,?,?,?,?,?,1,?)",
            (ref, lang, cat, desc, loc, dur, status,
             time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())),
        )
    db.commit()


def row_to_json(row):
    return {
        "ref": row["ref"],
        "language": row["language"],
        "category": row["category"],
        "description": row["description"],
        "location": row["location"],
        "duration": row["duration"],
        "status": row["status"],
        "created_at": row["created_at"],
        "demo": True,
        "demo_notice": "Prototype demo record. Not a real municipal complaint.",
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "JanAwazDemo/1.0"

    def log_message(self, *args):
        pass

    def _send_json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_static(self, path):
        if path in ("/", ""):
            path = "/index.html"
        safe = Path(os.path.normpath(path.lstrip("/")))
        if safe.parts and safe.parts[0] == "..":
            self.send_error(403)
            return
        target = STATIC / safe
        if not target.is_file():
            self.send_error(404)
            return
        ctype = {
            ".html": "text/html; charset=utf-8",
            ".js": "text/javascript; charset=utf-8",
            ".css": "text/css; charset=utf-8",
        }.get(target.suffix, "application/octet-stream")
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/complaints/"):
            ref = path.rsplit("/", 1)[-1].upper()
            db = get_db()
            row = db.execute("SELECT * FROM complaints WHERE ref = ?", (ref,)).fetchone()
            db.close()
            if not row:
                self._send_json({"error": "not_found", "demo": True}, status=404)
                return
            self._send_json(row_to_json(row))
            return
        if path == "/api/complaints":
            # No list endpoint on purpose: a public demo must not expose every
            # record a tester enters. Status lookups go by exact ref only.
            self._send_json({"error": "not_found", "demo": True}, status=404)
            return
        if path == "/api/health":
            self._send_json({"ok": True, "demo": True})
            return
        self._send_static(path)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/complaints":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        except (ValueError, json.JSONDecodeError):
            self._send_json({"error": "bad_json", "demo": True}, status=400)
            return

        language = str(payload.get("language", "")).strip()[:10]
        category = str(payload.get("category", "")).strip()[:30]
        description = str(payload.get("description", "")).strip()[:600]
        location = str(payload.get("location", "")).strip()[:200]
        duration = str(payload.get("duration", "")).strip()[:100]
        missing = [k for k, v in (
            ("language", language), ("category", category),
            ("description", description), ("location", location),
            ("duration", duration)) if not v]
        if missing:
            self._send_json({"error": "missing_fields", "fields": missing, "demo": True},
                            status=400)
            return
        if category not in CATEGORIES:
            self._send_json({"error": "unsupported_category", "demo": True}, status=400)
            return

        db = get_db()
        next_id = db.execute("SELECT COALESCE(MAX(id), 0) + 1 AS n FROM complaints").fetchone()["n"]
        ref = "DEMO-2026-%04d" % next_id
        db.execute(
            "INSERT INTO complaints (ref, language, category, description,"
            " location, duration, status, demo, created_at) VALUES (?,?,?,?,?,?,?,1,?)",
            (ref, language, category, description, location, duration,
             "Filed (demo)", time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())),
        )
        db.commit()
        row = db.execute("SELECT * FROM complaints WHERE ref = ?", (ref,)).fetchone()
        db.close()
        self._send_json(row_to_json(row), status=201)


def main():
    db = get_db()
    seed_if_empty(db)
    db.close()
    port = int(os.environ.get("PORT", "8000"))
    print("JanAwaz demo backend on http://0.0.0.0:%d (prototype demo, not a real service)" % port)
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()


if __name__ == "__main__":
    main()
