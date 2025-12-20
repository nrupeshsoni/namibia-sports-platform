# Tourism Portal Design Analysis

## Key Design Elements Observed

### Grid Layout
- **2-column grid** on mobile (not 4-column)
- Each block is a **card with full-bleed background image**
- **Text overlay** with white serif typography (Georgia-style)
- **Dark gradient overlay** on images for text readability
- Cards have **varied heights** - some take 1 row, some take 2 rows
- **No borders** between cards - edge-to-edge design

### Typography
- **All caps** for main text (e.g., "SKELETON COAST", "FISH RIVER CANYON")
- **Smaller descriptive text** above main title (e.g., "ADVENTURE IN", "WILD", "DISCOVER THE")
- **White text** with subtle shadow for readability
- **Serif font** (Georgia or similar) for elegant feel

### Card Structure
Examples from video:
1. "SKELETON COAST" - Simple title only
2. "FISH RIVER CANYON" - Simple title only  
3. "ADVENTURE IN SWAKOPMUND" - Descriptive text + title
4. "WILD DAMARALAND" - Descriptive text + title
5. "DISCOVER THE CAPRIVI STRIP" - Descriptive text + title

### Animations
- **Smooth scroll** behavior
- Cards appear to have **subtle hover/tap effects**
- **Parallax scrolling** on hero section

### Color Scheme
- **Full-color photography** as backgrounds
- **Dark overlay** (rgba(0,0,0,0.3-0.5)) on images
- **White text** for maximum contrast
- **Orange accent** for buttons (Safari Guide AI button)

## Application to Sports Platform

### Entity Structure (in order):
1. **Ministry of Sports** - Single large card
2. **Sports Commission** - Single large card
3. **Umbrella Bodies** (8 total):
   - Disability Sport Namibia
   - NAWISA
   - NNSU
   - NNOC
   - TISAN
   - Uniformed Forces
   - Local Authority
   - Martial Arts Namibia
4. **Sports Federations** (57 total) - Alphabetically ordered

### Card Design for Sports:
- Each federation gets a **full-bleed action photo** of that sport
- **Sport name** in large white serif caps
- Optional **descriptive text** (e.g., "NAMIBIA", "NATIONAL", "FEDERATION OF")
- **Dark overlay** for text readability
- **Click to open** modal with full details

### Grid Behavior:
- **2 columns** on mobile/tablet
- **4 columns** on desktop
- **Masonry/varied heights** for visual interest
- **Smooth animations** on scroll and interaction
