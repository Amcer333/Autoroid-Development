from django import forms
from django.contrib import admin
from django.shortcuts import render, redirect
from django.urls import path
from django.template.response import TemplateResponse
from django.core.exceptions import ValidationError
from django.utils.html import format_html
from .models import Auction, AuctionImage
from PIL import Image

# Inline admin for AuctionImage
class AuctionImageInline(admin.TabularInline):
    model = AuctionImage
    extra = 1  # Number of blank forms for new images
    fields = ['image', 'preview']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
        return "No Image"

    class Media:
        js = ('custom_js/admin_multiupload.js',)  # Include the custom JavaScript for multi-upload

# Admin for Auction with AuctionImage inline
@admin.register(Auction)
class AuctionAdmin(admin.ModelAdmin):
    list_display = ('title', 'starting_bid', 'current_bid', 'end_date', 'auction_started')
    inlines = [AuctionImageInline]
    actions = ['bulk_upload_images']

    def bulk_upload_images(self, request, queryset):
        """
        Custom admin action for bulk uploading images to selected auctions.
        Validates the number of files, their total size, and resizes them if needed.
        """
        MAX_IMAGES = 150
        MAX_TOTAL_SIZE_MB = 100
        MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024

        if 'apply' in request.POST:
            # Handle uploaded files manually
            files = request.FILES.getlist('images')

            # Validate file count
            if not files:
                self.message_user(request, "No images were selected for upload.", level='error')
                return redirect(request.get_full_path())

            if len(files) > MAX_IMAGES:
                self.message_user(request, f"You can upload up to {MAX_IMAGES} images at once.", level='error')
                return redirect(request.get_full_path())

            # Validate total file size
            total_size = sum(file.size for file in files)
            if total_size > MAX_TOTAL_SIZE_BYTES:
                self.message_user(request, f"Total image size cannot exceed {MAX_TOTAL_SIZE_MB} MB.", level='error')
                return redirect(request.get_full_path())

            # Process each file and associate it with the selected auctions
            for auction in queryset:
                for file in files:
                    # Save and resize images during creation
                    auction_image = AuctionImage(auction=auction, image=file)
                    auction_image.save()

            self.message_user(
                request, f"Successfully uploaded {len(files)} images to {len(queryset)} auctions."
            )
            return redirect(request.get_full_path())

        # Render the bulk upload template
        context = {
            'auctions': queryset,
        }
        return TemplateResponse(request, 'admin/bulk_image_upload.html', context)

    bulk_upload_images.short_description = "Bulk upload images to selected auctions"

    def get_urls(self):
        """
        Override to add a custom URL for bulk image upload.
        """
        urls = super().get_urls()
        custom_urls = [
            path('bulk_upload/', self.bulk_upload_images, name='bulk_upload_images'),
        ]
        return custom_urls + urls
