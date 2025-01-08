from django import forms
from .models import AuctionImage
from django.forms import BaseInlineFormSet

class AuctionImageForm(forms.ModelForm):
    """Custom form for handling multiple images."""
    image = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=True)

    class Meta:
        model = AuctionImage
        fields = ['image']

class BaseAuctionImageInlineFormSet(BaseInlineFormSet):
    """Custom inline formset to process multiple image uploads."""
    def save_new(self, form, commit=True):
        # Override to handle multiple images
        images = form.files.getlist('image')
        auction = form.instance  # Get the parent auction instance
        for image in images:
            AuctionImage.objects.create(auction=auction, image=image)
