from PIL import Image
import os

print("--- OTIMIZANDO IMAGENS DO SITE PARA MOBILE ---")

# 1. Logo
logo_path = 'public/images/logo-animal-fresh.png'
logo = Image.open(logo_path).convert('RGBA')

# Save WebP version
webp_logo_path = 'public/images/logo-animal-fresh.webp'
logo.save(webp_logo_path, 'WEBP', quality=95, method=6)
print(f"Logo WebP gerado: {os.path.getsize(webp_logo_path)/1024:.1f} KB (era {os.path.getsize(logo_path)/1024:.1f} KB)")

# Overwrite PNG with optimized version
logo.save(logo_path, 'PNG', optimize=True)
print(f"Logo PNG otimizado: {os.path.getsize(logo_path)/1024:.1f} KB")

# 2. Lifestyle Hero
hero_path = 'public/images/bebedouro-lifestyle-hero.jpg'
hero = Image.open(hero_path).convert('RGB')

# Save WebP version
webp_hero_path = 'public/images/bebedouro-lifestyle-hero.webp'
hero.save(webp_hero_path, 'WEBP', quality=88, method=6)
print(f"Hero WebP gerado: {os.path.getsize(webp_hero_path)/1024:.1f} KB (era {os.path.getsize(hero_path)/1024:.1f} KB)")

# Also optimize hero JPG
hero.save(hero_path, 'JPEG', quality=85, optimize=True)
print(f"Hero JPG otimizado: {os.path.getsize(hero_path)/1024:.1f} KB")

print("--- OTIMIZAÇÃO CONCLUÍDA ---")
