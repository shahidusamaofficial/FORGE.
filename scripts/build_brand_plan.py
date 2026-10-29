"""
AANGAN — Brand Plan PDF Generator
Minimal-premium earth-tone brand plan for a Pakistani clothing brand.
Uses ReportLab with a styled cover page + 11 body sections with tables.
"""

import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm, cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Image, HRFlowable, Flowable
)
from reportlab.platypus.tableofcontents import TableOfContents

# ─────────────────────────────────────────────────────────────
# Font registration
# ─────────────────────────────────────────────────────────────
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('NotoSerifSC',
    f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold',
    f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')

pdfmetrics.registerFont(TTFont('NotoSansSC',
    f'{FONT_DIR}/truetype/chinese/NotoSansSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSansSC-Bold',
    f'{FONT_DIR}/truetype/chinese/NotoSansSC-Bold.ttf'))
registerFontFamily('NotoSansSC', normal='NotoSansSC', bold='NotoSansSC-Bold')

# ─────────────────────────────────────────────────────────────
# AANGAN brand palette (minimal premium earth tones)
# ─────────────────────────────────────────────────────────────
# XL tier: backgrounds (S ≤ 0.08)
PAGE_BG       = colors.HexColor('#FAF7F2')   # warm cream
SECTION_BG    = colors.HexColor('#F2EDE4')   # lighter beige

# L tier: surfaces
CARD_BG       = colors.HexColor('#EFE9DC')   # warmer beige
TABLE_STRIPE  = colors.HexColor('#F5F0E6')   # subtle stripe

# M tier: structural fills
HEADER_FILL   = colors.HexColor('#2D2620')   # deep warm brown
COVER_BLOCK   = colors.HexColor('#3A3128')   # rich brown

# S tier: edges & icons
BORDER        = colors.HexColor('#C9BBA3')   # warm tan
ICON          = colors.HexColor('#8B5A3C')   # terracotta

# XS tier: emphasis
ACCENT        = colors.HexColor('#8B5A3C')   # terracotta clay
ACCENT_2      = colors.HexColor('#6B7A4F')   # olive (chart secondary)

# Typography
TEXT_PRIMARY  = colors.HexColor('#1A1614')   # near-black warm
TEXT_MUTED    = colors.HexColor('#6E6258')   # warm gray

# Semantic
SEM_SUCCESS   = colors.HexColor('#4A6B3F')
SEM_WARNING   = colors.HexColor('#A08041')
SEM_ERROR     = colors.HexColor('#90534D')
SEM_INFO      = colors.HexColor('#507090')

WHITE         = colors.HexColor('#FFFFFF')

# ─────────────────────────────────────────────────────────────
# Page dimensions
# ─────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN_L = 22 * mm
MARGIN_R = 22 * mm
MARGIN_T = 22 * mm
MARGIN_B = 22 * mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

# ─────────────────────────────────────────────────────────────
# Paragraph styles
# ─────────────────────────────────────────────────────────────
sty_cover_wordmark = ParagraphStyle('CoverWordmark',
    fontName='NotoSerifSC-Bold', fontSize=64, leading=70,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceBefore=0, spaceAfter=4)

sty_cover_tagline = ParagraphStyle('CoverTagline',
    fontName='NotoSerifSC', fontSize=18, leading=24,
    textColor=ACCENT, alignment=TA_LEFT, spaceBefore=6, spaceAfter=24)

sty_cover_subtitle = ParagraphStyle('CoverSubtitle',
    fontName='NotoSansSC', fontSize=12, leading=18,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceBefore=0, spaceAfter=12)

sty_cover_meta = ParagraphStyle('CoverMeta',
    fontName='NotoSansSC', fontSize=9, leading=13,
    textColor=TEXT_MUTED, alignment=TA_LEFT)

sty_h1 = ParagraphStyle('H1',
    fontName='NotoSerifSC-Bold', fontSize=22, leading=28,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    spaceBefore=8, spaceAfter=6, keepWithNext=1)

sty_h2 = ParagraphStyle('H2',
    fontName='NotoSerifSC-Bold', fontSize=15, leading=20,
    textColor=ACCENT, alignment=TA_LEFT,
    spaceBefore=14, spaceAfter=4, keepWithNext=1)

sty_h3 = ParagraphStyle('H3',
    fontName='NotoSansSC-Bold', fontSize=11, leading=16,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    spaceBefore=10, spaceAfter=2, keepWithNext=1)

sty_body = ParagraphStyle('Body',
    fontName='NotoSansSC', fontSize=10, leading=16,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    spaceBefore=0, spaceAfter=8)

sty_body_just = ParagraphStyle('BodyJust',
    fontName='NotoSansSC', fontSize=10, leading=16,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
    spaceBefore=0, spaceAfter=8)

sty_caption = ParagraphStyle('Caption',
    fontName='NotoSansSC', fontSize=8.5, leading=12,
    textColor=TEXT_MUTED, alignment=TA_LEFT,
    spaceBefore=2, spaceAfter=10)

sty_pull = ParagraphStyle('Pull',
    fontName='NotoSerifSC', fontSize=13, leading=20,
    textColor=ACCENT, alignment=TA_LEFT,
    leftIndent=12, spaceBefore=8, spaceAfter=12)

# Table cell styles
sty_th = ParagraphStyle('TH',
    fontName='NotoSansSC-Bold', fontSize=8.5, leading=11.5,
    textColor=WHITE, alignment=TA_LEFT)
sty_th_c = ParagraphStyle('THc',
    fontName='NotoSansSC-Bold', fontSize=8.5, leading=11.5,
    textColor=WHITE, alignment=TA_CENTER)
sty_td = ParagraphStyle('TD',
    fontName='NotoSansSC', fontSize=8.5, leading=12,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT)
sty_td_c = ParagraphStyle('TDc',
    fontName='NotoSansSC', fontSize=8.5, leading=12,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER)
sty_td_bold = ParagraphStyle('TDb',
    fontName='NotoSansSC-Bold', fontSize=8.5, leading=12,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT)

# ─────────────────────────────────────────────────────────────
# Cover page (Page 1) — drawn entirely via canvas callback
# ─────────────────────────────────────────────────────────────
def draw_cover(canvas, doc):
    """Draw the AANGAN cover page on the canvas. Called via onFirstPage."""
    c = canvas
    c.saveState()
    # Fill background with cream (full page)
    c.setFillColor(PAGE_BG)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Top color block (rich brown strip across the full width)
    c.setFillColor(COVER_BLOCK)
    c.rect(0, PAGE_H - 8*mm, PAGE_W, 8*mm, stroke=0, fill=1)

    # Edition label top-left
    c.setFillColor(WHITE)
    c.setFont('NotoSansSC', 8)
    c.drawString(MARGIN_L, PAGE_H - 5.5*mm,
                 'AANGAN  /  BRAND PLAN  /  V1.0  /  2026')
    c.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 5.5*mm,
                      'INTERNAL — FOUNDER COPY')

    # Wordmark (lowercase serif with period)
    c.setFillColor(TEXT_PRIMARY)
    c.setFont('NotoSerifSC-Bold', 86)
    c.drawString(MARGIN_L, PAGE_H - 60*mm, 'aangan.')

    # Thin terracotta rule below wordmark
    c.setStrokeColor(ACCENT)
    c.setLineWidth(1.4)
    c.line(MARGIN_L, PAGE_H - 65*mm, MARGIN_L + 40*mm, PAGE_H - 65*mm)

    # Tagline
    c.setFillColor(ACCENT)
    c.setFont('NotoSerifSC', 22)
    c.drawString(MARGIN_L, PAGE_H - 80*mm, 'Wear the Courtyard.')

    # Subtitle
    c.setFillColor(TEXT_PRIMARY)
    c.setFont('NotoSansSC', 13)
    c.drawString(MARGIN_L, PAGE_H - 92*mm,
                 'A Clothing Brand for Pakistan  /  Brand Plan 2026')

    # Lower meta block — three columns
    meta_y = 50*mm
    col1_x = MARGIN_L
    col2_x = MARGIN_L + 45*mm
    col3_x = MARGIN_L + 105*mm

    c.setFillColor(TEXT_MUTED)
    c.setFont('NotoSansSC', 9)
    c.drawString(col1_x, meta_y + 28, 'FOUNDED')
    c.setFillColor(TEXT_PRIMARY)
    c.setFont('NotoSansSC-Bold', 10)
    c.drawString(col1_x, meta_y + 14, 'Lahore, Pakistan  /  2026')

    c.setFillColor(TEXT_MUTED)
    c.setFont('NotoSansSC', 9)
    c.drawString(col2_x, meta_y + 28, 'CATEGORIES')
    c.setFillColor(TEXT_PRIMARY)
    c.setFont('NotoSansSC-Bold', 10)
    c.drawString(col2_x, meta_y + 14, '10 categories')

    c.setFillColor(TEXT_MUTED)
    c.setFont('NotoSansSC', 9)
    c.drawString(col3_x, meta_y + 28, 'PRICE TIER')
    c.setFillColor(TEXT_PRIMARY)
    c.setFont('NotoSansSC-Bold', 10)
    c.drawString(col3_x, meta_y + 14, 'Mid-premium  /  PKR 1,800-5,500')

    # Bottom terracotta strip
    c.setFillColor(ACCENT)
    c.rect(0, 0, PAGE_W, 5*mm, stroke=0, fill=1)

    # Footer text on bottom strip
    c.setFillColor(WHITE)
    c.setFont('NotoSansSC', 8)
    c.drawString(MARGIN_L, 1.5*mm, 'aangan.pk  /  hello@aangan.pk  /  @aangan.pk')
    c.drawRightString(PAGE_W - MARGIN_R, 1.5*mm,
                      'Document confidential — do not distribute')

    c.restoreState()


