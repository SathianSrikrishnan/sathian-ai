import os
import re
from pathlib import Path

from playwright.sync_api import sync_playwright


OUTPUT = Path(r"C:\Users\sathi\Projects\_ops\reskin-previews\2026-07-15")
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
    page.get_by_role("heading", name="A personal workshop.").wait_for()
    page.get_by_role("heading", name=re.compile("site agent", re.I)).first.wait_for()
    page.get_by_text("Building in public", exact=True).wait_for()
    page.get_by_role("heading", name="Projects with a pulse.").wait_for()
    page.get_by_role("heading", name="The systems underneath the work.").wait_for()
    page.get_by_role(
        "heading",
        name="Making a childhood memory ownable without making it public",
    ).wait_for()
    page.get_by_role("heading", name="Essays from the workbench.").wait_for()
    page.get_by_text("AI-NATIVE INFRASTRUCTURE", exact=True).first.wait_for()

    agent = page.locator("[data-chat-panel]")
    agent.wait_for()
    assert agent.count() == 1, "Homepage must show one real site-agent surface"
    page.get_by_text("By sending, you agree this message may be stored", exact=False).wait_for()
    page.get_by_role("button", name="Close chat").first.click()
    page.get_by_role("button", name="Open the site agent").click()
    agent.wait_for()

    reveal_full_page(page)
    page.screenshot(path=str(OUTPUT / screenshot_name), full_page=True)
    assert_clean_page(page, console_errors, failed_requests)


def visit_inner_page(page, path: str, heading: str, screenshot_name: str):
    console_errors = []
    failed_requests = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("requestfailed", lambda request: record_failed_request(failed_requests, request))

    response = page.goto(f"{BASE_URL}{path}", wait_until="networkidle")
    assert response is not None and response.status == 200
    page.get_by_role("heading", name=heading).wait_for()
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
    page.screenshot(path=str(OUTPUT / "site-agent-article-desktop.png"), full_page=True)
    assert_clean_page(page, console_errors, failed_requests)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
    visit_home(desktop, "site-agent-home-desktop.png")

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    visit_home(mobile, "site-agent-home-mobile.png")

    about = browser.new_page(viewport={"width": 1440, "height": 1000})
    visit_inner_page(about, "/about", "Student again, in public.", "site-agent-about-desktop.png")

    automation = browser.new_page(viewport={"width": 1440, "height": 1000})
    visit_inner_page(automation, "/automation", "Small systems for messy work.", "site-agent-automation-desktop.png")

    article = browser.new_page(viewport={"width": 1440, "height": 1000})
    visit_article(article)

    browser.close()

print("site-agent relaunch browser verification passed: Home desktop/mobile, About, Automation, and article")
