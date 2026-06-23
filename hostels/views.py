from django.shortcuts import redirect, render,get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from .models import Hostel, Room, RoomBooking
from django.contrib.auth.decorators import login_required
from django.contrib import messages


def hostel_list(request):

    hostels = Hostel.objects.all()

    hostel_data = []

    for hostel in hostels:

        total_rooms = Room.objects.filter(
            hostel=hostel
        ).count()

        available_rooms = 0

        rooms = Room.objects.filter(
            hostel=hostel
        )

        for room in rooms:

            approved_students = RoomBooking.objects.filter(
                room=room,
                status="Approved"
            ).count()

            if approved_students < room.capacity:
                available_rooms += 1

        hostel_data.append({
            "hostel": hostel,
            "total_rooms": total_rooms,
            "available_rooms": available_rooms
        })

    context = {
        "hostel_data": hostel_data
    }

    return render(
        request,
        "hostels.html",
        context
    )
    
  
    
def room_list(request, hostel_id):

    hostel = get_object_or_404(
        Hostel,
        id=hostel_id
    )

    rooms = Room.objects.filter(
        hostel=hostel
    )

    room_data = []

    for room in rooms:

        approved = RoomBooking.objects.filter(
            room=room,
            status="Approved"
        ).count()

        available_beds = room.capacity - approved

        room_data.append({

            "room": room,

            "available_beds":
            available_beds

        })

    context = {

        "hostel": hostel,

        "room_data": room_data

    }

    return render(
        request,
        "rooms.html",
        context
    )
    

@login_required
def book_room(request, room_id):

    room = get_object_or_404(
        Room,
        id=room_id
    )

    # Check if student already has a booking
    existing_booking = RoomBooking.objects.filter(
        student=request.user
    ).exclude(
        status="Rejected"
    ).first()

    if existing_booking:

        messages.warning(
            request,
            "You already have a room request."
        )

        return redirect(
            "room_list",
            hostel_id=room.hostel.id
        )

    approved = RoomBooking.objects.filter(
        room=room,
        status="Approved"
    ).count()

    available_beds = room.capacity - approved

    if available_beds <= 0:

        messages.error(
            request,
            "Room is Full."
        )

        return redirect(
            "room_list",
            hostel_id=room.hostel.id
        )

    RoomBooking.objects.create(
        student=request.user,
        room=room,
        status="Pending"
    )

    return render(
        request,
        "booking_success.html"
    )
    
    

@staff_member_required
def admin_bookings(request):

    bookings = RoomBooking.objects.select_related(
        "student",
        "room",
        "room__hostel"
    )

    return render(
        request,
        "admin_bookings.html",
        {
            "bookings": bookings
        }
    )
    
    
@staff_member_required
def approve_booking(request, booking_id):

    booking = get_object_or_404(
        RoomBooking,
        id=booking_id
    )

    approved_count = RoomBooking.objects.filter(
        room=booking.room,
        status="Approved"
    ).count()

    if approved_count < booking.room.capacity:

        booking.status = "Approved"
        booking.save()

    return redirect(
        "admin_bookings"
    )

@staff_member_required
def reject_booking(request, booking_id):

    booking = get_object_or_404(
        RoomBooking,
        id=booking_id
    )

    booking.status = "Rejected"

    booking.save()

    return redirect(
        "admin_bookings"
    )
    
@login_required
def my_room(request):

    booking = RoomBooking.objects.filter(
        student=request.user,
        status="Approved"
    ).select_related(
        "room",
        "room__hostel"
    ).first()

    return render(
        request,
        "my_room.html",
        {
            "booking": booking
        }
    )