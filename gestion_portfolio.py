from html import escape, unescape
from pathlib import Path
import re


HTML_FILE = Path(__file__).with_name("portfoliosolo.html")
SECTION_CLOSE = "</section>"
BLOCK_PATTERN = re.compile(r"\n\s*<div class=\"btn-custom\">.*?</div>", re.DOTALL)


def normalize_section_choice(choice: str) -> str | None:
    value = choice.strip().lower()
    if value in {"1", "projet", "projets"}:
        return "projet"
    if value in {"2", "stage", "stages", "parcours", "parcours professionnel", "parcours_pro"}:
        return "stage"
    return None


def normalize_action_choice(choice: str) -> str | None:
    value = choice.strip().lower()
    if value in {"1", "ajouter", "add"}:
        return "ajouter"
    if value in {"2", "modifier", "edit"}:
        return "modifier"
    if value in {"3", "supprimer", "delete"}:
        return "supprimer"
    return None


def read_html() -> str:
    if not HTML_FILE.exists():
        print(f"Fichier introuvable: {HTML_FILE}")
        raise SystemExit(1)
    return HTML_FILE.read_text(encoding="utf-8")


def save_html(content: str) -> None:
    HTML_FILE.write_text(content, encoding="utf-8")


def find_section_bounds(content: str, section_id: str) -> tuple[int, int]:
    start_token = f'<section id="{section_id}"'
    start = content.find(start_token)
    if start < 0:
        print(f"Section #{section_id} introuvable.")
        raise SystemExit(1)

    end = content.find(SECTION_CLOSE, start)
    if end < 0:
        print(f"Fin de section #{section_id} introuvable.")
        raise SystemExit(1)

    return start, end + len(SECTION_CLOSE)


def get_section_content(content: str, section_id: str) -> tuple[str, int, int]:
    start, end = find_section_bounds(content, section_id)
    return content[start:end], start, end


def get_blocks_with_spans(section_html: str) -> list[tuple[str, int, int]]:
    blocks = []
    for match in BLOCK_PATTERN.finditer(section_html):
        blocks.append((match.group(0), match.start(), match.end()))
    return blocks


def strip_tags(text: str) -> str:
    raw = re.sub(r"<[^>]+>", "", text)
    return unescape(raw).strip()


def extract_title(block_html: str) -> str:
    match = re.search(
        r'<span class="text text-default">(.*?)</span>',
        block_html,
        flags=re.DOTALL,
    )
    if not match:
        return "(sans titre)"
    return strip_tags(match.group(1))


def extract_description(block_html: str) -> str:
    match = re.search(
        r'<span class="text text-hover" aria-hidden="true">(.*?)</span>',
        block_html,
        flags=re.DOTALL,
    )
    if not match:
        return ""
    return strip_tags(match.group(1))


def extract_image_src(block_html: str) -> str:
    match = re.search(r'<img\s+[^>]*src="([^"]+)"', block_html)
    if not match:
        return ""
    return unescape(match.group(1)).strip()


def ask_non_empty(prompt: str) -> str:
    while True:
        value = input(prompt).strip()
        if value:
            return value
        print("Ce champ est obligatoire.")


def choose_block(blocks: list[tuple[str, int, int]]) -> int:
    if not blocks:
        print("Aucun bloc disponible dans cette rubrique.")
        return -1

    print("\nBlocs disponibles:")
    for idx, (block_html, _, _) in enumerate(blocks, start=1):
        print(f"{idx}. {extract_title(block_html)}")

    while True:
        raw = input("Selectionnez le numero du bloc: ").strip()
        if not raw.isdigit():
            print("Entrez un numero valide.")
            continue
        index = int(raw)
        if 1 <= index <= len(blocks):
            return index - 1
        print("Numero hors plage.")


