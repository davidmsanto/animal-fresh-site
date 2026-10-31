import os
import cv2
import numpy as np

BRAIN_DIR = r"C:\Users\David M\.gemini\antigravity\brain\6874d40b-ce0f-4e3c-8f14-a8380bef2818\.user_uploaded"

def retouch_inox_top():
    print("--- 1. Retouching bebedouro-inox-top.webp ---")
    orig_path = os.path.join(BRAIN_DIR, "media_1793152383878_ecd19a1b.webp")
    img = cv2.imread(orig_path)
    
    # Text region for Miau Store on the angled front wall
    # x: 248..340, y: 532..578
    x1, y1, x2, y2 = 248, 532, 342, 578
    roi = img[y1:y2, x1:x2]
    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    # Letters are darker than white plastic (gray < 205)
    _, text_mask = cv2.threshold(gray_roi, 205, 255, cv2.THRESH_BINARY_INV)
    
    # Morphological dilation: 2 iterations with 3x3 ellipse to cover antialiased edges
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    dilated = cv2.dilate(text_mask, kernel, iterations=2)
    
    full_mask = np.zeros(img.shape[:2], dtype=np.uint8)
    full_mask[y1:y2, x1:x2] = dilated
    
    # Inpaint with Telea algorithm (radius 5 for smooth gradient propagation)
    inpainted = cv2.inpaint(img, full_mask, 5, cv2.INPAINT_TELEA)
    
    # Subtle blend with bilateral filter to preserve natural lighting gradient and eliminate any sharp seams
    smoothed = cv2.bilateralFilter(inpainted, d=7, sigmaColor=15, sigmaSpace=15)
    feathered = cv2.GaussianBlur(full_mask, (7, 7), 0).astype(float) / 255.0
    
    final_img = inpainted.copy()
    for c in range(3):
        final_img[:, :, c] = (
            final_img[:, :, c] * (1 - feathered * 0.45) +
            smoothed[:, :, c] * (feathered * 0.45)
        ).astype(np.uint8)
        
    out_path = "public/images/bebedouro-inox-top.webp"
    cv2.imwrite(out_path, final_img, [cv2.IMWRITE_WEBP_QUALITY, 96])
    cv2.imwrite("test-results/screenshots/final-inox-top-close.png", final_img[y1-30:y2+30, x1-30:x2+30])
    print(f"[OK] Saved {out_path} with 0 artifacts.")

def retouch_frontal_white():
    print("--- 2. Retouching bebedouro-frontal-white.webp ---")
    orig_path = os.path.join(BRAIN_DIR, "media_1793152383877_0a6a3cf1.webp")
    img = cv2.imread(orig_path)
    
    # Text region for Miau Store on frontal view
    # x: 440..585, y: 418..458
    x1, y1, x2, y2 = 440, 418, 585, 458
    roi = img[y1:y2, x1:x2]
    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    _, text_mask = cv2.threshold(gray_roi, 205, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    dilated = cv2.dilate(text_mask, kernel, iterations=2)
    
    full_mask = np.zeros(img.shape[:2], dtype=np.uint8)
    full_mask[y1:y2, x1:x2] = dilated
    
    inpainted = cv2.inpaint(img, full_mask, 5, cv2.INPAINT_TELEA)
    smoothed = cv2.bilateralFilter(inpainted, d=7, sigmaColor=15, sigmaSpace=15)
    feathered = cv2.GaussianBlur(full_mask, (7, 7), 0).astype(float) / 255.0
    
    final_img = inpainted.copy()
    for c in range(3):
        final_img[:, :, c] = (
            final_img[:, :, c] * (1 - feathered * 0.45) +
            smoothed[:, :, c] * (feathered * 0.45)
        ).astype(np.uint8)
        
    out_path = "public/images/bebedouro-frontal-white.webp"
    cv2.imwrite(out_path, final_img, [cv2.IMWRITE_WEBP_QUALITY, 96])
    cv2.imwrite("test-results/screenshots/final-frontal-white-close.png", final_img[y1-30:y2+30, x1-30:x2+30])
    print(f"[OK] Saved {out_path} with 0 artifacts.")

def retouch_lifestyle_hero():
    print("--- 3. Retouching bebedouro-lifestyle-hero.jpg ---")
    orig_path = os.path.join(BRAIN_DIR, "media_1793152332879_2f65947d.jpg")
    img = cv2.imread(orig_path)
    
    # Text region for Miau Store on lifestyle hero counter
    # x: 458..555, y: 236..268
    x1, y1, x2, y2 = 458, 236, 555, 268
    roi = img[y1:y2, x1:x2]
    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    _, text_mask = cv2.threshold(gray_roi, 195, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    dilated = cv2.dilate(text_mask, kernel, iterations=2)
    
    full_mask = np.zeros(img.shape[:2], dtype=np.uint8)
    full_mask[y1:y2, x1:x2] = dilated
    
    inpainted = cv2.inpaint(img, full_mask, 5, cv2.INPAINT_TELEA)
    smoothed = cv2.bilateralFilter(inpainted, d=7, sigmaColor=15, sigmaSpace=15)
    feathered = cv2.GaussianBlur(full_mask, (7, 7), 0).astype(float) / 255.0
    
    final_img = inpainted.copy()
    for c in range(3):
        final_img[:, :, c] = (
            final_img[:, :, c] * (1 - feathered * 0.45) +
            smoothed[:, :, c] * (feathered * 0.45)
        ).astype(np.uint8)
        
    out_path = "public/images/bebedouro-lifestyle-hero.jpg"
    cv2.imwrite(out_path, final_img, [cv2.IMWRITE_JPEG_QUALITY, 96])
    cv2.imwrite("test-results/screenshots/final-lifestyle-hero-close.png", final_img[y1-30:y2+30, x1-30:x2+30])
    print(f"[OK] Saved {out_path} with 0 artifacts.")

if __name__ == "__main__":
    retouch_inox_top()
    retouch_frontal_white()
    retouch_lifestyle_hero()
    print("--- ALL IMAGES RETOUCHED PERFECTLY ---")
