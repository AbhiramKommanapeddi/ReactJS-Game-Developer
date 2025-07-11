# Adding New Images to Spot the Difference Game

## Steps to Add Your Image:

### 1. Prepare Your Images

- **Original Image**: The base image without modifications
- **Modified Image**: The same image with 5-7 subtle differences

### 2. Image Requirements

- **Format**: PNG, JPG, or SVG
- **Size**: Recommended 500x400 pixels (or similar aspect ratio)
- **Quality**: High resolution for clear differences

### 3. File Placement

Place your images in the `images/` folder with descriptive names:

- `images/safari_original.png`
- `images/safari_modified.png`

### 4. Create JSON Configuration

Create a new file `data/safari_animals.json`:

```json
{
  "gameTitle": "Spot the Difference - Safari Animals",
  "images": {
    "image1": "images/safari_original.png",
    "image2": "images/safari_modified.png"
  },
  "differences": [
    {
      "x": 100,
      "y": 150,
      "width": 80,
      "height": 60,
      "hint": "Look at the elephant's ears!"
    },
    {
      "x": 250,
      "y": 200,
      "width": 50,
      "height": 70,
      "hint": "Something's different about the giraffe's spots"
    },
    {
      "x": 400,
      "y": 100,
      "width": 60,
      "height": 40,
      "hint": "Check the tree branches"
    },
    {
      "x": 50,
      "y": 300,
      "width": 90,
      "height": 50,
      "hint": "Look at the grass pattern"
    },
    {
      "x": 300,
      "y": 50,
      "width": 70,
      "height": 80,
      "hint": "Something changed in the sky"
    }
  ],
  "maxHints": 3,
  "timeLimit": 300
}
```

### 5. Update HTML Dropdown

Add your new level to the dropdown in `index.html`:

```html
<select id="levelSelect" class="level-select">
  <option value="test">Test Level - Simple Shapes</option>
  <option value="level1">Level 1 - Animals</option>
  <option value="level2">Level 2 - Landscape</option>
  <option value="level3">Level 3 - City</option>
  <option value="safari_animals">Safari Animals - New Level</option>
</select>
```

## Creating Differences Coordinates

To find the exact coordinates for differences:

1. **Use Browser Developer Tools**:

   - Open your image in the game
   - Right-click → Inspect Element
   - Use the browser's measurement tools

2. **Image Editing Software**:

   - Open in Photoshop/GIMP
   - Use the selection tool to get pixel coordinates
   - Note: Coordinates are (x, y) from top-left corner

3. **Online Coordinate Finder**:
   - Use tools like "Image Map Generator" online
   - Upload your image and click to get coordinates

## Tips for Good Differences:

- **Subtle but noticeable**: Color changes, missing objects, extra elements
- **Well-distributed**: Spread across the image
- **Clear boundaries**: Define exact clickable areas
- **Meaningful hints**: Help players without giving away the answer

## Testing Your New Level:

1. Add your images to the `images/` folder
2. Create the JSON configuration
3. Update the HTML dropdown
4. Test the game and adjust coordinates as needed
