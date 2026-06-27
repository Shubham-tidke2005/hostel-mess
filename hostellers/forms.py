from django import forms
from .models import Hosteller
from accounts.models import User


class HostellerForm(forms.ModelForm):

    user = forms.ModelChoiceField(
        queryset=User.objects.filter(role="hosteller"),
        empty_label="Select Hosteller User"
    )

    class Meta:
        model = Hosteller
        fields = [
            "user",
            "hostel",
        ]