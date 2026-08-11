import json
import os
import time
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("PORTAL_BASE_URL", "http://127.0.0.1:3017").rstrip("/")
OUTPUT = Path(__file__).resolve().parents[2] / "docs" / "analytics" / "site-agent-evals" / "2026-08-11-phase-2-browser"
OUTPUT.mkdir(parents=True, exist_ok=True)


def conversation(turns):
    return {"updatedAt": int(time.time() * 1000), "turns": turns}


def install_agent_fixture(page, requests):
    def fulfill_agent(route):
        payload = route.request.post_data_json
        requests.append(payload)
        assert payload["consent"] is True
        assert payload["intent"] == "question"

        if len(requests) == 1:
            assert payload.get("conversation") is None
            turns = [
                {"role": "user", "content": payload["message"]},
                {
                    "role": "assistant",
                    "content": "Tooth Fairy Network has a deployed Solana Mainnet program and verified founder-controlled deposit canaries. The public on-ramp and checkout remain gated until they are released.",
                },
            ]
            body = {
                "route": "answer",
                "answer": turns[-1]["content"],
                "sources": [
                    "https://sathian.ai/",
                    "https://toothfairy.network/",
                    "https://solscan.io/account/FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC",
                ],
                "nextAction": {"label": "Explore Tooth Fairy Network", "href": "https://toothfairy.network/"},
                "conversation": conversation(turns),
            }
        else:
            prior = payload.get("conversation")
            assert prior and len(prior["turns"]) == 2
            assert prior["turns"][0]["content"] == "Tell me about Tooth Fairy Network"
            turns = prior["turns"] + [
                {"role": "user", "content": payload["message"]},
                {
                    "role": "assistant",
                    "content": "Solana is the public network underneath the deposit program. Tooth Fairy Network is the consumer product built on top of it for protected children's savings.",
                },
            ]
            body = {
                "route": "answer",
                "answer": turns[-1]["content"],
                "sources": ["https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/"],
                "nextAction": {
                    "label": "Open the Solana guide",
                    "href": "https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/",
                },
                "conversation": conversation(turns),
            }

        route.fulfill(status=200, content_type="application/json", body=json.dumps(body))

    page.route("**/api/agent/message", fulfill_agent)


def open_agent(page):
    page.goto(BASE_URL, wait_until="networkidle")
    panel = page.locator("[data-chat-panel]")
    if not panel.is_visible():
        page.get_by_role("button", name="Open the site agent").click()
    panel.wait_for(state="visible")
    return panel


def check_desktop(browser):
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    requests = []
    install_agent_fixture(page, requests)
    panel = open_agent(page)

    page.get_by_role("button", name="Tell me about Tooth Fairy Network").click()
    panel.get_by_text("deployed Solana Mainnet program", exact=False).wait_for()
    assert panel.locator(".site-agent-next-action").count() == 1
    assert panel.locator(".site-agent-sources").count() == 0

    composer = page.get_by_role("textbox", name="Ask a question")
    composer.fill("How is that different from Solana?")
    page.get_by_role("button", name="Send question").click()
    panel.get_by_text("public network underneath", exact=False).wait_for()
    assert len(requests) == 2
    assert panel.locator(".site-agent-next-action").count() == 2

    stored = page.evaluate("sessionStorage.getItem('sathian-agent-conversation')")
    assert stored and len(json.loads(stored)["turns"]) == 4
    page.screenshot(path=str(OUTPUT / "desktop-follow-up.png"), full_page=True)

    page.reload(wait_until="networkidle")
    page.get_by_text("How is that different from Solana?", exact=True).wait_for()
    page.get_by_role("button", name="Start a new conversation").click()
    assert page.evaluate("sessionStorage.getItem('sathian-agent-conversation')") is None
    assert page.get_by_text("How is that different from Solana?", exact=True).count() == 0

    before_note = len(requests)
    page.get_by_role("button", name="I want to leave Sathian a note").click()
    page.get_by_text("Write your note to Sathian", exact=True).wait_for()
    assert len(requests) == before_note
    page.get_by_role("button", name="Cancel").click()
    page.screenshot(path=str(OUTPUT / "desktop-reset-note-compose.png"), full_page=True)
    page.close()


def check_mobile(browser):
    page = browser.new_page(viewport={"width": 390, "height": 844})
    requests = []
    install_agent_fixture(page, requests)
    panel = open_agent(page)
    box = panel.bounding_box()
    assert box is not None
    assert box["x"] >= 0
    assert box["x"] + box["width"] <= 390
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.screenshot(path=str(OUTPUT / "mobile-initial.png"), full_page=True)
    page.close()


with sync_playwright() as playwright:
    chromium = playwright.chromium.launch(headless=True)
    check_desktop(chromium)
    check_mobile(chromium)
    chromium.close()

print("chat memory browser verification passed: context, one action per answer, reset, note compose, mobile")
