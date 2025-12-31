# Hero Images Manifest

## AI-Generated Images (5)

### 1. Dashboard Hero - Aerial View
**File**: `hero_dashboard_aerial_1767170289260.png`  
**Usage**: Dashboard (/) page hero section  
**Description**: Aerial view of modern building with green roof  
**Dimensions**: High-res  
**Color Palette**: Warm sunset tones, urban greens

---

### 2. Garden View Hero - Rooftop Panorama
**File**: `hero_garden_rooftop_1767170303575.png`  
**Usage**: Garden View (/gardens/:id) page hero  
**Description**: Wide panoramic rooftop garden at golden hour  
**Dimensions**: High-res  
**Color Palette**: Vibrant greens (#4A7C59, #7FB069), warm lighting

---

### 3. Vertical Garden Hero
**File**: `hero_vertical_garden_1767170354992.png`  
**Usage**: Alternative for Garden View or Zones List  
**Description**: Floor-to-ceiling living wall installation  
**Dimensions**: High-res  
**Color Palette**: Rich greens, natural lighting

---

### 4. Context - Dry Soil (Low Moisture Alert)
**File**: `context_dry_soil_1767170320807.png`  
**Usage**: Insights page when top issue is low moisture  
**Description**: Close-up of dry, cracked soil  
**Dimensions**: High-res  
**Color Palette**: Earthy browns, stressed appearance

---

### 5. Context - Healthy Growth
**File**: `context_healthy_growth_1767170338458.png`  
**Usage**: Zone Detail hero, success states  
**Description**: Thriving plants with water droplets  
**Dimensions**: High-res  
**Color Palette**: Vibrant greens, morning dew

---

## Stock Photos Needed (10)

### Aerial Views (2-3 needed)
**Sources**: Unsplash, Pexels  
**Search Terms**:
- "green roof aerial view"
- "rooftop garden from above"
- "urban green building aerial"

**Criteria**:
- High resolution (1920x1080+)
- Professional quality
- Modern buildings
- Clear green roof visibility

**Suggested Images**:
1. **Primary**: Unsplash - Search "green roof aerial"
2. **Secondary**: Pexels - Search "rooftop garden aerial"

---

### Garden Wide Shots (3-4 needed)
**Sources**: Unsplash, Pexels  
**Search Terms**:
- "rooftop garden panorama"
- "vertical garden wall"
- "indoor atrium plants"
- "green wall installation"

**Criteria**:
- Wide angle
- Lush, healthy plants
- Good lighting
- Professional composition

**Suggested Images**:
1. **Rooftop Garden**: Unsplash - "rooftop garden"
2. **Vertical Wall**: Unsplash - "vertical garden"
3. **Indoor Atrium**: Pexels - "indoor garden"

---

### Plant Close-ups (4-5 needed)
**Sources**: Unsplash, Pexels  
**Search Terms**:
- "fern water droplets"
- "succulent arrangement"
- "tropical foliage"
- "herb garden close up"
- "plant leaves macro"

**Criteria**:
- Macro/close-up
- Sharp focus
- Vibrant colors
- Natural lighting

**Suggested Images**:
1. **Ferns**: Unsplash - "fern water droplets"
2. **Succulents**: Unsplash - "succulent top view"
3. **Mixed Foliage**: Pexels - "tropical leaves"
4. **Herbs**: Unsplash - "herb garden"

---

## Image Usage Map

### Dashboard (/)
- **Hero**: `hero_dashboard_aerial_1767170289260.png` (AI)
- **Fallback**: Stock aerial green roof photo

### Garden View (/gardens/:id)
- **Hero**: `hero_garden_rooftop_1767170303575.png` (AI)
- **Alternative**: `hero_vertical_garden_1767170354992.png` (AI)
- **Fallback**: Stock rooftop garden panorama

### Zone Detail (/zones/:id)
- **Hero**: Stock plant close-up (species-specific)
- **Background**: `context_healthy_growth_1767170338458.png` (AI)
- **Fallback**: Stock fern or succulent close-up

### Zones List (/zones)
- **Hero**: Stock lush garden wide shot
- **Fallback**: `hero_vertical_garden_1767170354992.png` (AI)

### Insights (/insights)
- **Hero (Low Moisture)**: `context_dry_soil_1767170320807.png` (AI)
- **Hero (Healthy)**: `context_healthy_growth_1767170338458.png` (AI)
- **Hero (General)**: Stock garden photo
- **Fallback**: Contextual based on top insight severity

---

## Stock Photo Download Instructions

### Step 1: Visit Unsplash
1. Go to https://unsplash.com
2. Search for each category
3. Download high-res (1920x1080 minimum)
4. Save to `frontend/public/images/hero/stock/`

### Step 2: Visit Pexels
1. Go to https://pexels.com
2. Search for remaining categories
3. Download high-res
4. Save to `frontend/public/images/hero/stock/`

### Step 3: Rename Files
Use consistent naming:
- `stock-aerial-greenroof-01.jpg`
- `stock-garden-rooftop-01.jpg`
- `stock-plant-fern-01.jpg`

---

## Licensing

### AI-Generated Images
- **License**: Full ownership, no attribution required
- **Usage**: Unlimited commercial use
- **Source**: Generated via Gemini AI

### Stock Photos
- **Unsplash**: Free to use, no attribution required (but appreciated)
- **Pexels**: Free to use, no attribution required
- **License**: Both are royalty-free for commercial use

---

## Next Steps

1. ✅ AI images generated and copied to `/frontend/public/images/hero/`
2. ⏳ Download 10 stock photos from Unsplash/Pexels
3. ⏳ Optimize all images (WebP conversion)
4. ⏳ Update image references in components
5. ⏳ Test image loading and performance

---

## Optimization Notes

**Before Deployment**:
- Convert PNG to WebP for better compression
- Create responsive image sets (srcset)
- Implement lazy loading for below-fold images
- Add blur placeholders for smooth loading

**Tools**:
- `sharp` npm package for image optimization
- `next/image` if using Next.js
- Manual WebP conversion via online tools