# ─────────────────────────────────────────────────────────────
# Section divider
# ─────────────────────────────────────────────────────────────
def section_header(num, title):
    """A clean section header: number + title + thin rule."""
    num_p = Paragraph(
        f'<font name="NotoSansSC-Bold" color="#8B5A3C" size="9">SECTION {num:02d}</font>',
        ParagraphStyle('SecNum', fontName='NotoSansSC-Bold', fontSize=9,
                       textColor=ACCENT, leading=12, spaceBefore=0, spaceAfter=2))
    title_p = Paragraph(title, sty_h1)
    rule = HRFlowable(width=CONTENT_W, thickness=0.6, color=BORDER,
                      spaceBefore=2, spaceAfter=8, lineCap='round')
    return KeepTogether([num_p, title_p, rule])


# ─────────────────────────────────────────────────────────────
# Table builder
# ─────────────────────────────────────────────────────────────
def make_table(data, col_widths, header_row=True, first_col_bold=False):
    """Build a styled table from a 2D list of strings."""
    # Wrap all cells in Paragraphs for proper text wrapping
    wrapped = []
    for ri, row in enumerate(data):
        new_row = []
        for ci, cell in enumerate(row):
            if isinstance(cell, Paragraph):
                new_row.append(cell)
                continue
            text = str(cell) if cell is not None else ''
            if header_row and ri == 0:
                new_row.append(Paragraph(text, sty_th))
            elif first_col_bold and ci == 0:
                new_row.append(Paragraph(text, sty_td_bold))
            else:
                new_row.append(Paragraph(text, sty_td))
        wrapped.append(new_row)

    t = Table(wrapped, colWidths=col_widths, repeatRows=1 if header_row else 0)
    style_cmds = [
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (0, 0), (-1, 0), 0.8, ACCENT),
        ('LINEABOVE', (0, 0), (-1, 0), 0.0, HEADER_FILL),
        ('LINEBELOW', (0, -1), (-1, -1), 0.6, BORDER),
        ('LINEBEFORE', (0, 0), (0, -1), 0.0, HEADER_FILL),
        ('LINEAFTER', (-1, 0), (-1, -1), 0.0, HEADER_FILL),
    ]
    if header_row:
        style_cmds.append(('BACKGROUND', (0, 0), (-1, 0), HEADER_FILL))
    # Alternating row stripes
    for ri in range(1 if header_row else 0, len(data)):
        if (ri - (1 if header_row else 0)) % 2 == 1:
            style_cmds.append(('BACKGROUND', (0, ri), (-1, ri), TABLE_STRIPE))
    t.setStyle(TableStyle(style_cmds))
    return t


# ─────────────────────────────────────────────────────────────
# Page template — footer with page number (skip page 1)
# ─────────────────────────────────────────────────────────────
def on_first_page(canvas, doc):
    """Page 1 — draw the cover. Body content on page 1 is suppressed by a
    PageBreak() at the start of the story."""
    draw_cover(canvas, doc)


def on_later_pages(canvas, doc):
    """Footer on every page after page 1."""
    canvas.saveState()
    page_num = canvas.getPageNumber()
    # Footer line
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN_L, MARGIN_B - 8*mm,
                PAGE_W - MARGIN_R, MARGIN_B - 8*mm)
    # Left footer
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont('NotoSansSC', 8)
    canvas.drawString(MARGIN_L, MARGIN_B - 12*mm,
                      'AANGAN  /  Brand Plan v1.0  /  2026')
    # Right page number (page 1 was cover, so subtract 1)
    canvas.drawRightString(PAGE_W - MARGIN_R, MARGIN_B - 12*mm,
                           f'{page_num - 1}  /  11')
    canvas.restoreState()


