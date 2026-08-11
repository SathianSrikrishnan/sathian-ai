import os

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError, sync_playwright


BASE_URL = os.environ.get("PORTAL_BASE_URL", "https://sathian.ai").rstrip("/")
QUESTION = "What is Sathian building now?"


def wait_for_ready(page):
    page.goto(BASE_URL, wait_until="commit", timeout=90_000)
    panel = page.locator("[data-chat-panel]")
    panel.wait_for(state="visible", timeout=90_000)
    try:
        page.wait_for_load_state("networkidle", timeout=10_000)
    except PlaywrightTimeoutError:
        pass
    return panel


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    bypass_secret = os.environ.get("VERCEL_AUTOMATION_BYPASS_SECRET")
    extra_headers = {
        "x-vercel-protection-bypass": bypass_secret,
        "x-vercel-set-bypass-cookie": "true",
    } if bypass_secret else None
    context = browser.new_context(
        viewport={"width": 1880, "height": 1050},
        extra_http_headers=extra_headers,
    )
    page = context.new_page()
    panel = wait_for_ready(page)

    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(100)
    page_scroll_before_answer = page.evaluate("window.scrollY")
    page.get_by_role("button", name=QUESTION, exact=True).click()
    page.wait_for_function(
        """() => Array.from(document.querySelectorAll('.site-agent-message--bot'))
          .slice(1)
          .some((element) => (element.textContent || '').trim().length > 20)""",
        timeout=30_000,
    )
    answer = panel.locator(".site-agent-message--bot").last
    page.wait_for_timeout(1_000)

    answer_text = answer.inner_text()
    page_scroll_after_answer = page.evaluate("window.scrollY")
    source_wall_count = panel.locator(".site-agent-sources").count()

    failures = []
    if "primary public build is Tooth Fairy Network" not in answer_text:
        failures.append(f"stale current-work answer: {answer_text}")
    if abs(page_scroll_after_answer - page_scroll_before_answer) > 1:
        failures.append(
            "answer moved the homepage viewport: "
            f"before={page_scroll_before_answer}, after={page_scroll_after_answer}"
        )
    if source_wall_count:
        failures.append(f"answer rendered the legacy source wall ({source_wall_count} block(s))")

    context.close()
    browser.close()

if failures:
    raise AssertionError("; ".join(failures))

print("site-agent release check passed: current-work answer, stable viewport, no source wall")
