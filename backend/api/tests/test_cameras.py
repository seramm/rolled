import pytest

from api.models import Camera


@pytest.mark.django_db
def test_create_camera(client, user, camera_model):
    client.force_login(user)
    response = client.post(
        "/api/cameras/",
        data={"camera_model_id": str(camera_model.id)},
        content_type="application/json",
    )
    assert response.status_code == 201
    assert response.json()["camera_model"]["make"] == "Pentax"


@pytest.mark.django_db
def test_list_only_own_cameras(client, user, other_user, camera_model):
    Camera.objects.create(user=user, camera_model=camera_model)
    Camera.objects.create(user=other_user, camera_model=camera_model)
    client.force_login(user)

    response = client.get("/api/cameras/")
    assert response.status_code == 200
    assert len(response.json()) == 1


@pytest.mark.django_db
def test_cannot_access_other_users_camera(client, user, other_user, camera_model):
    camera = Camera.objects.create(user=other_user, camera_model=camera_model)
    client.force_login(user)

    response = client.get(f"/api/cameras/{camera.id}")
    assert response.status_code == 404