# ─────────────────────────────────────────────────────────────
# Content builders
# ─────────────────────────────────────────────────────────────
def build_cover():
    # Use a tiny spacer + PageBreak to consume page 1 (cover drawn via onFirstPage)
    return [Spacer(1, 1), PageBreak()]


def build_section_2_executive_summary():
    """Executive Summary."""
    return [
        section_header(2, 'Executive Summary'),
        Paragraph(
            'AANGAN is a mid-premium everyday apparel and accessories brand for Pakistan '
            'launching in 2026 out of Lahore. The brand sits in a clear gap between the '
            'budget mass-market tier (LOCAL, Breakout, Edenrobe) and the premium ethnic '
            'tier (Khaadi, Sapphire, Ethnic by Ayesha) — a quiet, minimal-premium territory '
            'no domestic brand currently owns at the PKR 1,800-5,500 price band. The product '
            'line spans 10 categories — hoodies, t-shirts, sweatshirts, drop-shoulder tees, '
            'polo shirts, round-neck full-sleeve tees, printed mugs, zipper hoodies, and '
            'printed notebooks — built on a single design philosophy: essentials-first silhouettes '
            'in earth tones inspired by the Pakistani <i>aangan</i> (inner courtyard).',
            sty_body_just),
        Paragraph(
            'The target is a deliberately mixed customer base: urban Gen-Z (18-25) in Karachi, '
            'Lahore, and Islamabad who lean streetwear; young professionals (25-35) seeking '
            'clean polo and full-sleeve options for office-casual wear; and students (16-22) '
            'who buy graphic tees, printed mugs, and notebooks as affordable identity markers. '
            'This mixed targeting is intentional — the catalog is broad enough that each persona '
            'finds 3-5 hero SKUs, while the unified earth-tone palette keeps the brand coherent.',
            sty_body_just),
        Paragraph(
            'The 12-month plan calls for approximately PKR 4.5M (~USD 16K) of startup capital '
            'to fund inventory, brand identity, e-commerce build, packaging, and initial '
            'marketing. Unit economics target a 57% gross margin (avg selling price PKR 2,200 '
            'against COGS of PKR 950). Break-even is projected at month 9-10, with month-12 '
            'monthly revenue reaching PKR 2.5M. Funding comes from founder savings, family '
            'contribution, and one angel investor. Distribution is direct-to-consumer via '
            'the brand\'s own Next.js storefront, with a planned Daraz marketplace expansion '
            'in Q3 and a Lahore pop-up store in Q4.',
            sty_body_just),
        Paragraph(
            '"AANGAN is not chasing the loudest corner of the market. It is building the '
            'quiet corner — the one a customer returns to season after season."',
            sty_pull),
    ]


def build_section_3_brand_story():
    """Brand Story & Identity."""
    return [
        section_header(3, 'Brand Story & Identity'),
        Paragraph('The meaning behind the name', sty_h2),
        Paragraph(
            'In Pakistani architecture, the <i>aangan</i> is the inner courtyard of a home — '
            'an open-to-sky central space where the family gathers, where meals are shared on '
            'charpoys during summer nights, where children first learn the names of stars, and '
            'where a household\'s identity is quietly formed across generations. It is not the '
            'facade that strangers see from the street; it is the private, lived-in heart of '
            'the home. AANGAN the brand takes this exact emotional architecture and applies it '
            'to clothing. The garments are not costumes for public display — they are the '
            'personal, everyday layer the customer lives in, the way the courtyard is lived in.',
            sty_body_just),
        Paragraph(
            'This naming choice is deliberate. Most Pakistani apparel brands borrow English '
            'or Persian words that signal status or aspiration ("Edenrobe", "Khaadi", '
            '"Sapphire"). AANGAN uses a plain Urdu household word with no aspirational baggage, '
            'and the lowercase wordmark <b>aangan.</b> with a terminal period signals restraint '
            'and intentionality — a quiet confidence that does not need to shout. The tagline '
            '"Wear the Courtyard" extends the metaphor explicitly: clothing as the personal '
            'space one carries with them.',
            sty_body_just),
        Paragraph('Four brand values', sty_h2),
        Paragraph(
            '<b>Craft.</b> Every garment is built to be re-worn across 100+ wash cycles. Seams '
            'are double-stitched on stress points, fabrics are pre-shrunk, and GSM (grams per '
            'square meter) is disclosed on every product page — a transparency move borrowed '
            'from UNIQLO and Everlane that no Pakistani competitor currently does. Craft is '
            'measured, not marketed.',
            sty_body_just),
        Paragraph(
            '<b>Comfort.</b> AANGAN refuses the trend-chasing silhouette of the moment. Fits '
            'are relaxed but not oversized, drop-shoulder but not boxy, polo collars sit flat '
            'instead of curling. The customer should reach for the same AANGAN hoodie on a '
            'Tuesday morning and a Friday night without thinking about it.',
            sty_body_just),
        Paragraph(
            '<b>Quiet Confidence.</b> The brand identity is intentionally restrained — no loud '
            'logos, no all-over graphics, no neon. Branding is a small woven label at the hem '
            'and a debossed wordmark on the inside collar. The clothing lets the wearer\'s '
            'personality lead. This is the brand\'s sharpest competitive differentiation: in a '
            'market saturated with logo-heavy streetwear, AANGAN offers the opposite pole.',
            sty_body_just),
        Paragraph(
            '<b>Cultural Roots.</b> Earth tones (terracotta, sandstone, olive, indigo) reference '
            'Pakistani soil, brick architecture, and traditional textile palettes without '
            'crossing into costume-y "ethnic" territory. Taglines and product names use Urdu '
            'transliteration sparingly. The brand is unambiguously Pakistani without performing '
            'Pakistani-ness.',
            sty_body_just),
    ]