def build_block(section_id: str, title: str, description: str, image_src: str) -> str:
    safe_title = escape(title)
    safe_description = escape(description)
    safe_image_src = escape(image_src, quote=True)

    if section_id == "stage":
        return (
            "\n      <div class=\"btn-custom\">\n"
            "        <span class=\"text text-default\">\n"
            f"          <img src=\"{safe_image_src}\" alt=\"{safe_title}\" width=\"355\" height=\"200\" class=\"align-center\">\n"
            f"          {safe_title}\n"
            "        </span>\n"
            f"        <span class=\"text text-hover\" aria-hidden=\"true\">{safe_description}</span>\n"
            "      </div>"
        )

    return (
        "\n      <div class=\"btn-custom\">\n"
        f"        <span class=\"text text-default\">{safe_title}</span>\n"
        f"        <span class=\"text text-hover\" aria-hidden=\"true\">{safe_description}</span>\n"
        "      </div>"
    )


def replace_block(section_html: str, block_span: tuple[str, int, int], new_block_html: str) -> str:
    _, start, end = block_span
    return section_html[:start] + new_block_html + section_html[end:]


def add_block(content: str, section_id: str) -> str:
    title = ask_non_empty("Titre: ")
    description = ask_non_empty("Description: ")
    image_src = input("Emplacement photo (laisser vide si aucun): ").strip()

    if section_id == "stage" and not image_src:
        print("Une photo est requise pour 'parcours professionnel'.")
        return content

    section_html, start, end = get_section_content(content, section_id)
    insert_at = section_html.rfind(SECTION_CLOSE)
    if insert_at < 0:
        print("Impossible d'ajouter le bloc: balise de fin manquante.")
        return content

    new_block = build_block(section_id, title, description, image_src)
    updated_section = section_html[:insert_at] + new_block + "\n" + section_html[insert_at:]
    print("Bloc ajoute.")
    return content[:start] + updated_section + content[end:]


def edit_block(content: str, section_id: str) -> str:
    section_html, start, end = get_section_content(content, section_id)
    blocks = get_blocks_with_spans(section_html)
    index = choose_block(blocks)
    if index < 0:
        return content

    block_html, _, _ = blocks[index]
    current_title = extract_title(block_html)
    current_description = extract_description(block_html)
    current_image = extract_image_src(block_html)

    print("\nLaisser vide pour conserver la valeur actuelle.")
    title = input(f"Titre [{current_title}]: ").strip() or current_title
    description = input(f"Description [{current_description}]: ").strip() or current_description

    if section_id == "stage":
        image_src = input(f"Emplacement photo [{current_image}]: ").strip() or current_image
        if not image_src:
            print("Une photo est requise pour 'parcours professionnel'.")
            return content
    else:
        image_src = current_image

    new_block = build_block(section_id, title, description, image_src)
    updated_section = replace_block(section_html, blocks[index], new_block)
    print("Bloc modifie.")
    return content[:start] + updated_section + content[end:]


def delete_block(content: str, section_id: str) -> str:
    section_html, start, end = get_section_content(content, section_id)
    blocks = get_blocks_with_spans(section_html)
    index = choose_block(blocks)
    if index < 0:
        return content

    block_html, _, _ = blocks[index]
    title = extract_title(block_html)
    confirm = input(f"Confirmer la suppression de '{title}' ? (o/n): ").strip().lower()
    if confirm not in {"o", "oui", "y", "yes"}:
        print("Suppression annulee.")
        return content

    updated_section = replace_block(section_html, blocks[index], "")
    print("Bloc supprime.")
    return content[:start] + updated_section + content[end:]


def main():
    print("=== Gestion du portfolio ===")
    print("Rubriques disponibles:")
    print("1. Projet")
    print("2. Parcours professionnel")

    section_choice = normalize_section_choice(input("Choisissez une rubrique: "))
    if section_choice is None:
        print("Rubrique invalide.")
        return

    print("\nActions disponibles:")
    print("1. Ajouter un bloc")
    print("2. Modifier un bloc")
    print("3. Supprimer un bloc")

    action = normalize_action_choice(input("Choisissez une action: "))
    if action is None:
        print("Action invalide.")
        return

    content = read_html()

    if action == "ajouter":
        updated = add_block(content, section_choice)
    elif action == "modifier":
        updated = edit_block(content, section_choice)
    else:
        updated = delete_block(content, section_choice)

    if updated != content:
        save_html(updated)
        print(f"\nMise a jour terminee: {HTML_FILE}")
    else:
        print("\nAucun changement enregistre.")


if __name__ == "__main__":
    main()
