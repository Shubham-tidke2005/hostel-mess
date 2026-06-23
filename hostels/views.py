from django.shortcuts import render,get_object_or_404
from .models import Hostel, Room, RoomBooking


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