from django.test import TestCase
from .models import Auction
from django.utils import timezone

class AuctionModelTest(TestCase):
    def setUp(self):
        Auction.objects.create(
            title='Test Auction', 
            description='This is a test auction.', 
            starting_bid=1000, 
            end_date=timezone.now() + timezone.timedelta(days=7)
        )

    def test_auction_creation(self):
        auction = Auction.objects.get(title='Test Auction')
        self.assertEqual(auction.title, 'Test Auction')
        self.assertEqual(auction.time_remaining(), '7 days')

    def test_time_remaining_after_auction_ends(self):
        auction = Auction.objects.get(title='Test Auction')
        auction.end_date = timezone.now() - timezone.timedelta(days=1)
        self.assertEqual(auction.time_remaining(), 'Auction Ended')



from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from .models import Auction

class AuctionViewSetTest(APITestCase):
    def setUp(self):
        Auction.objects.create(
            title='Test Auction', 
            description='This is a test auction.', 
            starting_bid=1000, 
            end_date=timezone.now() + timezone.timedelta(days=7)
        )

    def test_list_auctions(self):
        url = reverse('auction-list')  # Assuming 'auction-list' is the correct route name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('Test Auction' in str(response.data))
