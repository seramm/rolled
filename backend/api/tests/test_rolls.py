import pytest

from api.models import Roll


@pytest.mark.django_db
def test_create_roll(client, user, film_stock):
    client.force_login(user)
    response = client.post(
        "/api/rolls/",
        data={"film_stock_id": str(film_stock.id), "expiration_date": "2027-01-01"},
        content_type="application/json",
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "stored"
    assert data["is_in_progress"] is False


@pytest.mark.django_db
def test_is_in_progress(client, user, film_stock):
    roll = Roll.objects.create(
        user=user,
        film_stock=film_stock,
        expiration_date="2027-01-01",
        frames_shot=10,
    )
    client.force_login(user)

    response = client.get(f"/api/rolls/{roll.id}")
    assert response.status_code == 200
    assert response.json()["is_in_progress"] is True


@pytest.mark.django_db
def test_list_only_own_rolls(client, user, other_user, film_stock):
    Roll.objects.create(user=user, film_stock=film_stock, expiration_date="2027-01-01")
    Roll.objects.create(user=other_user, film_stock=film_stock, expiration_date="2027-01-01")
    client.force_login(user)

    response = client.get("/api/rolls/")
    assert response.status_code == 200
    assert len(response.json()) == 1
