import uuid

from django.shortcuts import get_object_or_404
from ninja import Router

from api.models import Roll
from api.schemas import RollIn, RollOut

router = Router()


@router.get("/", response=list[RollOut])
def list_rolls(request):
    return Roll.objects.filter(user=request.user)


@router.post("/", response={201: RollOut})
def create_roll(request, payload: RollIn):
    roll = Roll.objects.create(user=request.user, **payload.model_dump())
    return 201, roll


@router.get("/{roll_id}", response=RollOut)
def get_roll_model(request, roll_id: uuid.UUID):
    return get_object_or_404(Roll, id=roll_id, user=request.user)


@router.put("/{roll_id}", response=RollOut)
def update_roll_model(request, roll_id: uuid.UUID, payload: RollIn):
    roll = get_object_or_404(Roll, id=roll_id, user=request.user)
    for attr, value in payload.model_dump().items():
        setattr(roll, attr, value)
    roll.save()
    return roll


@router.delete("/{roll_id}", response={204: None})
def delete_roll_model(request, roll_id: uuid.UUID):
    get_object_or_404(Roll, id=roll_id, user=request.user).delete()
    return 204, None