def build_section_4_market():
    """Market Analysis with competitor table."""
    comp_data = [
        ['Brand', 'Tier', 'Avg Tee Price (PKR)', 'Style Position', 'Target', 'AANGAN Risk'],
        ['LOCAL', 'Budget', '1,200-1,800', 'Streetwear graphics', 'Gen-Z urban', 'High — direct overlap on drop-shoulder'],
        ['Breakout', 'Budget', '1,400-2,000', 'Casual basics', 'Mass-market', 'Low — different aesthetic'],
        ['Edenrobe', 'Budget-mid', '1,500-2,500', 'Ethnic + casual', 'Family/mass', 'Low — different audience'],
        ['Sapphire', 'Mid-premium', '2,200-3,500', 'Ethnic + office wear', 'Women 25-40', 'Medium — women-led'],
        ['Khaadi', 'Premium', '2,500-4,500', 'Ethnic fusion', 'Premium urban', 'Medium — price overlap, ethnic lean'],
        ['Levi\'s PK', 'Premium intl', '3,500-6,000', 'Denim-led basics', 'Aspirational', 'Low — different category'],
        ['AANGAN', 'Mid-premium', '1,800-2,800', 'Minimal earth-tone', 'Mixed Gen-Z + young pro', '— (this brand)'],
    ]
    comp_widths = [22*mm, 18*mm, 28*mm, 32*mm, 25*mm, 41*mm]

    return [
        section_header(4, 'Market Analysis'),
        Paragraph(
            'Pakistan\'s domestic apparel market is estimated at over USD 15 billion in 2025, '
            'growing at roughly 8% CAGR, driven by three structural tailwinds: a youth-heavy '
            'demographic (64% of the population is under 30), rapid urbanization in Karachi, '
            'Lahore, and Islamabad, and a fast-maturing e-commerce layer (Daraz, Instagram-led '
            'D2C brands, and TikTok-driven micro-brands). Within this market, the mid-premium '
            'everyday basics segment — clothing priced between PKR 1,800 and PKR 5,500 — is the '
            'fastest-growing slice and the most under-served by current domestic players.',
            sty_body_just),
        Paragraph(
            'The competitive map below positions the seven most relevant brands against AANGAN. '
            'The structural insight: the budget tier (LOCAL, Breakout) owns streetwear graphics '
            'and mass basics, while the premium tier (Khaadi, Sapphire, Levi\'s) owns ethnic '
            'fusion and denim-led aspirational basics. Between them sits a clear white space — '
            'minimal-premium everyday basics in a coherent earth-tone palette. No domestic '
            'brand currently owns this corner, which is exactly where AANGAN plants its flag.',
            sty_body_just),
        Spacer(1, 4),
        make_table(comp_data, comp_widths, header_row=True, first_col_bold=True),
        Spacer(1, 4),
        Paragraph(
            'Table 1 — Pakistani apparel competitive landscape, 2026. Prices reflect Q4 2025 '
            'in-store and online observations. "AANGAN Risk" column rates direct overlap with '
            'AANGAN\'s catalog and audience.',
            sty_caption),
    ]


def build_section_5_audience():
    """Target Audience with persona table."""
    persona_data = [
        ['Persona', 'Age', 'City', 'Income (PKR/mo)', 'Style trigger', 'Channel'],
        ['Gen-Z Urban', '18-25', 'KHI/LHE/ISB', '40K-120K', 'Streetwear, IG-driven', 'Instagram, TikTok'],
        ['Young Pro', '25-35', 'KHI/LHE/ISB', '120K-400K', 'Office-casual, minimal', 'Instagram, in-store'],
        ['Student', '16-22', 'Nationwide campus', '15K-50K (allowance)', 'Graphic tees, accessories', 'TikTok, campus pop-ups'],
    ]
    persona_widths = [25*mm, 16*mm, 28*mm, 28*mm, 35*mm, 34*mm]

    return [
        section_header(5, 'Target Audience'),
        Paragraph(
            'AANGAN targets a deliberately mixed customer base across three personas. This is '
            'a strategic choice — most Pakistani apparel brands over-index on one persona '
            '(Khaadi on premium urban women, LOCAL on Gen-Z streetwear, Sapphire on women '
            '25-40). AANGAN\'s broader catalog supports broader targeting, and the unified '
            'earth-tone palette keeps the brand coherent across personas rather than fragmenting '
            'into three sub-brands. Each persona below finds 3-5 hero SKUs in the catalog.',
            sty_body_just),
        Paragraph('Persona 1 — Gen-Z Urban (18-25)', sty_h3),
        Paragraph(
            'University students and early-career professionals in Karachi, Lahore, and '
            'Islamabad. Instagram and TikTok are their primary visual references; they discover '
            'brands through micro-influencer hauls (50K-300K follower creators) rather than '
            'mainstream media. Their style language borrows from international streetwear '
            '(Stussy, Carhartt WIP, Needles) but localized through a Pakistani lens. They buy '
            'drop-shoulder tees, zipper hoodies, sweatshirts, and printed mugs. Price sensitivity '
            'is moderate — they will pay PKR 2,800 for a hoodie if the brand feels considered, '
            'but reject anything over PKR 4,000 in this category.',
            sty_body_just),
        Paragraph('Persona 2 — Young Professional (25-35)', sty_h3),
        Paragraph(
            'Office-goers in corporate Lahore, Karachi\'s financial district, and Islamabad\'s '
            'diplomatic and tech sectors. They need weekday-appropriate basics — polo shirts '
            'for smart-casual offices, full-sleeve round-neck tees for layering under blazers, '
            'and a clean hoodie for the commute. Their aesthetic is closer to UNIQLO or Muji '
            'than to streetwear: muted, well-fitted, no logos. They discover brands through '
            'Instagram and word-of-mouth from peers. They value fabric quality (GSM disclosure, '
            'pre-shrunk cotton) and will pay PKR 3,500-4,500 for a polo if the construction '
            'justifies it.',
            sty_body_just),
        Paragraph('Persona 3 — Student (16-22)', sty_h3),
        Paragraph(
            'College and university students across Pakistan, including tier-2 cities (Faisalabad, '
            'Multan, Peshawar, Quetta). They live on allowances and are highly price-aware but '
            'brand-conscious — they want the social signal of wearing a "real brand" rather than '
            'a generic unbranded tee. They buy graphic tees, printed mugs, and printed notebooks '
            'as affordable entry points into the brand (PKR 800-1,800 range), and occasionally '
            'save up for a hoodie during Eid or their birthday. TikTok is the primary discovery '
            'channel, and campus pop-up activations at LUMS, NUST, Bahria, and FAST convert '
            'discovery into trial purchases.',
            sty_body_just),
        Spacer(1, 4),
        make_table(persona_data, persona_widths, header_row=True, first_col_bold=True),
        Spacer(1, 4),
        Paragraph('Table 2 — Persona summary across three target customer segments.',
                  sty_caption),
    ]


