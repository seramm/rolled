from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Camera, CameraModel, FilmStock, Roll, User

admin.site.register(User, UserAdmin)
admin.site.register(CameraModel)
admin.site.register(Camera)
admin.site.register(FilmStock)
admin.site.register(Roll)
