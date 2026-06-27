from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import HostellerForm
from .models import Hosteller


@login_required
def hosteller_dashboard(request):

    return render(
        request,
        "hostellers/dashboard.html"
    )
    

@login_required
def add_hosteller(request):

    # Only Admin can access
    if request.user.role != "admin":
        return redirect("home")

    if request.method == "POST":

        form = HostellerForm(request.POST)

        if form.is_valid():

            form.save()

            return redirect("hosteller_list")

    else:

        form = HostellerForm()

    return render(
        request,
        "hostellers/add_hosteller.html",
        {
            "form": form
        }
    )


@login_required
def hosteller_list(request):

    if request.user.role != "admin":
        return redirect("home")

    hostellers = Hosteller.objects.select_related(
        "user",
        "hostel"
    )

    return render(
        request,
        "hostellers/hosteller_list.html",
        {
            "hostellers": hostellers
        }
    )