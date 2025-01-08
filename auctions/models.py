from django.utils import timezone
from datetime import timedelta
from django.db import models
from PIL import Image  # For image resizing

class Auction(models.Model):
    title = models.CharField(max_length=200)
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    current_bid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    end_date = models.DateTimeField()
    auction_started = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class AuctionImage(models.Model):
    auction = models.ForeignKey(Auction, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='auction_images/')


    def __str__(self):
        return f"Image for Auction: {self.auction.title} - {self.image.name}"


    # Resize the image on save
    def save(self, *args, **kwargs):
        super(AuctionImage, self).save(*args, **kwargs)
        img = Image.open(self.image.path)

        # Resize if dimensions exceed 1125x1125
        if img.height > 1125 or img.width > 1125:
            img.thumbnail((1125, 1125))
            img.save(self.image.path, quality=70, optimize=True)

    def __str__(self):
        return f"Image for {self.auction.title}"

    def start_auction(self):
        if not self.auction_started:
            self.auction_started = True
            self.end_date = timezone.now() + timedelta(days=7)
            self.save()

    def extend_auction(self, days):
        self.end_date += timedelta(days=days)
        self.save()

    def shorten_auction(self, days):
        self.end_date -= timedelta(days=days)
        self.save()

    def time_remaining(self):
        now = timezone.now()
        if now >= self.end_date:
            return "Auction Ended"
        remaining = self.end_date - now
        return str(remaining).split('.')[0]

