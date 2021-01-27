import sys

from docx import Document
from docx.shared import Inches
from docx.enum.style import WD_STYLE_TYPE

document = Document(sys.argv[1])

styles = document.styles
paragraph_styles = [
    s for s in styles if s.type == WD_STYLE_TYPE.PARAGRAPH
]
char_styles = [
    s for s in styles if s.type == WD_STYLE_TYPE.CHARACTER
]

for style in paragraph_styles:
        print("paragraph;"+style.name)

for style in char_styles:
    if (style.name != "Default Paragraph Font"):
        print("char;"+style.name)