def build_section_6_positioning():
    """Brand Positioning."""
    return [
        section_header(6, 'Brand Positioning'),
        Paragraph('Positioning statement', sty_h2),
        Paragraph(
            '<i>"For Pakistanis who want premium-feeling everyday clothing without the premium '
            'price tag, AANGAN offers minimal, well-crafted basics in earth tones inspired by '
            'the Pakistani aangan. Unlike LOCAL\'s loud streetwear or Khaadi\'s ethnic fusion, '
            'AANGAN delivers quiet, considered essentials at the PKR 1,800-5,500 price band — '
            'clothing that earns a permanent place in the rotation."</i>',
            sty_pull),
        Paragraph('Perceptual map description', sty_h2),
        Paragraph(
            'On the standard apparel perceptual map with X-axis Casual to Formal and Y-axis '
            'Budget to Premium, AANGAN sits in the upper-middle of the Premium axis (above '
            'LOCAL and Breakout, below Levi\'s and Khaadi premium lines) and in the middle-left '
            'of the Casual axis (more casual than Sapphire, more formal than streetwear micro-'
            'brands). This upper-middle-middle-left quadrant is the most under-served region '
            'in the current Pakistani market — domestic brands either drop to the budget-casual '
            'corner or jump to premium-formal-ethnic. AANGAN\'s position gives it natural price '
            'headroom above the budget tier and natural style differentiation from the premium '
            'ethnic tier.',
            sty_body_just),
        Paragraph('Three differentiation pillars', sty_h2),
        Paragraph(
            '<b>Pillar 1 — Earth-tone palette nobody owns.</b> Every Pakistani apparel brand '
            'currently operates in either black-white-grey (LOCAL, Breakout), saturated ethnic '
            'brights (Khaadi festive, Sapphire lawn), or international neon accents (Levi\'s). '
            'AANGAN\'s 5-color core palette — cream, warm-black, terracotta, olive, sandstone — '
            'is unique in the market and instantly recognizable. Within two seasons the palette '
            'itself becomes the brand cue, the way Aesop\'s amber bottles signal the brand '
            'before the logo is even read.',
            sty_body_just),
        Paragraph(
            '<b>Pillar 2 — Typography-led identity, not graphic-led.</b> The brand identity '
            'leads with a serif wordmark and disciplined typography rather than illustrations '
            'or graphics. This is rare in Pakistan — even premium brands like Khaadi lean on '
            'illustration. The result is a brand that photographs well in flat-lay product '
            'shots and Instagram grid layouts, and ages well across seasons (typography does '
            'not go out of style the way seasonal illustrations do).',
            sty_body_just),
        Paragraph(
            '<b>Pillar 3 — Mid-premium quality at accessible price.</b> Fabric specs (GSM '
            'disclosed, 240 GSM fleece for hoodies, 180 GSM combed cotton for tees) match '
            'Khaadi and Sapphire construction quality, but pricing sits 25-35% below those '
            'brands. This is achievable because AANGAN operates direct-to-consumer with no '
            'physical retail overhead in year 1, sources directly from Faisalabad mills, and '
            'runs a lean team of three founders plus a part-time designer.',
            sty_body_just),
    ]


def build_section_7_catalog():
    """Product Catalog with 10 categories table."""
    catalog_data = [
        ['Category', 'Fabric', 'GSM', 'Sizes', 'Price (PKR)', 'Hero SKU'],
        ['Hoodies', 'Cotton fleece, brushed back', '320', 'S-XXL', '4,200-5,500', 'The Everyday Hoodie / Sandstone'],
        ['T-Shirts', 'Combed cotton jersey', '180', 'S-XXL', '1,800-2,200', 'The Daily Tee / Cream'],
        ['Sweatshirts', 'Cotton french terry', '280', 'S-XXL', '3,200-3,800', 'The Crew Sweat / Olive'],
        ['Drop-Shoulder T-Shirts', 'Combed cotton jersey, relaxed', '200', 'S-XXL', '2,400-2,800', 'The Drop Tee / Terracotta'],
        ['Polo Shirts', 'Cotton pique, 2-button placket', '220', 'S-XXL', '2,800-3,500', 'The Office Polo / Warm Black'],
        ['Round-Neck Full-Sleeve T-Shirts', 'Combed cotton jersey, long sleeve', '190', 'S-XXL', '2,200-2,800', 'The Long Sleeve / Sandstone'],
        ['Printed Mugs', 'Ceramic 11oz, sublimation print', '—', '11oz', '900-1,200', 'The Courtyard Mug / Cream'],
        ['Zipper Hoodies', 'Cotton fleece, YKK metal zipper', '320', 'S-XXL', '4,800-5,500', 'The Zip Hoodie / Warm Black'],
        ['Printed Notebooks', 'Recycled kraft cover, 80 ruled sheets', '—', 'A5', '700-1,000', 'The Daily Notebook / Kraft'],
    ]
    catalog_widths = [38*mm, 40*mm, 12*mm, 16*mm, 24*mm, 34*mm]

    return [
        section_header(7, 'Product Catalog — 10 Categories'),
        Paragraph(
            'The catalog is built on a single design philosophy: <b>essentials first, statement '
            'pieces second.</b> Every product must answer the question "would the customer '
            'reach for this on an ordinary Tuesday morning?" If the answer is no, the SKU does '
            'not enter the line. This discipline keeps the catalog tight (10 categories, '
            'approximately 35-45 SKUs in year 1) and the inventory manageable for a bootstrapped '
            'launch. Each category below is specified to production-ready detail — fabric, GSM '
            '(grams per square meter, a transparency move no Pakistani competitor currently '
            'practices), size range, price band, and a named hero SKU that anchors the category.',
            sty_body_just),
        Paragraph(
            'Pricing follows a clean three-band structure: accessories (mugs, notebooks) at '
            'PKR 700-1,200 as entry points that bring price-sensitive students into the brand; '
            'core tees at PKR 1,800-2,800 as the volume driver; and hoodies, sweatshirts, '
            'zipper hoodies, and polos at PKR 2,800-5,500 as margin-rich flagships. The full '
            'spread gives every persona at least one accessible entry point and one aspirational '
            'anchor SKU.',
            sty_body_just),
        Spacer(1, 4),
        make_table(catalog_data, catalog_widths, header_row=True, first_col_bold=True),
        Spacer(1, 4),
        Paragraph(
            'Table 3 — Year-1 product catalog across 10 categories. Hero SKU column shows the '
            'name and lead color for the category-defining product. All cotton SKUs are pre-'
            'shrunk and GSM-disclosed on the product page.',
            sty_caption),
    ]


