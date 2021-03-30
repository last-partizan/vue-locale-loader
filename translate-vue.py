#!/usr/bin/env python3
import os
from pathlib import Path
import sys
from subprocess import check_call

LANGUAGES = ["ru", "en"]
HEADER = "TEXT: TRANSLATION"


def update_translation(name: str):
    """
    Usage: ./translate-vue.py src/components/ComponentName.vue

    Will create locale/{lang}/components/ComponentName.yml
    """
    base, ext = os.path.splitext(name)
    assert base.startswith("src"), "File must be inside src directory."
    for lang in LANGUAGES:
        lang_base = base[4:]
        lang_file = Path(f"locale/{lang}/{lang_base}.yml")
        os.makedirs(
            os.path.dirname(lang_file),
            exist_ok=True,
        )
        if not lang_file.exists() or lang_file.read_text() == "":
            # Write empty header into translation file
            # becouse vue-i18n-extract can not read empty files.
            lang_file.write_text(HEADER)
        check_call([
            "yarn",
            "run",
            "-s",
            "vue-i18n-extract",
            "-a",
            "-v",
            name,
            "-l",
            str(lang_file),
        ])
        check_call([
            "sed",
            "-i",
            f"/{HEADER}/d",
            str(lang_file),
        ])


if __name__ == "__main__":
    for name in sys.argv[1:]:
        update_translation(name)
