# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-06-05 18:12
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0007_auto_20170523_0945'),
    ]

    operations = [
        migrations.CreateModel(
            name='Jobdetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.CharField(max_length=100)),
                ('code', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=100)),
                ('job_type', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[(b'running', b'r'), (b'finished', b'f'), (b'error', b'e')], max_length=100)),
                ('submitted_on', models.DateTimeField(auto_now_add=True)),
                ('note', models.TextField(default=b'{}')),
                ('killed_on', models.DateTimeField(null=True)),
                ('input_details', models.TextField(default=b'{}')),
                ('killed_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('resubmit_parent_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.Jobdetail')),
                ('submitted_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
