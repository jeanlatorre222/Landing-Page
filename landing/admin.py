from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
	list_display = ('name', 'room_type', 'created_at')
	readonly_fields = ('created_at',)
