from ninja import NinjaAPI, Schema
from ninja.security import django_auth

from .camera_models import router as camera_models_router
from .cameras import router as cameras_router
from .film_stocks import router as film_stocks_router
from .rolls import router as rolls_router

api = NinjaAPI(title="rolled", version="0.1.0", docs_url="/docs", auth=django_auth)


class HealthOut(Schema):
    status: str


@api.get("/health", response=HealthOut, auth=None)
def health(request):
    return {"status": "ok"}


api.add_router("/camera-models", camera_models_router)
api.add_router("/cameras", cameras_router)
api.add_router("/film-stocks", film_stocks_router)
api.add_router("/rolls", rolls_router)