def build_section_8_suppliers():
    """Supplier & Sourcing Notes with table."""
    supplier_data = [
        ['Product', 'Supplier city', 'Lead time', 'MOQ', 'Est landed cost (PKR/unit)'],
        ['Hoodies / Zipper Hoodies', 'Lahore (Sundar Industrial Estate)', '3-4 weeks', '200', '1,650-1,950'],
        ['T-Shirts / Drop-Shoulder Tees', 'Lahore (Johar Town units)', '2-3 weeks', '300', '520-680'],
        ['Sweatshirts', 'Lahore (Sundar Industrial Estate)', '3-4 weeks', '200', '1,250-1,500'],
        ['Polo Shirts', 'Faisalabad (knit cluster)', '3-4 weeks', '300', '950-1,150'],
        ['Full-Sleeve Tees', 'Lahore (Johar Town units)', '2-3 weeks', '300', '620-780'],
        ['Printed Mugs', 'Karachi (Saddar sublimation)', '1-2 weeks', '50', '280-340'],
        ['Printed Notebooks', 'Karachi (Saddar print cluster)', '1-2 weeks', '100', '180-230'],
        ['Fabric sourcing (cotton fleece, pique)', 'Faisalabad mills (Masood / Chenab / Interloop)', '2 weeks', '500 m', '380-450 / m'],
        ['DTG printing (graphics)', 'Lahore (Printo / Stitch.pk)', '3-5 days', '10', '180-260 / print'],
        ['Packaging (kraft mailers, swing tags)', 'Lahore (local box makers)', '1 week', '500', '28-45 / unit'],
    ]
    supplier_widths = [38*mm, 38*mm, 22*mm, 14*mm, 36*mm]

    return [
        section_header(8, 'Supplier & Sourcing Notes'),
        Paragraph(
            'Pakistan\'s textile supply chain is one of the most mature in Asia — Faisalabad '
            'is a global knit-fabric cluster, Lahore has dense cut-and-sew capacity in Johar '
            'Town and Sundar Industrial Estate, and Karachi\'s Saddar area handles sublimation '
            'and small-batch printing for accessories. AANGAN\'s sourcing strategy is to keep '
            'all production within Pakistan (no imports in year 1) for cost control, currency '
            'stability, and brand storytelling ("made in Pakistan, by Pakistanis"). This also '
            'enables short lead times — 2-4 weeks across the catalog — which is critical for '
            'a brand running small-batch drops rather than 6-month seasonal calendars.',
            sty_body_just),
        Paragraph(
            'The supplier map below pairs every product category with the source city, '
            'production lead time, minimum order quantity (MOQ), and estimated landed cost '
            'per unit (excluding branding and packaging). Costs are based on Q4 2025 supplier '
            'quotations gathered during founder diligence trips to Faisalabad and Lahore. '
            'All suppliers are pre-qualified — three units in Lahore have agreed in principle '
            'to AANGAN\'s small-batch model in exchange for a 15-20% price premium over their '
            'standard mass-production rate.',
            sty_body_just),
        Spacer(1, 4),
        make_table(supplier_data, supplier_widths, header_row=True, first_col_bold=True),
        Spacer(1, 4),
        Paragraph(
            'Table 4 — Supplier map by product category. Landed cost excludes branding, '
            'packaging, and inbound freight to AANGAN\'s Lahore fulfillment hub.',
            sty_caption),
    ]


def build_section_9_marketing():
    """Marketing & GTM Plan with channel mix table."""
    channel_data = [
        ['Channel', 'Phase', 'Monthly budget (PKR)', '% of mix', 'Primary KPI'],
        ['Instagram organic + content', 'All', '40K (content prod)', '12%', 'Followers / engagement rate'],
        ['Instagram + TikTok paid ads', 'Growth onwards', '200K', '50%', 'CPA / ROAS'],
        ['Micro-influencer collabs (3-5/mo)', 'Launch + Growth', '80K', '20%', 'Coupon redemptions'],
        ['Campus activations (pop-ups)', 'Launch + Growth', '30K', '8%', 'In-person sales + email signups'],
        ['Email + SMS marketing', 'Growth onwards', '10K (tooling)', '3%', 'Open rate / repeat purchase'],
        ['Daraz marketplace fees', 'Scale', '40K (commission)', '7%', 'Marketplace revenue'],
        ['Quarterly Eid / drop campaigns', 'All', '20K', '5%', 'Drop-day revenue'],
        ['TOTAL', '—', '420K', '100%', '—'],
    ]
    channel_widths = [44*mm, 30*mm, 26*mm, 18*mm, 28*mm]

    return [
        section_header(9, 'Marketing & Go-To-Market Plan'),
        Paragraph(
            'AANGAN\'s 12-month GTM plan runs in three phases. <b>Phase 1 — Launch (months '
            '1-3)</b> is Instagram-first with three micro-influencer collaborations (50K-200K '
            'follower creators in fashion, lifestyle, and student-life niches), paired with '
            'campus activations at LUMS, Bahria, and NUST Lahore. The launch drop includes '
            '5 hero SKUs across the 10 categories, gated by an email waitlist built during '
            'the pre-launch month. <b>Phase 2 — Growth (months 4-8)</b> layers in paid '
            'Instagram and TikTok ads at PKR 200K/month, weekly content drops (Tuesday new-'
            'product drops, Friday lifestyle content), and a UGC hashtag campaign '
            '#MyAangan that rewards customer photos with PKR 500 store credit. <b>Phase 3 — '
            'Scale (months 9-12)</b> opens a Lahore pop-up store for 6 weeks in Q4, expands '
            'distribution to Daraz marketplace, and runs a co-branded Eid collection with one '
            'mid-tier designer for seasonal visibility.',
            sty_body_just),
        Paragraph(
            'The channel mix below is calibrated for a bootstrapped budget — paid social '
            'absorbs the largest share (50%) because Instagram and TikTok are where the target '
            'personas discover new brands, but organic content and influencer collaborations '
            'punch above their weight in the launch phase. Daraz marketplace entry is deferred '
            'to Q3 to protect brand control during the early identity-building months. KPIs '
            'track from month-1: Instagram followers (target 25K by month 3), monthly revenue '
            '(target PKR 2.5M by month 6), and contribution-margin break-even (target month 9-10).',
            sty_body_just),
        Spacer(1, 4),
        make_table(channel_data, channel_widths, header_row=True, first_col_bold=True),
        Spacer(1, 4),
        Paragraph(
            'Table 5 — Channel mix and monthly marketing budget allocation. Phase column '
            'indicates when each channel activates. Total monthly marketing budget is '
            'approximately PKR 420K, scaling to PKR 600K from month 6 onwards.',
            sty_caption),
    ]


