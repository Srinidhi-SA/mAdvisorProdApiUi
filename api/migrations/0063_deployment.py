# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2019-03-11 09:31
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0062_auto_20190308_1005'),
    ]

    operations = [
        migrations.CreateModel(
            name='Deployment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=300, null=True)),
                ('slug', models.SlugField(blank=True, max_length=300)),
                ('config', models.TextField(default='{}')),
                ('data', models.TextField(default='{}')),
                ('status', models.CharField(db_index=True, default='NOT STARTED', max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('deleted', models.BooleanField(db_index=True, default=False)),
                ('bookmarked', models.BooleanField(default=False)),
                ('viewed', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('deployment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Trainer')),
            ],
            options={
                'ordering': ['-created_at', '-updated_at'],
            },
        ),
    ]
