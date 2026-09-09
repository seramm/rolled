import uuid

from django.shortcuts import get_object_or_404
from ninja import Router

from api.models import Frame, Roll
from api.schemas import ErrorOut, FrameIn, FrameOut

router = Router()


def _get_owned_roll(request, roll_id: uuid.UUID) -> Roll:
    return get_object_or_404(Roll, id=roll_id, user=request.user)


@router.post("/{roll_id}/frames/", response={201: FrameOut})
def add_frame(request, roll_id: uuid.UUID, payload: FrameIn):
    roll = _get_owned_roll(request, roll_id)
    last_position = (
        roll.frames.order_by("-position").values_list("position", flat=True).first() or 0
    )
    frame = Frame.objects.create(roll=roll, position=last_position + 1, **payload.model_dump())
    return 201, frame


@router.delete("/{roll_id}/frames/last", response={204: None, 404: ErrorOut})
def delete_last_frame(request, roll_id: uuid.UUID):
    roll = _get_owned_roll(request, roll_id)
    frame = roll.frames.order_by("-position").first()
    if frame is None:
        return 404, {"detail": "This roll has no frames"}
    frame.delete()
    return 204, None
