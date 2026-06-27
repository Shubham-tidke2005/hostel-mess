from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from .forms import RegisterForm
from .models import User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from hostels.models import Room, RoomBooking
from mess.models import Menu
from accounts.models import Complaint
from datetime import date


@login_required
def admin_dashboard(request):

    return render(
        request,
        "admin_dashboard.html"
    )
    
def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(
                form.cleaned_data["password"]
            )
            # Student role fixed
            user.role = "student"
            user.save()
            messages.success(
                request,
                "Registration Successful"
            )
            return redirect("login")
    else:
        form = RegisterForm()

    return render(
        request,
        "register.html",
        {"form": form}
    )

def login_view(request):

    if request.user.is_authenticated:

        if request.user.role == "student":
            return redirect("dashboard")

        return redirect("admin:index")

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user:

            login(request, user)

            if user.role == "student":
                return redirect("dashboard")

            elif user.role == "hosteller":
                return redirect("hosteller_dashboard")

            elif user.role == "admin":
                return redirect("admin_dashboard")

        else:

            messages.error(
                request,
                "Invalid Username or Password"
            )

    return render(
        request,
        "login.html"
    )
    

def logout_view(request):
    logout(request)
    return redirect("login")

@login_required
def dashboard_view(request):
    user = request.user

    # My Room
    my_room = RoomBooking.objects.filter(
        student=user,
        status="Approved"
    ).first()

    # Available Rooms
    available_rooms = Room.objects.all().count()

    # Today's Menu
    today_menu = Menu.objects.filter(
        date=date.today()
    ).first()

    # My Complaints
    complaints = Complaint.objects.filter(
        student=user
    )
    my_booking = RoomBooking.objects.filter(
        student=request.user
    ).order_by("-id").first()

    context = {
        "my_room": my_room,
        "available_rooms": available_rooms,
        "today_menu": today_menu,
        "complaints": complaints,
        "my_booking": my_booking,
    }

    return render(
        request,
        "dashboard.html",
        context
    )