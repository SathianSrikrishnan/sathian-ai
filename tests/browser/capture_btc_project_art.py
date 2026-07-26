import os
from pathlib import Path

from playwright.sync_api import sync_playwright


OUTPUT = Path('public/projects/btc-cultural-atlas-hero.png')
BASE_URL = os.environ.get('PORTAL_BASE_URL', 'http://127.0.0.1:3120').rstrip('/')


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 430, "height": 844}, device_scale_factor=1)
    page.goto(f'{BASE_URL}/btc-atlas', wait_until='networkidle')
    marker = page.get_by_text('404', exact=True).last
    marker.scroll_into_view_if_needed()
    page.wait_for_timeout(800)
    marker.locator('xpath=ancestor::div[contains(@class, "overflow-hidden")]').screenshot(
        path=str(OUTPUT),
        animations='disabled',
    )
    browser.close()

print(f'captured {OUTPUT}')
