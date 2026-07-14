from pathlib import Path

from playwright.sync_api import sync_playwright


OUTPUT = Path(r"C:\Users\sathi\Projects\_ops\reskin-previews\2026-07-14")
OUTPUT.mkdir(parents=True, exist_ok=True)


def record_failed_request(failed_requests, request):
    if "_rsc=" in request.url and request.failure == "net::ERR_ABORTED":
        return
    failed_requests.append(f"{request.method} {request.url} ({request.failure})")


def exercise(page, screenshot_name: str):
    page.set_default_navigation_timeout(90_000)
    console_errors = []
    failed_requests = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on(
        "requestfailed",
        lambda request: record_failed_request(failed_requests, request),
    )
    def fulfill_agent(route):
        payload = route.request.post_data_json
        assert payload["consent"] is True
        assert route.request.headers.get("idempotency-key")
        route.fulfill(
            status=202,
            content_type="application/json",
            body='{"route":"intake","answer":null,"sources":[],"receipt":{"code":"SA-TEST123456","deliveryStatus":"queued","message":"Your note is stored and queued for delivery."},"capabilities":{"answered":false,"intakeStored":true,"deliveryConfirmed":false}}',
        )

    page.route("**/api/agent/message", fulfill_agent)
    page.route("https://btc.sathian.ai/api/btc-price", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"price":100000}',
    ))

    page.goto("http://127.0.0.1:3120", wait_until="networkidle")
    page.get_by_role("button", name="Open chat").click()
    panel = page.locator("[data-chat-panel]")
    panel.get_by_text("Messages may be stored and forwarded to Sathian.").wait_for()
    page.get_by_placeholder("Ask a question or leave a note…").fill("Browser verification message")
    page.get_by_role("button", name="Send message").click()
    page.get_by_text("Browser verification message").wait_for()
    page.get_by_text("Receipt SA-TEST123456", exact=False).wait_for()
    page.screenshot(path=str(OUTPUT / screenshot_name), full_page=True)

    box = panel.bounding_box()
    assert box is not None
    assert box["x"] >= 0 and box["x"] + box["width"] <= page.viewport_size["width"]
    assert not console_errors, f"Console errors: {console_errors}"
    assert not failed_requests, f"Failed requests: {failed_requests}"


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
    exercise(desktop, "batch1-chat-desktop.png")
    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    exercise(mobile, "batch1-chat-mobile.png")
    browser.close()

print("chat widget browser verification passed: desktop + mobile")
