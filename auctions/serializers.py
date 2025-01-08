from rest_framework import serializers
from .models import Auction
from datetime import datetime
from django.utils.timezone import now

class AuctionSerializer(serializers.ModelSerializer):
    time_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Auction
        fields = ['id', 'title', 'starting_bid', 'current_bid', 'end_date', 'auction_started', 'time_remaining']

    def get_time_remaining(self, obj):
        """Calculate and return the remaining time."""
        remaining_time = obj.end_date - now()
        if remaining_time.total_seconds() > 0:
            return str(remaining_time)
        return "Auction Ended"