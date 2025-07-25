#!/usr/bin/env python3
"""
Create PNG images for Farcaster Mini App
- icon.png: 1024x1024 with no alpha channel
- splash.png: 200x200 for splash screen
"""

try:
    from PIL import Image, ImageDraw
    import os
    import sys
    
    def create_icon():
        # Create 1024x1024 image with RGB mode (no alpha)
        img = Image.new('RGB', (1024, 1024), '#1a1a2e')
        draw = ImageDraw.Draw(img)
        
        # Background gradient effect (simple approximation)
        for y in range(1024):
            for x in range(1024):
                # Distance from center
                dx = x - 512
                dy = y - 512
                distance = (dx*dx + dy*dy) ** 0.5
                
                # Gradient from center
                if distance <= 512:
                    ratio = distance / 512
                    r = int(22 * (1-ratio) + 15 * ratio)  # 16213e to 0f1419
                    g = int(33 * (1-ratio) + 20 * ratio)
                    b = int(62 * (1-ratio) + 25 * ratio)
                    img.putpixel((x, y), (r, g, b))
        
        draw = ImageDraw.Draw(img)
        
        # Radar circles
        draw.ellipse([212, 212, 812, 812], outline='#60a5fa', width=4)  # 300px radius
        draw.ellipse([312, 312, 712, 712], outline='#60a5fa', width=3)  # 200px radius  
        draw.ellipse([412, 412, 612, 612], outline='#60a5fa', width=2)  # 100px radius
        
        # Center eye (ellipse)
        draw.ellipse([432, 462, 592, 562], fill='#3b82f6', outline='#60a5fa', width=2)
        
        # Inner pupil
        draw.ellipse([487, 487, 537, 537], fill='#ffffff')
        
        # Pupil center
        draw.ellipse([500, 500, 524, 524], fill='#1e40af')
        
        # Scanning lines
        draw.line([(392, 512), (632, 512)], fill='#60a5fa', width=2)
        draw.line([(512, 432), (512, 592)], fill='#60a5fa', width=2)
        
        # Radar sweep line
        draw.line([(512, 512), (512, 212)], fill='#60a5fa', width=3)
        draw.ellipse([504, 204, 520, 220], fill='#60a5fa')
        
        # Corner accent dots
        draw.ellipse([144, 144, 156, 156], fill='#60a5fa')
        draw.ellipse([868, 144, 880, 156], fill='#60a5fa')
        draw.ellipse([144, 868, 156, 880], fill='#60a5fa')
        draw.ellipse([868, 868, 880, 880], fill='#60a5fa')
        
        # Trust network nodes
        nodes = [(300, 300), (724, 300), (300, 724), (724, 724)]
        for x, y in nodes:
            draw.ellipse([x-4, y-4, x+4, y+4], fill='#3b82f6')
            # Connection lines to center
            draw.line([(x, y), (512, 512)], fill='#3b82f6', width=1)
        
        # Save as PNG
        img.save('../public/icon.png', 'PNG')
        print('Created icon.png (1024x1024)')
        return True
    
    def create_splash():
        # Create 200x200 image with RGB mode (no alpha)
        img = Image.new('RGB', (200, 200), '#0f1419')
        draw = ImageDraw.Draw(img)
        
        # Radar circles
        draw.ellipse([40, 40, 160, 160], outline='#60a5fa', width=2)  # 60px radius
        draw.ellipse([65, 65, 135, 135], outline='#60a5fa', width=1)  # 35px radius
        
        # Center eye
        draw.ellipse([75, 85, 125, 115], fill='#3b82f6', outline='#60a5fa', width=1)
        
        # Pupil
        draw.ellipse([92, 92, 108, 108], fill='#ffffff')
        
        # Pupil center
        draw.ellipse([96, 96, 104, 104], fill='#1e40af')
        
        # Scanning lines
        draw.line([(65, 100), (135, 100)], fill='#60a5fa', width=1)
        draw.line([(100, 65), (100, 135)], fill='#60a5fa', width=1)
        
        # Save as PNG
        img.save('../public/splash.png', 'PNG')
        print('Created splash.png (200x200)')
        return True
    
    # Create images
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    if create_icon() and create_splash():
        print('✓ All images created successfully!')
        sys.exit(0)
    else:
        print('✗ Failed to create images')
        sys.exit(1)
        
except ImportError:
    print('PIL (Pillow) not available. Installing...')
    os.system('pip3 install --user Pillow')
    print('Please run the script again after installation.')
    sys.exit(1)
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)