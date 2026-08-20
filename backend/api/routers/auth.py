from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.middleware.csrf import get_token
from ninja import Router, Schema
from ninja.security import django_auth

from api.schemas import ErrorOut, UserOut

router = Router()


class LoginIn(Schema):
    username: str
    password: str


@router.post("/login", response={200: UserOut, 401: ErrorOut}, auth=None)
def login_view(request, payload: LoginIn):
    user = authenticate(request, username=payload.username, password=payload.password)
    if user is None:
        return 401, {"detail": "Invald credentials"}
    login(request, user)
    get_token(request)
    return 200, user


@router.post("/logout", auth=django_auth)
def logout_view(request):
    logout(request)
    return HttpResponse(status=204)


@router.get("/me", response=UserOut, auth=django_auth)
def me(request):
    return request.user
