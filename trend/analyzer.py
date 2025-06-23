from pytrends.request import TrendReq
import requests
import os

class TrendAnalyzer:
    SIMILARWEB_API_KEY = os.getenv("SIMILARWEB_API_KEY")  # Ensure this is set in your environment
    SIMILARWEB_BASE_URL = "https://api.similarweb.com/v1/website"

    @staticmethod
    def get_trends(keywords, timeframe='today 12-m'):
        try:
            pytrends = TrendReq()
            pytrends.build_payload(kw_list=keywords, timeframe=timeframe)
            data = pytrends.interest_over_time()
            if data.empty:
                return {"error": "No trend data found."}, 404

            data.reset_index(inplace=True)
            trend_result = {}

            for keyword in keywords:
                keyword_data = [
                    {"date": str(row['date'].date()), "value": int(row[keyword])}
                    for _, row in data.iterrows()
                ]
                if all(item["value"] == 0 for item in keyword_data):
                    trend_result[keyword] = "Insufficient search volume"
                else:
                    trend_result[keyword] = keyword_data

            return {"trends": trend_result}, 200

        except Exception as e:
            return {"error": str(e)}, 500

    @staticmethod
    def get_website_performance(domain):
        try:
            if not TrendAnalyzer.SIMILARWEB_API_KEY:
                return {"error": "Missing SimilarWeb API key."}, 403

            url = f"{TrendAnalyzer.SIMILARWEB_BASE_URL}/{domain}/total-traffic-and-engagement/overview"
            params = {
                "api_key": TrendAnalyzer.SIMILARWEB_API_KEY,
                "start_date": "2024-05",
                "end_date": "2025-04",
                "main_domain_only": "false",
                "granularity": "monthly",
                "country": "world"
            }

            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json(), 200

        except requests.exceptions.HTTPError as http_err:
            return {"error": f"HTTP error occurred: {str(http_err)}"}, 500
        except Exception as e:
            return {"error": str(e)}, 500
