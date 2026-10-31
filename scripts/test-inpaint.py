import cv2
import numpy as np

orig_path = r'C:\Users\David M\.gemini\antigravity\brain\6874d40b-ce0f-4e3c-8f14-a8380bef2818\.user_uploaded\media_1793152383878_ecd19a1b.webp'
orig = cv2.imread(orig_path)

# Let's inspect the region where the text is:
# We know the text is around x: 250..340, y: 530..585
x1, y1, x2, y2 = 245, 530, 340, 585
region = orig[y1:y2, x1:x2].copy()
gray_region = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)

# The text strokes are darker than the white matte body
# Let's calculate the background brightness in this region
# Background is around 220-245
# Text is around 100-180
# Let's create an adaptive or threshold mask for the letters
# Let's find background median
bg_est = cv2.medianBlur(gray_region, 15)
diff = cv2.subtract(bg_est, gray_region)
_, text_mask = cv2.threshold(diff, 15, 255, cv2.THRESH_BINARY)

# Dilate mask by 2-3 pixels to cover antialiased edges
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
dilated_mask = cv2.dilate(text_mask, kernel, iterations=1)

# Full mask for the image
full_mask = np.zeros(orig.shape[:2], dtype=np.uint8)
full_mask[y1:y2, x1:x2] = dilated_mask

# Inpaint using Telea and Navier-Stokes
inpaint_telea = cv2.inpaint(orig, full_mask, 3, cv2.INPAINT_TELEA)
inpaint_ns = cv2.inpaint(orig, full_mask, 3, cv2.INPAINT_NS)

# Save close-ups to compare
cv2.imwrite('test-results/screenshots/inpaint-telea-close.png', inpaint_telea[y1-20:y2+20, x1-20:x2+20])
cv2.imwrite('test-results/screenshots/inpaint-ns-close.png', inpaint_ns[y1-20:y2+20, x1-20:x2+20])
cv2.imwrite('test-results/screenshots/text-mask.png', full_mask[y1-20:y2+20, x1-20:x2+20])

print('Inpainting tests generated.')
