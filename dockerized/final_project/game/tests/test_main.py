import random
import os
import json
import environ
import requests
from django.test import Client, TestCase
from django.test import TestCase
from rest_framework.test import APIClient
from ..models import *
from django.urls import reverse

class MainTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        #Configuration setUp Details
        self.configure_url = reverse('config')
        self.configure_objects = [
            {
                "impressions_total": 5,
                "auction_type": random.choice([1, 2]),
                "game_goal": "revenue",
                "mode": "script",                   
                "budget": 100,
                "impression_revenue": 5,
                "click_revenue": 10,
                "conversion_revenue": 30,
                "frequency_capping": 5,
                "current_total_budget" : 100
            }
        ]
        for obj in self.configure_objects:
            c = Config.objects.create(**obj)
            c.save()


        #Campaigns SetUp Details
        self.campaign_url = reverse('campaign')
        self.campaign_url_detailed = reverse('campaign_id', args=[0])
        self.campaign_objects = [
            {'name': 'campaign1', 'budget': 10, 'reserved_budget': 10, 'bid_floor' : 1, 'enabled':1},
            {'name': 'campaign2', 'budget': 20, 'reserved_budget': 20, 'bid_floor' : 2, 'enabled':1},
        ]
        for obj in self.campaign_objects:
            Campaign.objects.create(**obj)

        #Creatives SetUp Details
        self.creative_url = reverse('creatives')
        campaign = Campaign.objects.first()
        self.creative_url_detailed = reverse('creatives_id', args=[0])
        creatives = self.creative_objects = [{
            "external_id": "ext1",
            "name": "name1",
            "campaign": campaign,
            "file": "my_image_CKUp4FW.jpg",
            "url": "/media/my_image_CKUp4FW.jpg" ,
            "width" : 1,
            "height" : 1
        }, {
            "external_id": "ext2",
            "name": "name2",
            "campaign": campaign,
            "file": "my_image_CKUp4FW.jpg",
            "url" : "/media/my_image_CKUp4FW.jpg" ,
            "width" : 1,
            "height" : 1
        }]

        
        for obj in self.creative_objects:
            creative = Creative.objects.create(**obj)


        #Bid SetUp Details
        creative = Creative.objects.first()
        self.bid_url = reverse('bid')
        self.bid_objects = [{"external_id": "bid1", "click_prob" : 0.25, "conv_prob" : 0.5, "site_domain" : "www.hugs.am",
        "user_id" : "idishnk", "price" : 5, "creative" : creative, "win" : True, "revenue" : 45, "current_round" : 1},
        {"external_id": "bid2", "click_prob" : 0.25, "conv_prob" : 0.5, "site_domain" : "www.hugs.am",
        "user_id" : "idishnk", "price" : 5, "creative" : creative, "win" : False, "revenue" : 0, "current_round" : 2}
            ]
        for obj in self.bid_objects:
            creative = Bid.objects.create(**obj)

        #Notify SetUp Details
        self.notify_url = reverse('notify')
        self.notify_objects = [{"id" : "bid1", "win" : True, "price" : 5, "click" : True, "conversion" : False, "revenue" : False}
            ]
        for obj in self.notify_objects:
            Bid.objects.get(external_id=obj["id"]).win = obj['win']
            Bid.objects.get(external_id=obj["id"]).price = obj['price']
            Bid.objects.get(external_id=obj["id"]).revenue += obj['revenue']


    #Tests for Configuration
    def test_create_object_configure(self):
        data = {
        "impressions_total": 5,
        "auction_type": random.choice([1, 2]),
        "game_goal": "revenue",
        "mode": "script",
        "budget": 100,
        "impression_revenue": 5,
        "click_revenue": 10,
        "conversion_revenue": 30,
        "frequency_capping": 5
    }
        response = self.client.post(self.configure_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        obj = Config.objects.first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.impressions_total, data['impressions_total'])
        self.assertEqual(obj.auction_type, data['auction_type'])
        self.assertEqual(obj.game_goal, data['game_goal'])
        self.assertEqual(obj.mode, data['mode'])
        self.assertEqual(obj.budget, data['budget'])
        self.assertEqual(obj.impression_revenue, data['impression_revenue'])
        self.assertEqual(obj.click_revenue, data['click_revenue'])
        self.assertEqual(obj.conversion_revenue, data['conversion_revenue'])
        self.assertEqual(obj.frequency_capping, data['frequency_capping'])

    def test_list_objects_configure(self):
        response = self.client.get(self.configure_url)
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        response_json = json.dumps(response_json)
        response_json = json.loads(response_json)
        self.assertEqual(len(response_json) + 1, len(self.configure_objects[0]))
        obj = self.configure_objects[0]
        self.assertEqual(response_json['impressions_total'], obj['impressions_total'])
        self.assertEqual(response_json['auction_type'], obj['auction_type'])
        self.assertEqual(response_json['mode'], obj['mode'])
        self.assertEqual(response_json['budget'], obj['budget'])
        self.assertEqual(response_json['impression_revenue'], obj['impression_revenue'])
        self.assertEqual(response_json['click_revenue'], obj['click_revenue'])
        self.assertEqual(response_json['conversion_revenue'], obj['conversion_revenue'])
        self.assertEqual(response_json['frequency_capping'], obj['frequency_capping'])

    #Tests for Campaigns
    def test_create_object_campaign(self):
        data = {'name': 'campaign3', 'budget': 30}
        response = self.client.post(self.campaign_url, data, format='json')     
        self.assertEqual(response.status_code, 201)
        obj = Campaign.objects.filter(name=data['name']).first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.budget, data['budget'])
    
    def test_list_objects_campaign(self):
        response = self.client.get(self.campaign_url)
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        response_json = json.dumps(response_json)
        response_json = json.loads(response_json)
        self.assertEqual(len(response_json), len(self.campaign_objects))
        for i, obj in enumerate(self.campaign_objects):
            self.assertEqual(response_json[i]['name'], obj['name'])
            self.assertEqual(response_json[i]['budget'], obj['budget'])

    def test_get_object_by_id_campaign(self):
        obj = Campaign.objects.first()
        response = self.client.get(f'{self.campaign_url}{obj.id}/')
        response_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_json['name'], obj.name)
        self.assertEqual(response_json['budget'], obj.budget)

    def test_update_object_campaign(self):
        obj = Campaign.objects.all()[1]
        data = {'name': 'new name'}
        response = self.client.patch(f'{self.campaign_url}{obj.id}/', data, format='json')
        self.assertEqual(response.status_code, 200)
        obj.refresh_from_db()
        print(obj.name)
        self.assertEqual(obj.name, data['name'])

    def test_delete_object_campaign(self):
        obj = Campaign.objects.all()[1]
        response = self.client.delete(f'{self.campaign_url}{obj.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertIsNone(Campaign.objects.filter(id=obj.id).first())

    #Tests for Creatives
    def test_create_object_creative(self):
        data = {
            "external_id": "ext3",
            "name": "name3",
            "categories": [],
            "campaign": {"id": 1},
            "file": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg=="
        }
        response = self.client.post(self.creative_url, data, format='json')     
        self.assertEqual(response.status_code, 201)
        obj = Creative.objects.filter(external_id=data['external_id']).first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.name, data['name'])
        self.assertEqual(obj.campaign, Campaign.objects.get(id=data['campaign']['id']))
