import pytest


@pytest.mark.django_db
def test_list_requires_auth(client):
    response = client.get("/api/camera-models/")
    assert response.status_code == 401


@pytest.mark.django_db
def test_create_and_list(client, user, camera_model):
    client.force_login(user)

    response = client.get("/api/camera-models/")
    assert response.status_code == 200
    assert len(response.json()) == 1

    response = client.post(
        "/api/camera-models/",
        data={"make": "Pentax", "model": "6x7", "format": "120mm"},
        content_type="application/json",
    )
    assert response.status_code == 201
    assert response.json()["make"] == "Pentax"


@pytest.mark.django_db
def test_get_update_delete(client, user, camera_model):
    client.force_login(user)
    url = f"/api/camera-models/{camera_model.id}"

    response = client.get(url)
    assert response.status_code == 200
    assert response.json()["model"] == "MX"

    response = client.put(
        url,
        data={"make": "Pentax", "model": "K1000", "format": "35mm"},
        content_type="application/json",
    )
    assert response.status_code == 200
    assert response.json()["model"] == "K1000"

    response = client.delete(url)
    assert response.status_code == 204

    response = client.get(url)
    assert response.status_code == 404
