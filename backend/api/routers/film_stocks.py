import uuid

from django.shortcuts import get_object_or_404
from ninja import Router

from api.models import FilmStock
from api.schemas import FilmStockIn, FilmStockOut

router = Router()


@router.get("/", response=list[FilmStockOut])
def list_film_stocks(request):
    return FilmStock.objects.all()


@router.post("/", response={201: FilmStockOut})
def create_film_stock(request, payload: FilmStockIn):
    return 201, FilmStock.objects.create(**payload.model_dump())


@router.get("/{film_stock_id}", response=FilmStockOut)
def get_film_stock_model(request, film_stock_id: uuid.UUID):
    return get_object_or_404(FilmStock, id=film_stock_id)


@router.put("/{film_stock_id}", response=FilmStockOut)
def update_film_stock_model(request, film_stock_id: uuid.UUID, payload: FilmStockIn):
    film_stock = get_object_or_404(FilmStock, id=film_stock_id)
    for attr, value in payload.model_dump().items():
        setattr(film_stock, attr, value)
    film_stock.save()
    return film_stock


@router.delete("/{film_stock_id}", response={204: None})
def delete_film_stock_model(request, film_stock_id: uuid.UUID):
    get_object_or_404(FilmStock, id=film_stock_id).delete()
    return 204, None
