from PIL import Image

def retouch_all():
    # 1. Frontal White (1024x1024)
    im1 = Image.open('public/images/bebedouro-frontal-white.webp').convert('RGB')
    patch1 = im1.crop((340, 420, 410, 452)).resize((120, 32))
    im1.paste(patch1, (455, 420))
    im1.save('public/images/bebedouro-frontal-white.webp', 'WEBP', quality=95)
    print('[OK] bebedouro-frontal-white.webp retouched successfully')

    # 2. Lifestyle Hero (1024x571)
    im2 = Image.open('public/images/bebedouro-lifestyle-hero.jpg').convert('RGB')
    patch2 = im2.crop((370, 240, 440, 265)).resize((85, 25))
    im2.paste(patch2, (460, 240))
    im2.save('public/images/bebedouro-lifestyle-hero.jpg', 'JPEG', quality=95)
    print('[OK] bebedouro-lifestyle-hero.jpg retouched successfully')

    # 3. Inox Top (1024x1024)
    im3 = Image.open('public/images/bebedouro-inox-top.webp').convert('RGB')
    patch3 = im3.crop((200, 560, 245, 615)).resize((85, 55))
    im3.paste(patch3, (250, 540))
    im3.save('public/images/bebedouro-inox-top.webp', 'WEBP', quality=95)
    print('[OK] bebedouro-inox-top.webp retouched successfully')

if __name__ == '__main__':
    retouch_all()
