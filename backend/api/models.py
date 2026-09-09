import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.username


class CameraModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    format = models.CharField(max_length=255)
    has_prewind = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.make} {self.model}"


class Camera(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="cameras")
    camera_model = models.ForeignKey(CameraModel, on_delete=models.PROTECT, related_name="cameras")

    def __str__(self):
        return f"{self.camera_model}"


class FilmStock(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    brand = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    iso = models.PositiveSmallIntegerField()
    format = models.CharField(max_length=255)
    color_type = models.CharField(max_length=255)
    frames = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.brand} {self.name} ISO{self.iso}"


class Roll(models.Model):
    class Status(models.TextChoices):
        STORED = "stored", "Stored"
        LOADED = "loaded", "Loaded"
        STARTED = "started", "Started"
        FINISHED = "finished", "Finished"
        DEVELOPED = "developed", "Developed"
        SCANNED = "scanned", "Scanned"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="rolls")
    film_stock = models.ForeignKey(FilmStock, on_delete=models.PROTECT, related_name="rolls")
    camera = models.ForeignKey(
        Camera, on_delete=models.SET_NULL, null=True, blank=True, related_name="rolls"
    )
    status = models.CharField(max_length=255, choices=Status.choices, default=Status.STORED)
    shot_iso = models.PositiveSmallIntegerField(null=True, blank=True)
    expiration_date = models.DateField()
    date_bought = models.DateField(null=True, blank=True)
    date_started = models.DateField(null=True, blank=True)
    date_loaded = models.DateField(null=True, blank=True)
    date_finished = models.DateField(null=True, blank=True)
    date_developed = models.DateField(null=True, blank=True)
    date_scanned = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.film_stock} ({self.status} - {self.frames.count()})"

    @property
    def is_in_progress(self):
        return 0 < self.frames.count() < self.film_stock.frames


class Frame(models.Model):
    class State(models.TextChoices):
        EXPOSED = (
            "exposed",
            "Exposed",
        )
        BLANK = (
            "blank",
            "Blank",
        )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    roll = models.ForeignKey(Roll, on_delete=models.CASCADE, related_name="frames")
    camera = models.ForeignKey(
        Camera, on_delete=models.SET_NULL, related_name="frames", null=True, blank=True
    )
    position = models.PositiveSmallIntegerField()
    state = models.CharField(max_length=255, choices=State.choices, default="exposed")

    class Meta:
        ordering = ["position"]
        constraints = [
            models.UniqueConstraint(
                fields=["roll", "position"], name="unique_frame_position_per_roll"
            )
        ]

    def __str__(self):
        return f"{self.roll} #{self.position} ({self.state})"
