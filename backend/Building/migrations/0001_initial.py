# Generated by Django 5.1.7 on 2025-06-03 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Building",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("building_size", models.CharField(default="N/A", max_length=50)),
                ("street", models.CharField(max_length=255)),
                ("city", models.CharField(max_length=100)),
                ("state", models.CharField(blank=True, max_length=100, null=True)),
                ("country", models.CharField(max_length=100)),
                ("postal_code", models.CharField(max_length=20)),
                (
                    "building_img",
                    models.ImageField(blank=True, null=True, upload_to="building"),
                ),
                ("description", models.TextField(blank=True, null=True)),
                ("external_id", models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name="Organization",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("street", models.CharField(max_length=255)),
                ("city", models.CharField(max_length=100)),
                ("state", models.CharField(blank=True, max_length=100, null=True)),
                ("country", models.CharField(max_length=100)),
                ("postal_code", models.CharField(max_length=20)),
                ("email", models.EmailField(blank=True, max_length=254, null=True)),
                ("website", models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="Room",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("room_size", models.CharField(default="N/A", max_length=50)),
                ("floor", models.IntegerField(blank=True, null=True)),
                ("description", models.TextField(blank=True, null=True)),
                ("external_id", models.CharField(max_length=255, unique=True)),
            ],
        ),
    ]
