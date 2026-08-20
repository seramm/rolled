import uuid
from datetime import date

from ninja import ModelSchema, Schema

from .models import Camera, CameraModel, FilmStock, Roll


class CameraModelOut(ModelSchema):
    class Meta:
        model = CameraModel
        fields = ["id", "make", "model", "format"]


class CameraModelIn(ModelSchema):
    class Meta:
        model = CameraModel
        fields = ["make", "model", "format"]


class CameraOut(ModelSchema):
    camera_model: CameraModelOut

    class Meta:
        model = Camera
        fields = ["id"]


class CameraIn(Schema):
    camera_model_id: uuid.UUID


class FilmStockOut(ModelSchema):
    class Meta:
        model = FilmStock
        fields = ["id", "brand", "name", "iso", "format", "color_type", "frames"]


class FilmStockIn(ModelSchema):
    class Meta:
        model = FilmStock
        fields = ["brand", "name", "iso", "format", "color_type", "frames"]


class RollOut(ModelSchema):
    film_stock: FilmStockOut
    camera: CameraOut | None
    is_in_progress: bool

    class Meta:
        model = Roll
        fields = [
            "id",
            "status",
            "frames_shot",
            "expiration_date",
            "date_bought",
            "date_started",
            "date_loaded",
            "date_finished",
            "date_developed",
            "date_scanned",
            "notes",
        ]


class RollIn(Schema):
    film_stock_id: uuid.UUID
    camera_id: uuid.UUID | None = None
    status: Roll.Status = Roll.Status.STORED
    frames_shot: int = 0
    expiration_date: date
    date_bought: date | None = None
    date_started: date | None = None
    date_loaded: date | None = None
    date_finished: date | None = None
    date_developed: date | None = None
    date_scanned: date | None = None
    notes: str = ""
