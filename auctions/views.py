# auctions/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Auction
from .serializers import AuctionSerializer
from django.http import JsonResponse
from django.core.files.uploadedfile import InMemoryUploadedFile
from auctions.models import AuctionImage, Auction
from django.shortcuts import render, get_object_or_404

class AuctionListView(APIView):
    def get(self, request):
        auctions = Auction.objects.all()
        serializer = AuctionSerializer(auctions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AuctionDetailView(APIView):
    def get(self, request, pk):
        try:
            auction = Auction.objects.get(pk=pk)
        except Auction.DoesNotExist:
            return Response({"error": "Auction not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AuctionSerializer(auction)
        return Response(serializer.data, status=status.HTTP_200_OK)

def bulk_image_upload(request):
    if request.method == "POST":
        auction_id = request.POST.get("auction_id")
        auction = Auction.objects.get(id=auction_id)
        uploaded_files = request.FILES.getlist("images")  # Retrieve all uploaded images

        MAX_IMAGES = 150
        MAX_SIZE_MB = 100
        MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

        if len(uploaded_files) > MAX_IMAGES:
            return JsonResponse({"error": f"You can only upload up to {MAX_IMAGES} images at a time."}, status=400)

        total_size = sum(file.size for file in uploaded_files)
        if total_size > MAX_SIZE_BYTES:
            return JsonResponse({"error": f"The total size of the uploaded images exceeds {MAX_SIZE_MB} MB."}, status=400)

        for image in uploaded_files:
            if isinstance(image, InMemoryUploadedFile):
                AuctionImage.objects.create(auction=auction, image=image)

        return JsonResponse({"message": "Images uploaded successfully."})

    return JsonResponse({"error": "Invalid request method."}, status=405)
