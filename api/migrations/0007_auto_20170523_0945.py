# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-05-23 09:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20170523_0914'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='app_id',
            field=models.CharField(default=b'0', max_length=10),
        ),
        migrations.AlterField(
            model_name='trainer',
            name='app_id',
            field=models.CharField(default=b'0', max_length=10),
        ),
    ]