def build_section_10_financials():
    """Financial Projections with startup cost + P&L tables."""
    startup_data = [
        ['Cost category', 'Amount (PKR)', 'Notes'],
        ['Inventory (first drop, 5 hero SKUs)', '1,800,000', '~1,400 units across 5 SKUs'],
        ['Brand identity + photography', '350,000', 'Logo, palette, product + lifestyle shoot'],
        ['Website build (Next.js + Shopify payments)', '250,000', 'Includes hosting year 1'],
        ['Packaging (mailers, swing tags, stickers)', '180,000', 'Kraft + branded, 2,000 unit run'],
        ['Initial marketing (launch phase)', '600,000', '3-month launch budget'],
        ['Working capital (months 1-3 opex)', '1,200,000', 'Founder + 1 part-time hire'],
        ['Legal + registration + trademarks', '80,000', 'SECP registration, IPO trademark'],
        ['Contingency (10%)', '446,000', 'Buffer for delays, returns, defects'],
        ['TOTAL STARTUP CAPITAL', '4,906,000', '~USD 17,500 at PKR 280/USD'],
    ]
    startup_widths = [60*mm, 30*mm, 56*mm]

    pnl_data = [
        ['Month', 'Units', 'Revenue (PKR)', 'COGS (PKR)', 'Gross profit', 'OpEx', 'Net (PKR)'],
        ['1', '120', '264,000', '114,000', '150,000', '420,000', '(270,000)'],
        ['3', '450', '990,000', '427,500', '562,500', '480,000', '82,500'],
        ['6', '1,100', '2,420,000', '1,045,000', '1,375,000', '600,000', '775,000'],
        ['9', '1,600', '3,520,000', '1,520,000', '2,000,000', '650,000', '1,350,000'],
        ['12', '2,100', '4,620,000', '1,995,000', '2,625,000', '700,000', '1,925,000'],
        ['Year 1 total', '~12,400', '~27,300,000', '~11,800,000', '~15,500,000', '~6,400,000', '~9,100,000'],
    ]
    pnl_widths = [16*mm, 16*mm, 30*mm, 28*mm, 28*mm, 22*mm, 28*mm]

    return [
        section_header(10, 'Financial Projections'),
        Paragraph('Startup cost breakdown', sty_h2),
        Paragraph(
            'The total startup capital required to launch AANGAN and sustain operations through '
            'month 3 is approximately PKR 4.9M (~USD 17,500 at current exchange rates). '
            'Inventory is the single largest line item at PKR 1.8M — funding the first drop of '
            'approximately 1,400 units across 5 hero SKUs at an average landed cost of PKR 1,000 '
            'per unit. Brand identity and photography absorb PKR 350K because the visual identity '
            'is the brand\'s primary competitive moat — this is not a place to under-invest. The '
            'website build (Next.js storefront with integrated checkout) is budgeted at PKR 250K '
            'and the launch-phase marketing at PKR 600K. Working capital of PKR 1.2M covers '
            'three months of founder stipend and one part-time hire.',
            sty_body_just),
        Spacer(1, 4),
        make_table(startup_data, startup_widths, header_row=True, first_col_bold=True),
        Spacer(1, 4),
        Paragraph('Table 6 — Startup cost breakdown.', sty_caption),
        Paragraph('Unit economics', sty_h2),
        Paragraph(
            'The unit economics are favorable. The average selling price across the catalog is '
            'PKR 2,200 (weighted toward tees and hoodies which form the volume core). The '
            'average COGS including fabric, cut-and-sew, branding, and packaging is PKR 950, '
            'yielding a gross margin of 57% — comfortably above the 45-50% benchmark for '
            'Pakistani D2C apparel brands. Operating expenses (founder stipend, marketing, '
            'tooling, fulfillment) scale from PKR 420K/month in month 1 to PKR 700K/month in '
            'month 12 as the team and marketing budget grow.',
            sty_body_just),
        Paragraph('12-month P&L projection', sty_h2),
        Spacer(1, 4),
        make_table(pnl_data, pnl_widths, header_row=True, first_col_bold=True),
        Spacer(1, 4),
        Paragraph(
            'Table 7 — 12-month P&L projection at selected milestones. All figures in PKR. '
            'Negative net in month 1 reflects upfront marketing and inventory investment. '
            'Break-even (cumulative net positive) projected at month 9.',
            sty_caption),
        Paragraph('Funding plan', sty_h2),
        Paragraph(
            'Funding comes from three sources: founder personal savings (PKR 2.0M), family '
            'contribution (PKR 1.5M, treated as founder equity), and one angel investor '
            '(PKR 1.4M for 15% equity, valuing the company at PKR 9.3M pre-money). The angel '
            'is identified and term sheet is in draft — closing targeted for month -2 (two '
            'months before launch). All three funding sources are committed in principle; '
            'no institutional VC is being approached in year 1 to preserve brand-building '
            'optionality and avoid premature scaling pressure.',
            sty_body_just),
    ]


def build_section_11_identity():
    """Brand Visual Identity summary."""
    return [
        section_header(11, 'Brand Visual Identity'),
        Paragraph(
            'AANGAN\'s visual identity is intentionally restrained — a serif wordmark, a tight '
            '5-color earth-tone palette, and disciplined typography. This is the brand\'s '
            'sharpest competitive differentiation: in a market saturated with logo-heavy '
            'streetwear and ethnic-illustration premium brands, AANGAN offers the opposite '
            'pole — quiet, typography-led, palette-led. A full brand identity kit (logo '
            'concepts, color swatches with hex codes, typography specs, packaging mockups, '
            'and applied examples) is delivered as a separate PDF deliverable alongside this '
            'brand plan.',
            sty_body_just),
        Paragraph('Logo concept', sty_h3),
        Paragraph(
            'The primary logo is a lowercase serif wordmark: <b>aangan.</b> with a terminal '
            'period as a "restraint signal" — a small typographic gesture that says "this '
            'brand is finished thinking about itself." The wordmark is set in Noto Serif SC '
            'Bold (or a comparable serif such as Tinos / Playfair Display in Latin), 86pt at '
            'cover scale, 12pt at hem-label scale. No icon, no symbol, no monogram — the '
            'wordmark carries the entire brand mark. This is a deliberate UNIQLO / Khaadi-'
            'archive move, not a Levi\'s / Nike move.',
            sty_body_just),
        Paragraph('Color palette', sty_h3),
        Paragraph(
            'Five core colors form the AANGAN palette: <b>Cream</b> (#FAF7F2) as the primary '
            'background — warm, not cold, paper-like; <b>Warm Black</b> (#1A1614) as the primary '
            'text and dark surface — near-black with a brown undertone rather than pure black; '
            '<b>Terracotta Clay</b> (#8B5A3C) as the single accent color — used for rules, '
            'labels, and one product per category as the hero colorway; <b>Olive</b> (#6B7A4F) '
            'as the chart and secondary-product colorway; and <b>Sandstone</b> (#C9BBA3) as '
            'the border and surface neutral. No sixth color is permitted in year 1.',
            sty_body_just),
        Paragraph('Typography system', sty_h3),
        Paragraph(
            'Two typefaces only. <b>Noto Serif SC</b> (or Playfair Display in Latin) handles '
            'all display text — wordmark, section headers, hero typography on the storefront. '
            '<b>Noto Sans SC</b> (or Inter in Latin) handles all body text, product descriptions, '
            'UI labels, and packaging copy. The serif-sans pairing is the cleanest, most '
            'editorial combination available — and both Noto SC faces have full Urdu-compatible '
            'weights if the brand expands into bilingual copy in year 2.',
            sty_body_just),
        Paragraph('Tagline', sty_h3),
        Paragraph(
            '<b>Wear the Courtyard.</b> — Three words, present-tense imperative, lowercase '
            'period at the end. Extends the brand-name metaphor without over-explaining it. '
            'Used on the storefront hero, the about page, the email signature, and the '
            'packaging insert card.',
            sty_body_just),
        Paragraph('Packaging concept', sty_h3),
        Paragraph(
            'Every order ships in a kraft mailer (recycled, uncoated) with a debossed '
            'wordmark — no ink print, no full-color sleeve. Inside: the product wrapped in '
            'tissue paper (cream, unbranded), a handwritten thank-you card on cream cardstock '
            '(the only ink in the package), and a recycled swing tag attached with cotton '
            'twine. The unboxing experience is tactile and quiet — no plastic, no foil, no '
            'glossy inserts. This costs PKR 28-45 per unit landed, against an industry average '
            'of PKR 18-25, but the packaging is a primary brand touchpoint worth the premium.',
            sty_body_just),
    ]


