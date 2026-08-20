import uuid

from django.shortcuts import get_object_or_404
from ninja import Router

from api.models import Camera
from api.schemas import CameraIn, CameraOut

router = Router()


@router.get("/", response=list[CameraOut])
def list_cameras(request):
    return Camera.objects.filter(user=request.user)


@router.post("/", response={201: CameraOut})
def create_camera(request, payload: CameraIn):
    camera = Camera.objects.create(user=request.user, **payload.model_dump())
    return 201, camera


@router.get("/{camera_id}", response=CameraOut)
def get_camera_model(request, camera_id: uuid.UUID):
    return get_object_or_404(Camera, id=camera_id, user=request.user)


@router.put("/{camera_id}", response=CameraOut)
def update_camera_model(request, camera_id: uuid.UUID, payload: CameraIn):
    camera = get_object_or_404(Camera, id=camera_id, user=request.user)
    for attr, value in payload.model_dump().items():
        setattr(camera, attr, value)
    camera.save()
    return camera


@router.delete("/{camera_id}", response={204: None})
def delete_camera_model(request, camera_id: uuid.UUID):
    get_object_or_404(Camera, id=camera_id, user=request.user).delete()
    return 204, None
