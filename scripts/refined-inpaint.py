import cv2
import numpy as np

orig_path = r'C:\Users\David M\.gemini\antigravity\brain\6874d40b-ce0f-4e3c-8f14-a8380bef2818\.user_uploaded\media_1793152383878_ecd19a1b.webp'
orig = cv2.imread(orig_path)

# Let's inspect the exact region of the text "Miau Store"
# x: 250..338, y: 535..575
x1, y1, x2, y2 = 248, 532, 340, 578
roi = orig[y1:y2, x1:x2]
gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

# Threshold to isolate the letters:
# The plastic is white (values around 235-255)
# The text is gray/dark (values around 100-190)
# A clean threshold:
_, mask_letters = cv2.threshold(gray_roi, 205, 255, cv2.THRESH_BINARY_INV)

# Dilate by 3px to catch the soft anti-aliased edge of each letter
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
dilated = cv2.dilate(mask_letters, kernel, iterations=2)

full_mask = np.zeros(orig.shape[:2], dtype=np.uint8)
full_mask[y1:y2, x1:x2] = dilated

# 1. Telea Inpaint
inpainted = cv2.inpaint(orig, full_mask, 5, cv2.INPAINT_TELEA)

# 2. To ensure zero artifacts or edge discontinuity, let's apply a subtle guided/bilateral blend only in the dilated mask area
# This preserves the lighting gradient across the curved plastic bowl
smoothed = cv2.bilateralFilter(inpainted, d=7, sigmaColor=15, sigmaSpace=15)
final_result = inpainted.copy()
# Blend smoothly using feathered mask
feathered_mask = cv2.GaussianBlur(full_mask, (7, 7), 0).astype(float) / 255.0
for c in range(3):
    final_result[:, :, c] = (
        final_result[:, :, c] * (1 - feathered_mask * 0.4) +
        smoothed[:, :, c] * (feathered_mask * 0.4)
    ).astype(np.uint8)

# Check the region
cv2.imwrite('test-results/screenshots/refined-inpaint-close.png', final_result[y1-30:y2+30, x1-30:x2+30])
cv2.imwrite('test-results/screenshots/refined-inpaint-full.png', final_result)

print('Refined inpainting complete.')
