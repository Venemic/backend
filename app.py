import json
import importlib
import threading
from queue import Queue
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from flask_cors import CORS
from trend.analyzer import TrendAnalyzer
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

# Load config
with open("config/competitors.json") as f:
    CONFIG = json.load(f)

# Thread-safe setup
job_queue = Queue()
results = {}
lock = threading.Lock()


def scrape_product_page(competitor_name, category_name, full_url, selectors):
    try:
        module_name = competitor_name.lower()
        scraper_module = importlib.import_module(f"scrapers.{module_name}")
        scraper_class = getattr(scraper_module, competitor_name)
        scraper_class.handle(competitor_name, category_name, full_url, selectors, lock, results)
    except ModuleNotFoundError:
        print(f"[{competitor_name}] Scraper module not found.")
    except AttributeError:
        print(f"[{competitor_name}] Scraper class not found in module.")
    except Exception as e:
        print(f"[{competitor_name}] Unexpected error: {e}")

def worker():
    while not job_queue.empty():
        job = job_queue.get()
        scrape_product_page(*job)
        job_queue.task_done()

@app.route("/product-list")
def get_product_list():
    competitor = request.args.get("competitor", "")
    if not competitor or competitor not in CONFIG:
        return jsonify({"error": "Invalid competitor"}), 400
    return jsonify(list(CONFIG[competitor]["products"].keys()))

@app.route("/products")
def get_products():
    competitor = request.args.get("competitor", "").strip().replace(" ", "")
    product = request.args.get("product")
    if not competitor or competitor not in CONFIG:
        return jsonify({"error": "Invalid competitor"}), 400

    base_url = CONFIG[competitor]["baseUrl"]
    selectors = CONFIG[competitor]["selector"]
    product_paths = CONFIG[competitor]["products"]

    with lock:
        results[competitor] = {}

    if product:
        if product not in product_paths:
            return jsonify({"error": "Invalid product category"}), 400
        full_url = urljoin(base_url, product_paths[product])
        job_queue.put((competitor, product, full_url, selectors))
    else:
        for category, path in product_paths.items():
            full_url = urljoin(base_url, path)
            job_queue.put((competitor, category, full_url, selectors))

    threads = []
    for _ in range(min(5, job_queue.qsize())):
        t = threading.Thread(target=worker)
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    if product:
        return jsonify(results[competitor].get(product, []))
    return jsonify(results[competitor])

@app.route('/api/trends', methods=['POST'])
def get_trend_data():
    req_data = request.get_json()

    keywords = req_data.get("keywords")
    timeframe = req_data.get("timeframe", "today 12-m")
    domain = req_data.get("domain")  # Optional domain for Similarweb traffic
    response = {}

    # Google Trends
    if keywords and isinstance(keywords, list):
        trends_result, trends_status = TrendAnalyzer.get_trends(keywords, timeframe)
        response["trends"] = trends_result
    else:
        trends_status = None

    # Similarweb Traffic
    if domain:
        traffic_result, traffic_status = TrendAnalyzer.get_website_performance(domain)
        response["traffic"] = traffic_result
    else:
        traffic_status = None

    # Determine HTTP status
    status = trends_status or traffic_status or 400
    return jsonify(response), status

if __name__ == "__main__":
    app.run(debug=True)
