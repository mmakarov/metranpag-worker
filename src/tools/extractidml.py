from simple_idml import idml
import sys

pack = idml.IDMLPackage(sys.argv[1])
paragraphStyles = pack.style_groups[1].getchildren()
for style in paragraphStyles:
    if style.values()[1] == "$ID/[No paragraph style]":
        print("paragraph;[Basic Paragraph]")
    if style.values()[1] != "$ID/NormalParagraphStyle" and style.values()[1] != "$ID/[No paragraph style]":
        print("paragraph;"+style.values()[1])

charStyles = pack.style_groups[0].getchildren()
for style in charStyles:
    if style.values()[0].rsplit("/", 1)[1] != "[No character style]":
        print("char;"+style.values()[0].rsplit("/", 1)[1])
