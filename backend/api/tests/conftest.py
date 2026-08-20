import pytest

from api.models import CameraModel, FilmStock


@pytest.fixture
def user(django_user_model):
    return django_user_model.objects.create_user(username="alice", password="1234")  # noqa: S106


@pytest.fixture
def other_user(django_user_model):
    return django_user_model.objects.create_user(username="bob", password="1234")  # noqa: S106


@pytest.fixture
def camera_model():
    return CameraModel.objects.create(make="Pentax", model="MX", format="35mm")


@pytest.fixture
def film_stock():
    return FilmStock.objects.create(
        brand="Kodak",
        name="Portra 400",
        iso=400,
        format="35mm",
        color_type="color negative",
        frames=36,
    )
