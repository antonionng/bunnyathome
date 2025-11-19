import os
from PIL import Image, ImageDraw, ImageFont

PLACEHOLDER_DIR = os.path.join('public', 'menu-placeholders')
os.makedirs(PLACEHOLDER_DIR, exist_ok=True)

FONT_PATH_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT_PATH_REGULAR = '/System/Library/Fonts/Supplemental/Arial.ttf'
TITLE_FONT_SIZE = 96
SUBTITLE_FONT_SIZE = 40

palette = {
    'breads': ('#F7A072', '#240D01'),
    'sides': ('#8ED081', '#041B0C'),
    'sauces': ('#F9C74F', '#1F1302'),
    'drinks': ('#7FB3FF', '#011326'),
}

items = [
    ('bread-loaf', 'Soft White Bunny Loaf', 'Durban loaf · feeds 2', 'breads'),
    ('bread-vetkoek', 'Vetkoek Pack', '4 hand-shaped pillows', 'breads'),
    ('garnish-carrot', 'Pickled Carrot Salad', 'Tangy sambal topper', 'sides'),
    ('bread-glutenfree', 'Gluten-Free Loaf', 'Stoneground weekly bake', 'breads'),
    ('extra-fritters-ready', 'Pumpkin Fritters · Ready', 'Cinnamon sugar dusted', 'sauces'),
    ('extra-fritters-kit', 'Pumpkin Fritters · Kit', 'Mix · fry · coat', 'sauces'),
    ('extra-samoosa', 'Samoosas (12)', 'Hand-folded triangles', 'sauces'),
    ('extra-pork-rashers', 'Honey Mustard Pork Rashers', '400g grill ready', 'sauces'),
    ('extra-vetkoek-filling', 'Vetkoek Mince Filling', '500g Durban spice', 'sauces'),
    ('extra-chutney', 'Mrs Balls Chutney', '470ml iconic sauce', 'sauces'),
    ('extra-boerewors', 'Boerewors (500g)', 'Prime beef coil', 'sauces'),
    ('extra-corn-ribs', 'Curried Corn Ribs', 'Smoky charred nibs', 'sides'),
    ('extra-biltong', 'Original Beef Biltong', '100g prime slices', 'sauces'),
    ('drink-lassi', 'Salted Lassi', 'Yoghurt + cumin salt', 'drinks'),
    ('drink-chai', 'Cardamom Chai', 'Slow-brewed concentrate', 'drinks'),
    ('drink-soda', 'Tamarind Soda', 'Lime + fizzy uplift', 'drinks'),
]

def make_image(filename, title, subtitle, palette_key):
    bg, text_color = palette[palette_key]
    width, height = 1600, 900
    img = Image.new('RGB', (width, height), color=bg)
    draw = ImageDraw.Draw(img)
    try:
        title_font = ImageFont.truetype(FONT_PATH_BOLD, TITLE_FONT_SIZE)
        subtitle_font = ImageFont.truetype(FONT_PATH_REGULAR, SUBTITLE_FONT_SIZE)
    except OSError:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    margin = 120
    draw.text((margin, height/2 - 80), title, font=title_font, fill=text_color)
    draw.text((margin, height/2 + 40), subtitle, font=subtitle_font, fill=text_color)
    draw.text((margin, height - 120), 'Image placeholder — replace with hero photo', font=subtitle_font, fill=text_color)
    img.save(os.path.join(PLACEHOLDER_DIR, f"{filename}.png"), format='PNG')

for item in items:
    make_image(*item)

print(f"Generated {len(items)} placeholders in {PLACEHOLDER_DIR}")
