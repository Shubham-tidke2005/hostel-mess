from django.contrib import admin
from .models import User, Complaint

admin.site.register(User)
admin.site.register(Complaint)