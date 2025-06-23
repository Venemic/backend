from bs4 import BeautifulSoup
from urllib.parse import urljoin
import requests

class BridleandReins:

    @staticmethod
    def handle(competitor_name, category_name, full_url, selectors, lock, results):
        try:
            response = requests.get(full_url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "en-IN"}, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            items = soup.select(selectors["productWrapper"])
            data = []

            for item in items:
                name = item.select_one(selectors.get("name"))
                url = item.select_one(selectors.get("url"))
                old_price = item.select_one(selectors.get("oldPrice"))
                new_price = item.select_one(selectors.get("newPrice"))
                price_container = item.select_one(selectors.get("price"))
                reviews = item.select_one(selectors.get("reviews"))

                if not new_price and not old_price and price_container:
                    new_price_text = price_container.get_text(separator=" ", strip=True)
                else:
                    new_price_text = new_price.text.strip() if new_price else None

                old_price_text = old_price.text.strip() if old_price else None

                data.append({
                    "name": name.text.strip() if name else None,
                    "url": urljoin(full_url, url["href"]) if url and url.has_attr("href") else None,
                    "oldPrice": old_price_text,
                    "newPrice": new_price_text,
                    "reviews": reviews.text.strip() if reviews else None
                })

            with lock:
                if competitor_name not in results:
                    results[competitor_name] = {}
                results[competitor_name][category_name] = data

        except Exception as e:
            print(f"[{competitor_name}] Error scraping {full_url}: {e}")
