import uuid

from django.shortcuts import get_object_or_404
from ninja import Router

from api.models import CameraModel
from api.schemas import CameraModelIn, CameraModelOut

router = Router()


@router.get("/", response=list[CameraModelOut])
def list_camera_models(request):
    return CameraModel.objects.all()


@router.post("/", response={201: CameraModelOut})
def create_camera_model(request, payload: CameraModelIn):
    return 201, CameraModel.objects.create(**payload.model_dump())


@router.get("/{camera_model_id}", response=CameraModelOut)
def get_camera_model(request, camera_model_id: uuid.UUID):
    return get_object_or_404(CameraModel, id=camera_model_id)


@router.put("/{camera_model_id}", response=CameraModelOut)
def update_camera_model(request, camera_model_id: uuid.UUID, payload: CameraModelIn):
    camera_model = get_object_or_404(CameraModel, id=camera_model_id)
    for attr, value in payload.model_dump().items():
        setattr(camera_model, attr, value)
    camera_model.save()
    return camera_model


@router.delete("/{camera_model_id}", response={204: None})
def delete_camera_model(request, camera_model_id: uuid.UUID):
    get_object_or_404(CameraModel, id=camera_model_id).delete()
    return 204, None
