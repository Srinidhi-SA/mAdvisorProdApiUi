import os
import getpass
from django.shortcuts import render
from django.http import HttpResponse
from subprocess import call
import subprocess
import glob
import json

from rest_framework.decorators import renderer_classes, api_view
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from api.models.dataset import Dataset, DatasetSerializer


def get_dataset(request):
    id = request.GET['dataset_id'] if request.method == "GET" else request.POST['dataset_id']
    return Dataset.objects.get(pk=id)

def get_dataset_from_data(request):
    id = request.data['dataset_id']
    return Dataset.objects.get(pk=id)

def get_dataset_from_data_from_id(id):
    return Dataset.objects.get(pk=id)


@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def create(request):

    ds = Dataset.make(request.FILES.get('input_file'), request.POST.get('userId'))
    if ds is None:
        return Response({'data': {}})

    elif ds == "ConnectionError":
        return Response({"upload_error": "ConnectionError"})

    return Response({"data": DatasetSerializer(ds).data})


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def all(request):
    userId = request.query_params.get('userId')

    ds = Dataset.objects.filter(userId=userId)

    all_dataset_info = []

    for dataset in ds:
        dataset_info = add_more_info_to_dataset(dataset)
        all_dataset_info.append(dataset_info)

    if userId is not None:
        return Response({'data': all_dataset_info})
    return Response({'data': []})


@api_view(['GET'])
@renderer_classes((JSONRenderer, ))
def preview(request):
    e = get_dataset(request)
    return Response({'data': e.get_preview_data()})


@api_view(['GET'])
@renderer_classes((JSONRenderer, ))
def get_meta(request):
    e = get_dataset(request)
    return Response(e.get_meta())

@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def edit(request):
    e = get_dataset(request)
    e.name = request.POST['name']
    e.save()
    return Response({"message": "Updated"})


@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def delete(request):
    Dataset.objects.filter(id__in=request.POST['dataset_ids'].split(",")).delete()
    return Response({"message": "Deleted"})


@api_view(['GET'])
@renderer_classes((JSONRenderer,),)
def quickinfo(request):
    ds = get_dataset(request)
    user_id = ds.userId
    dataset_quickinfo = DatasetSerializer(ds).data
    dataset_metadata = ds.get_meta_data_numnbers()
    from django.contrib.auth.models import User
    from api.views.option import get_option_for_this_user
    profile = {}
    subsetting = {}
    if user_id:
        user = User.objects.get(pk=user_id)
        profile = user.profile.rs()
        profile = {
            "username":profile['username'],
            "full_name":profile['full_name'],
            "email":profile['email']
        }
        subsetting = get_option_for_this_user(user_id)

    return Response({"message": "result",
                     "dataset_quickinfo": dataset_quickinfo,
                     "dataset_metadata": dataset_metadata,
                     "profile": profile,
                     "subsetting":subsetting
                     })

from api.models.profile import provide_token_or_email_and_password

@api_view(['GET'])
@renderer_classes((JSONRenderer,),)
@provide_token_or_email_and_password
def trick(request):
    return Response({'home':'home'})


@api_view(['POST'])
@renderer_classes((JSONRenderer,),)
def filter_sample(request):
    dimension = "cities"
    measure = "sales"
    subsetting_data = request.POST

    subsetting_data = subsetting_data.get('data')

    subsetting_data = json.loads(str(subsetting_data))
    print subsetting_data
    main_data = {}

    # ds = get_dataset(request)
    dataset_id = request.query_params.get("dataset_id")
    ds = get_dataset_from_data_from_id(dataset_id)

    CONSIDER_COLUMNS = {}
    DIMENSION_FILTER = {}
    MEASURE_FILTER = {}
    consider_columns = []
    for dict_data in subsetting_data:
        if dimension in dict_data:
            fields = dict_data['fields']
            DIMENSION_FILTER[dict_data[dimension]] = [field.keys()[1] for field in fields if field['status'] == True]
            consider_columns.append(dict_data[dimension])
            for field in fields:
                if field['status'] == True:
                    print field.keys()
        elif measure in dict_data:
            consider_columns.append(dict_data[measure])
            MEASURE_FILTER[dict_data[measure]] = {
                "min": dict_data['min'],
                "max": dict_data['max']
            }

    MEASURE_SUGGESTIONS = ds.get_measure_suggestion_from_meta_data()

    main_data['DIMENSION_FILTER'] = DIMENSION_FILTER
    main_data['MEASURE_FILTER'] = MEASURE_FILTER
    main_data['CONSIDER_COLUMNS'] = {"consider_columns": consider_columns}
    main_data['MEASURE_SUGGESTIONS'] = {"measure_suggestions": MEASURE_SUGGESTIONS}

    ds.sample_filter_subsetting(main_data['CONSIDER_COLUMNS'],
                               main_data['DIMENSION_FILTER'],
                               main_data['MEASURE_FILTER'],
                               main_data['MEASURE_SUGGESTIONS'],
                                )

    return Response({"message":"result"})

'''
----> METHODS = quickinfo
Dataset Name (40 Characters)
Created By : Senthil R
Updated on : Feb 21, 2017
File type: CSV
File size: 788KB
Measures: 4
Dimensions: 11
Index: 3
Subsets:
  Cities (San Diego, Miami, New York)
  Sales (>$ 200,000)
  Products (count>1000)
  Sales Agent (Top 10)
'''


def add_more_info_to_dataset(ds):
    user_id = ds.userId
    dataset_quickinfo = DatasetSerializer(ds).data
    dataset_metadata = ds.get_meta_data_numnbers()
    from django.contrib.auth.models import User
    from api.views.option import get_option_for_this_user

    profile = {}
    subsetting = {}

    if user_id:
        user = User.objects.get(pk=user_id)
        profile = user.profile.rs()
        profile = {
            "username": profile['username'],
            "full_name": profile['full_name'],
            "email": profile['email']
        }
        subsetting = get_option_for_this_user(user_id)

    dataset_quickinfo["dataset_metadata"] = dataset_metadata
    dataset_quickinfo["subsetting"] = subsetting
    dataset_quickinfo["profile"] = profile
    dataset_quickinfo["file_size"] = ds.get_size_of_file()

    return dataset_quickinfo


