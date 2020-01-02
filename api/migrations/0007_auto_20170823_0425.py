# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-23 04:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20170816_1436'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='dataset',
            options={'ordering': ['-created_at', '-updated_at']},
        ),
        migrations.AlterModelOptions(
            name='insight',
            options={'ordering': ['-created_at', '-updated_at']},
        ),
        migrations.AlterModelOptions(
            name='trainer',
            options={'ordering': ['-created_at', '-updated_at']},
        ),
        migrations.RenameField(
            model_name='dataset',
            old_name='created_on',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='dataset',
            old_name='updated_on',
            new_name='updated_at',
        ),
        migrations.RenameField(
            model_name='insight',
            old_name='created_on',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='insight',
            old_name='updated_on',
            new_name='updated_at',
        ),
        migrations.RenameField(
            model_name='job',
            old_name='created_on',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='job',
            old_name='updated_on',
            new_name='updated_at',
        ),
        migrations.RenameField(
            model_name='score',
            old_name='created_on',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='score',
            old_name='updated_on',
            new_name='updated_at',
        ),
        migrations.RenameField(
            model_name='trainer',
            old_name='created_on',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='trainer',
            old_name='updated_on',
            new_name='updated_at',
        ),
        migrations.AddField(
            model_name='job',
            name='status',
            field=models.CharField(default='', max_length=100),
        ),
    ]
