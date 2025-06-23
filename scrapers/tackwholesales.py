from bs4 import BeautifulSoup
from urllib.parse import urljoin
import requests

class TackWholesales:

    @staticmethod
    def handle(competitor_name, category_name, full_url, selectors, lock, results):
        try:
            response = requests.get(full_url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "en-IN"}, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")

            # SELECT ONLY .card__content that are directly inside proper parent
            items = soup.select(".product-section-2.card.card--standard.card--media > .card__content")

            data = []

            for item in items:
                name_tag = item.select_one(selectors["name"])
                name = name_tag.get_text(strip=True) if name_tag else None
                url = urljoin(full_url, name_tag["href"]) if name_tag and name_tag.has_attr("href") else None

                new_price_tag = item.select_one(selectors.get("newPrice"))
                old_price_tag = item.select_one(selectors.get("oldPrice"))
                regular_price_tag = item.select_one(selectors.get("price"))

                new_price = new_price_tag.get_text(strip=True) if new_price_tag else (
                    regular_price_tag.get_text(strip=True) if regular_price_tag else None
                )
                old_price = old_price_tag.get_text(strip=True) if old_price_tag else None

                rating_tag = item.select_one(".rating[role='img']")
                rating = rating_tag.get("aria-label") if rating_tag else None

                review_count_tag = item.select_one(".rating-count span")
                review_count = review_count_tag.get_text(strip=True).strip("()") if review_count_tag else None

                data.append({
                    "name": name,
                    "url": url,
                    "newPrice": new_price,
                    "oldPrice": old_price,
                    "rating": rating,
                    "reviewCount": review_count
                })

            with lock:
                if competitor_name not in results:
                    results[competitor_name] = {}
                results[competitor_name][category_name] = data

        except Exception as e:
            print(f"[{competitor_name}] Error scraping {full_url}: {e}")
