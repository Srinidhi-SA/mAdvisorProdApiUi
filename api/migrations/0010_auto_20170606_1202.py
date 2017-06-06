# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-06-06 12:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20170605_2040'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobdetail',
            name='final_status',
            field=models.CharField(default=b'not_killed', max_length=100),
        ),
        migrations.AlterField(
            model_name='jobdetail',
            name='status',
            field=models.CharField(choices=[(b'running', b'r'), (b'finished', b'f'), (b'error', b'e'), (b'killed', b'k')], max_length=100),
        ),
    ]