def build_section_12_roadmap():
    """12-Month Roadmap with table."""
    roadmap_data = [
        ['Quarter', 'Product', 'Marketing', 'Operations', 'Milestone'],
        ['Q1 (mo 1-3)', '5 hero SKUs launched', '3 influencer collabs + campus pop-ups', 'Store live, first 100 orders shipped', 'Month-3: 25K IG followers'],
        ['Q2 (mo 4-6)', 'Expand to 15 SKUs', 'Paid IG + TikTok ads scaled', 'Hire part-time fulfillment', 'Month-6: PKR 2.5M/mo revenue'],
        ['Q3 (mo 7-9)', 'Full 10-category catalog live', 'Daraz marketplace entry', 'Outsource fulfillment to 3PL', 'Month-9: break-even'],
        ['Q4 (mo 10-12)', 'Eid capsule collection', 'Designer collab launch', 'Lahore pop-up store (6 weeks)', 'Month-12: PKR 4.6M/mo revenue'],
    ]
    roadmap_widths = [25*mm, 33*mm, 38*mm, 32*mm, 36*mm]

    return [
        section_header(12, '12-Month Roadmap & Next Steps'),
        Paragraph(
            'The 12-month roadmap below pairs product, marketing, and operations milestones '
            'quarter by quarter, with a single defining milestone per quarter that the team '
            'is accountable for. The roadmap is deliberately ambitious but not aggressive — '
            'a bootstrapped brand with PKR 4.9M startup capital cannot afford to scale faster '
            'than its cash flow and inventory cycles allow, so the plan front-loads brand-'
            'building and back-loads distribution expansion. The Daraz marketplace entry in '
            'Q3 and the Lahore pop-up in Q4 are contingent on hitting Q2 revenue and Q3 '
            'break-even milestones respectively — both are stretch goals, not baseline '
            'commitments.',
            sty_body_just),
        Spacer(1, 4),
        make_table(roadmap_data, roadmap_widths, header_row=True, first_col_bold=True),
        Spacer(1, 4),
        Paragraph('Table 8 — 12-month roadmap with quarterly milestones.', sty_caption),
        Paragraph('Immediate next steps (week 1-2)', sty_h2),
        Paragraph(
            '<b>1. Register the brand name.</b> File SECP (Securities and Exchange Commission '
            'of Pakistan) sole-proprietor or private-limited registration for AANGAN, and '
            'submit IPO (Intellectual Property Organization) trademark application for the '
            'wordmark in Class 25 (clothing) and Class 16 (printed notebooks). Cost: PKR 80K '
            'all-in. Lead time: 4-6 weeks for SECP, 18-24 months for trademark final grant '
            'but application filing secures priority date.',
            sty_body_just),
        Paragraph(
            '<b>2. Finalize the logo and visual identity.</b> Lock the wordmark in Noto Serif '
            'SC Bold, finalize the 5-color palette hex codes, and produce the brand identity '
            'kit PDF (the separate deliverable accompanying this plan). Engage a typographer '
            'or designer for one round of refinement on the wordmark — budget PKR 40K, 1 week '
            'turnaround.',
            sty_body_just),
        Paragraph(
            '<b>3. Sign the first supplier.</b> Convert the in-principle agreement with the '
            'Lahore (Sundar) cut-and-sew unit into a formal purchase order for the first 200 '
            'hoodie units, with delivery targeted for week 6. Pay the 30% deposit (PKR 99K) '
            'from founder capital. Place a parallel fabric order with Masood Mill in Faisalabad '
            'for 500 meters of 320 GSM cotton fleece in cream, sandstone, and warm-black.',
            sty_body_just),
        Paragraph(
            '<b>4. Build the Next.js storefront.</b> Stand up the AANGAN e-commerce site on '
            'Next.js 16 with Tailwind CSS, shadcn/ui components, and integrated checkout '
            '(Stripe for international cards, JazzCash / Easypaisa for local payments). The '
            'site must include a homepage, a shop page with category filtering across all 10 '
            'categories, individual product detail pages, a cart and checkout flow, an about '
            'page, and a contact page. This storefront is the third deliverable accompanying '
            'this brand plan.',
            sty_body_just),
        Paragraph(
            '<b>5. Shoot the first product photography batch.</b> Book a 2-day studio shoot in '
            'Lahore (Karim Block studio or equivalent) covering the 5 hero SKUs across '
            'flat-lay, on-model, and detail shots. Use natural light and warm cream backdrops '
            'to match the brand palette. Budget PKR 120K including model fees, photographer, '
            'and retouching. Output: 8-12 product images per SKU, ready for storefront and '
            'Instagram.',
            sty_body_just),
    ]


# ─────────────────────────────────────────────────────────────
# Main build
# ─────────────────────────────────────────────────────────────
def build():
    output_path = '/home/z/my-project/download/AANGAN_Brand_Plan.pdf'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=MARGIN_L,
        rightMargin=MARGIN_R,
        topMargin=MARGIN_T,
        bottomMargin=MARGIN_B,
        title='AANGAN — Brand Plan v1.0',
        author='AANGAN / Z.ai',
        subject='Brand plan for a Pakistani clothing brand',
        creator='AANGAN Brand Studio',
    )

    story = []
    # Cover (page 1)
    story.extend(build_cover())
    # Body (pages 2+)
    story.extend(build_section_2_executive_summary())
    story.extend(build_section_3_brand_story())
    story.extend(build_section_4_market())
    story.extend(build_section_5_audience())
    story.extend(build_section_6_positioning())
    story.extend(build_section_7_catalog())
    story.extend(build_section_8_suppliers())
    story.extend(build_section_9_marketing())
    story.extend(build_section_10_financials())
    story.extend(build_section_11_identity())
    story.extend(build_section_12_roadmap())

    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_later_pages)
    print(f'OK — Brand plan PDF generated: {output_path}')
    # Report file size
    size_kb = os.path.getsize(output_path) / 1024
    print(f'File size: {size_kb:.1f} KB')


if __name__ == '__main__':
    build()
