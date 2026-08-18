from ninja import NinjaAPI, Schema

api = NinjaAPI(title="rolled", version="0.1.0", docs_url="/docs")

class HealthOut(Schema):
    status: str

@api.get("/health", response=HealthOut)
def health(request):
    return {"status": "ok"}
