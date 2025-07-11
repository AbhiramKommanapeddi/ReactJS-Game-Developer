# 🎮 Spot the Difference Game - Image Creation Prompt

## For AI Image Generation (DALL-E, Midjourney, etc.)

### Original Image Prompt:

```
Create a detailed safari scene with African animals for a spot-the-difference game. The scene should include:

- A large African elephant with visible tusks in the foreground
- A tall giraffe with distinctive spot patterns in the middle ground
- A zebra with clear black and white stripes on the right side
- An acacia tree with umbrella-shaped canopy
- African savanna background with golden grass
- Blue sky with a few white clouds
- Some rocks and small vegetation scattered around
- Warm, sunny lighting typical of African safari
- High detail and vibrant colors
- Dimensions: 500x400 pixels or similar 5:4 aspect ratio
- Style: Realistic but suitable for a family-friendly game

The image should be clear and detailed enough that small differences can be spotted easily.
```

### Modified Image Prompt:

```
Create the same safari scene as described above, but with these 7 subtle differences:

1. Change the elephant's trunk position (curl it differently)
2. Alter 2-3 spots on the giraffe (different positions/sizes)
3. Shift the zebra's stripe pattern slightly
4. Remove one small branch from the acacia tree
5. Add a small rock near the existing rocks
6. Add 2-3 extra grass tufts in the foreground
7. Remove one cloud from the sky

Keep all other elements identical to maintain the spot-the-difference challenge.
```

## For Manual Photo Editing (Photoshop, GIMP, etc.)

### Steps to Create Your Own:

1. **Take or find a base image** (royalty-free safari photo)
2. **Make subtle modifications**:
   - Clone/move small objects
   - Change colors slightly
   - Add/remove small details
   - Modify patterns or textures
   - Adjust shadows or lighting

### Difference Ideas:

- **Animal changes**: Ear positions, tail positions, eye colors
- **Vegetation**: Add/remove leaves, flowers, grass patches
- **Sky elements**: Clouds, birds, sun position
- **Ground details**: Rocks, shadows, water puddles
- **Color variations**: Slight hue changes in clothing, objects
- **Pattern changes**: Stripes, spots, textures

## Technical Requirements:

### Image Specs:

- **Format**: PNG or JPG (PNG recommended for sharp edges)
- **Size**: 500x400 pixels (or maintain 5:4 aspect ratio)
- **Quality**: High resolution for clear details
- **File size**: Under 2MB for web optimization

### Coordinate Mapping:

After creating your images, you'll need to define clickable areas:

```json
{
  "x": 120, // Distance from left edge
  "y": 180, // Distance from top edge
  "width": 80, // Width of clickable area
  "height": 60, // Height of clickable area
  "hint": "Look at the elephant's trunk position"
}
```

### Tools to Find Coordinates:

1. **Browser Developer Tools**: Inspect element and hover over areas
2. **Image editors**: Use selection tools to get pixel coordinates
3. **Online tools**: Search "image coordinate finder" or "image map generator"

## File Naming Convention:

- `safari_animals_original.png` (your base image)
- `safari_animals_modified.png` (image with differences)

## Quality Tips:

- **Subtle differences**: Not too obvious, but not impossibly hard
- **Well-distributed**: Spread differences across the image
- **Consistent style**: Both images should have identical lighting/style
- **Clear boundaries**: Differences should have clear edges for clicking
- **Appropriate difficulty**: 5-7 differences for good gameplay

## Example Differences for Safari Theme:

1. **Elephant**: Trunk position, ear angle, tusk size
2. **Giraffe**: Spot patterns, neck position, tongue visibility
3. **Zebra**: Stripe width/position, tail position, leg stance
4. **Tree**: Branch count, leaf density, trunk markings
5. **Background**: Cloud shapes, grass patches, rock positions
6. **Sky**: Bird additions, cloud removals, color variations
7. **Ground**: Shadow lengths, water reflections, small objects

---

After creating your images, simply:

1. Replace the placeholder SVG files with your PNG/JPG images
2. Update the JSON configuration with correct coordinates
3. Test the game and adjust coordinates as needed
