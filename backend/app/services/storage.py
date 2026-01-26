import cloudinary
import cloudinary.uploader
from app.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

def save_image_and_get_url(file):
    result = cloudinary.uploader.upload(
        file.file,
        folder="social_publisher"
    )
    return result["secure_url"]