"""
Unit-Tests fuer _document_stem und _build_notes_filename.
Aequivalenzklassen gemaess Testplan (docs/Markdowns/Testplan.md).

Ausfuehren:
    cd backend
    venv\\Scripts\\activate
    pip install pytest
    python -m pytest tests/test_utils.py -v
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import _document_stem, _build_notes_filename


class TestDocumentStem:
    """Tests fuer _document_stem(filename: str) -> str"""

    # --- Gueltige Aequivalenzklassen ---

    def test_ek1_single_known_extension(self):
        """EK1: Normaler Dateiname mit einer bekannten Endung."""
        assert _document_stem("Vorlesung.pdf") == "Vorlesung"

    def test_ek2_multiple_known_extensions(self):
        """EK2: Mehrfach verschachtelte bekannte Endungen werden alle entfernt."""
        assert _document_stem("Skript.md.pdf") == "Skript"

    def test_ek3_no_extension(self):
        """EK3: Dateiname ohne Endung bleibt unveraendert."""
        assert _document_stem("MeineVorlesung") == "MeineVorlesung"

    def test_ek4_unknown_extension(self):
        """EK4: Unbekannte Endung (.jpg) wird nicht entfernt."""
        assert _document_stem("Bild.jpg") == "Bild.jpg"

    def test_ek5_path_with_directories(self):
        """EK5: Pfadangaben werden durch basename() korrekt behandelt."""
        assert _document_stem("/home/user/Vorlesung.pdf") == "Vorlesung"

    # --- Ungueltige Aequivalenzklassen ---

    def test_ek6_empty_string(self):
        """EK6: Leerer String liefert Fallback 'Lernzettel'."""
        assert _document_stem("") == "Lernzettel"

    # --- Grenzwerte ---

    def test_ek7_only_extension_no_stem(self):
        """EK7 (Grenzwert): Nur eine Endung, kein eigentlicher Name -> unveraendert."""
        assert _document_stem(".pdf") == ".pdf"

    def test_ek8_filename_with_spaces(self):
        """EK8 (Grenzwert): Leerzeichen im Dateinamen bleiben erhalten."""
        assert _document_stem("Meine Vorlesung.pdf") == "Meine Vorlesung"

    def test_ek9_all_known_extensions_chained(self):
        """EK9 (Grenzwert): Alle bekannten Endungen werden iterativ entfernt."""
        assert _document_stem("notes.docx.pptx.pdf") == "notes"

    def test_all_known_extensions_individually(self):
        """Alle unterstuetzten Endungen werden korrekt entfernt."""
        extensions = [".pdf", ".docx", ".pptx", ".xlsx", ".txt", ".md", ".html"]
        for ext in extensions:
            assert _document_stem(f"Datei{ext}") == "Datei", f"Fehlgeschlagen fuer Endung: {ext}"


class TestBuildNotesFilename:
    """Tests fuer _build_notes_filename(source_filename: str) -> str"""

    # --- Gueltige Aequivalenzklassen ---

    def test_ek1_normal_filename(self):
        """EK1: Normaler Dateiname bekommt 'Lernzettel_'-Prefix."""
        assert _build_notes_filename("Vorlesung.pdf") == "Lernzettel_Vorlesung.pdf"

    def test_ek2_already_prefixed_uppercase(self):
        """EK2: Stem beginnt bereits mit 'Lernzettel_' (Gross) -> kein doppelter Prefix."""
        assert _build_notes_filename("Lernzettel_Mathe.pdf") == "Lernzettel_Mathe.pdf"

    def test_ek3_already_prefixed_lowercase(self):
        """EK3: Stem beginnt mit 'lernzettel_' (Klein) -> kein Prefix hinzugefuegt."""
        assert _build_notes_filename("lernzettel_Physik.pdf") == "lernzettel_Physik.pdf"

    def test_ek4_filename_with_spaces(self):
        """EK4: Leerzeichen werden durch Unterstriche ersetzt."""
        assert _build_notes_filename("Meine Vorlesung.pdf") == "Lernzettel_Meine_Vorlesung.pdf"

    # --- Ungueltige Aequivalenzklassen ---

    def test_ek5_empty_string(self):
        """EK5: Leerer String -> Fallback 'Lernzettel' aus _document_stem."""
        assert _build_notes_filename("") == "Lernzettel_Lernzettel.pdf"

    # --- Grenzwerte ---

    def test_ek6_stem_equals_lernzettel(self):
        """EK6 (Grenzwert): Dateiname 'Lernzettel' ohne Endung -> doppeltes 'Lernzettel_'."""
        assert _build_notes_filename("Lernzettel") == "Lernzettel_Lernzettel.pdf"

    def test_ek7_unknown_extension(self):
        """EK7 (Grenzwert): Unbekannte Endung bleibt im Stem erhalten."""
        assert _build_notes_filename("Folie.ppt") == "Lernzettel_Folie.ppt.pdf"

    def test_ek8_all_caps_prefix(self):
        """EK8 (Grenzwert): Grossbuchstaben 'LERNZETTEL_' -> case-insensitiv erkannt."""
        assert _build_notes_filename("LERNZETTEL_Info.pdf") == "LERNZETTEL_Info.pdf"

    def test_spaces_replaced_in_various_positions(self):
        """Leerzeichen an verschiedenen Positionen werden alle ersetzt."""
        result = _build_notes_filename("Einfuehrung in die Informatik.pdf")
        assert " " not in result
        assert result == "Lernzettel_Einfuehrung_in_die_Informatik.pdf"
