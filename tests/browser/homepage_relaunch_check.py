import os
from pathlib import Path

from playwright.sync_api import sync_playwright


OUTPUT = Path(r"C:\Users\sathi\Projects\_ops\reskin-previews\2026-07-14")
OUTPUT.mkdir(parents=True, exist_ok=True)
BASE_URL = os.environ.get('PORTAL_BASE_URL', 'http://127.0.0.1:3120').rstrip('/')


def record_failed_request(failed_requests, request):
    if "_rsc=" in request.url and request.failure == "net::ERR_ABORTED":
        return
    failed_requests.append(f"{request.method} {request.url} ({request.failure})")


def assert_clean_page(page, console_errors, failed_requests):
    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    assert overflow <= 1, f"Horizontal overflow: {overflow}px"
    assert not console_errors, f"Console errors: {console_errors}"
    assert not failed_requests, f"Failed requests: {failed_requests}"


def reveal_full_page(page):
    height = page.evaluate("document.documentElement.scrollHeight")
    viewport_height = page.viewport_size["height"]
    for y in range(0, height, max(300, viewport_height // 2)):
        page.evaluate("scrollY => window.scrollTo(0, scrollY)", y)
        page.wait_for_timeout(90)
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(500)


def visit_home(page, screenshot_name: str):
    console_errors = []
    failed_requests = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("requestfailed", lambda request: record_failed_request(failed_requests, request))

    page.goto(BASE_URL, wait_until="networkidle")
    page.get_by_role("heading", name="Proof of work, in public.").wait_for()
    page.get_by_role("heading", name="Ask my agent").wait_for()
    page.get_by_text("Building in public", exact=True).wait_for()
    page.get_by_role("heading", name="The Gap Between Weeks").wait_for()
    page.get_by_text("I build small AI systems around real work.").wait_for()

    page.get_by_role(
        "button",
        name="Ask what I’m building, learning, or available to help with.",
    ).click()
    page.get_by_text("Messages may be stored and forwarded to Sathian.").last.wait_for()
    page.get_by_role("button", name="Close chat").first.click()

    reveal_full_page(page)
    page.screenshot(path=str(OUTPUT / screenshot_name), full_page=True)
    assert_clean_page(page, console_errors, failed_requests)


def visit_article(page):
    console_errors = []
    failed_requests = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("requestfailed", lambda request: record_failed_request(failed_requests, request))

    response = page.goto(
        f"{BASE_URL}/writings/the-gap-between-weeks",
        wait_until="networkidle",
    )
    assert response is not None and response.status == 200
    page.get_by_role("heading", name="The Gap Between Weeks").wait_for()
    page.get_by_alt_text(
        "Dark cosmic Tooth Fairy Network homepage with a glowing network globe and live fairy node statistics"
    ).wait_for()
    reveal_full_page(page)
    page.screenshot(path=str(OUTPUT / "batch2-article-desktop.png"), full_page=True)
    assert_clean_page(page, console_errors, failed_requests)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
    visit_home(desktop, "batch2-home-desktop.png")

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    visit_home(mobile, "batch2-home-mobile.png")

    article = browser.new_page(viewport={"width": 1440, "height": 1000})
    visit_article(article)

    browser.close()

print("homepage relaunch browser verification passed: desktop, mobile, article")