\

    def test_list_objects_creative(self):
        response = self.client.get(self.creative_url)
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        response_json = json.dumps(response_json)
        response_json = json.loads(response_json)
        self.assertEqual(len(response_json), len(self.creative_objects))
        for i, obj in enumerate(self.creative_objects):
            self.assertEqual(response_json[i]['name'], obj['name'])
            self.assertEqual(response_json[i]['campaign']['name'], obj['campaign'].name)
            self.assertEqual(response_json[i]['external_id'], obj['external_id'])

    def test_get_object_by_id_creative(self):
        obj = Creative.objects.first()
        response = self.client.get(f'{self.creative_url}{obj.id}/')
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_json['name'], obj.name)
        self.assertEqual(response_json['external_id'], obj.external_id)

    def test_update_object_creative(self):
        obj = Creative.objects.all()[0]
        data = {'name': 'new name', 'campaign_id' : 2, 'categories' : [],
         'file' : "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg=="}
        response = self.client.patch(f'{self.creative_url}{obj.id}/', data, format='json')
        self.assertEqual(response.status_code, 200)
        obj.refresh_from_db()
        self.assertEqual(obj.name, data['name'])
        self.assertEqual(obj.campaign.name, Campaign.objects.get(id=data['campaign_id']).name)

    def test_delete_object_creative(self):
        obj = Creative.objects.all()[1]
        response = self.client.delete(f'{self.creative_url}{obj.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertIsNone(Creative.objects.filter(id=obj.id).first())
    
    # Tests for Bid
    def test_create_object_bid(self):
        data = {          
            "id": "bid3",
            "imp": {
                "banner": {"w": 300,
                "h": 550
                }
            },
            "click": {
            "prob": "0.34"
            },
            "conv": {
            "prob": "0.11"
            },
            "site": {
                "domain": "www.example.com"
            },
            "ssp": {
                "id": "0938831esim" 
            },
            "user": {
            "id": "userik"
            },
            "bcat": [
                "IAB2-1",
                "IAB2-2"
            ] 
        }
        response = self.client.post(self.bid_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        obj = Bid.objects.all()[2]
        self.assertIsNotNone(obj)
        self.assertEqual(obj.external_id, data['id'])
        self.assertEqual(obj.user_id, data['user']['id'])
        self.assertEqual(obj.site_domain, data['site']['domain'])
        self.assertEqual(str(obj.click_prob), data['click']['prob'])
        self.assertEqual(str(obj.conv_prob), data['conv']['prob'])

    def test_list_objects_bid(self):
        response = self.client.get(self.bid_url)
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        response_json = json.dumps(response_json)
        response_json = json.loads(response_json)
        self.assertEqual(len(response_json), len(self.configure_objects) + 1)
        obj = self.bid_objects[0]
        for i, obj in enumerate(self.bid_objects):
            self.assertEqual(response_json[i]['external_id'], obj['external_id'])
            self.assertEqual(response_json[i]['click_prob'], obj['click_prob'])
            self.assertEqual(response_json[i]['conv_prob'], obj['conv_prob'])
            self.assertEqual(response_json[i]['site_domain'], obj['site_domain'])
            self.assertEqual(response_json[i]['user_id'], obj['user_id'])
            self.assertEqual(float(response_json[i]['price']), float(obj['price']))

    #Tests for Notify
    def test_create_object_notify(self):
        data = {
            "id": "bid2",
            "win":True,
            "price": 2.5,
            "click": False,
            "conversion": False,
            "revenue": 5.7
            }
        
        response = self.client.post(self.notify_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        obj = Bid.objects.all()[1]
        self.assertIsNotNone(obj)
        self.assertEqual(obj.external_id, data['id'])