import pytest

from api.models import Camera, Frame, Roll


@pytest.mark.django_db
def test_add_frame_defaults_to_exposed(client, user, film_stock):
    roll = Roll.objects.create(user=user, film_stock=film_stock, expiration_date="2027-01-01")
    client.force_login(user)

    response = client.post(
        f"/api/rolls/{roll.id}/frames/", data={}, content_type="application/json"
    )

    assert response.status_code == 201
    data = response.json()
    assert data["state"] == "exposed"
    assert data["position"] == 1
    assert data["camera"] is None


@pytest.mark.django_db
def test_add_blank_frame(client, user, film_stock):
    roll = Roll.objects.create(user=user, film_stock=film_stock, expiration_date="2027-01-01")
    client.force_login(user)

    response = client.post(
        f"/api/rolls/{roll.id}/frames/", data={"state": "blank"}, content_type="application/json"
    )

    assert response.status_code == 201
    assert response.json()["state"] == "blank"


@pytest.mark.django_db
def test_add_frame_assigns_incrementing_position(client, user, film_stock):
    roll = Roll.objects.create(user=user, film_stock=film_stock, expiration_date="2027-01-01")
    client.force_login(user)

    client.post(f"/api/rolls/{roll.id}/frames/", data={}, content_type="application/json")
    response = client.post(
        f"/api/rolls/{roll.id}/frames/", data={}, content_type="application/json"
    )

    assert response.json()["position"] == 2
    assert roll.frames.count() == 2


@pytest.mark.django_db
def test_add_frame_with_camera(client, user, film_stock, camera_model):
    roll = Roll.objects.create(user=user, film_stock=film_stock, expiration_date="2027-01-01")
    camera = Camera.objects.create(user=user, camera_model=camera_model)
    client.force_login(user)

    response = client.post(
        f"/api/rolls/{roll.id}/frames/",
        data={"camera_id": str(camera.id)},
        content_type="application/json",
    )

    assert response.status_code == 201
    assert response.json()["camera"]["id"] == str(camera.id)


@pytest.mark.django_db
def test_remove_last_frame(client, user, film_stock):
    roll = Roll.objects.create(user=user, film_stock=film_stock, expiration_date="2027-01-01")
    Frame.objects.create(roll=roll, position=1, state=Frame.State.EXPOSED)
    second = Frame.objects.create(roll=roll, position=2, state=Frame.State.EXPOSED)
    client.force_login(user)

    response = client.delete(f"/api/rolls/{roll.id}/frames/last")

    assert response.status_code == 204
    assert roll.frames.count() == 1
    assert not Frame.objects.filter(id=second.id).exists()


@pytest.mark.django_db
def test_remove_last_frame_on_empty_roll(client, user, film_stock):
    roll = Roll.objects.create(user=user, film_stock=film_stock, expiration_date="2027-01-01")
    client.force_login(user)

    response = client.delete(f"/api/rolls/{roll.id}/frames/last")

    assert response.status_code == 404


@pytest.mark.django_db
def test_cannot_add_frame_to_other_users_roll(client, user, other_user, film_stock):
    roll = Roll.objects.create(user=other_user, film_stock=film_stock, expiration_date="2027-01-01")
    client.force_login(user)

    response = client.post(
        f"/api/rolls/{roll.id}/frames/", data={}, content_type="application/json"
    )

    assert response.status_code == 404


@pytest.mark.django_db
def test_cannot_remove_frame_from_other_users_roll(client, user, other_user, film_stock):
    roll = Roll.objects.create(user=other_user, film_stock=film_stock, expiration_date="2027-01-01")
    Frame.objects.create(roll=roll, position=1, state=Frame.State.EXPOSED)
    client.force_login(user)

    response = client.delete(f"/api/rolls/{roll.id}/frames/last")

    assert response.status_code == 404
