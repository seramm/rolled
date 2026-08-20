import pytest


@pytest.mark.django_db
def test_create_and_list(client, user):
    client.force_login(user)
    response = client.post(
        "/api/film-stocks/",
        data={
            "brand": "Kodak",
            "name": "Portra 400",
            "iso": 400,
            "format": "35mm",
            "color_type": "color negative",
            "frames": 36,
        },
        content_type="application/json",
    )
    assert response.status_code == 201
    assert response.json()["frames"] == 36

    response = client.get("/api/film-stocks/")
    assert response.status_code == 200
    assert len(response.json()) == 1
