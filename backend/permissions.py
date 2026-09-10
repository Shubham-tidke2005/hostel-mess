from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """
    Allows access only to admin/staff users.
    """

    message = "Only administrators can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_staff
        )


class IsStudentOrAdmin(BasePermission):
    """
    Allows access to any authenticated user.
    """

    message = "Authentication required."

    def has_permission(self, request, view):
        return request.user.is_authenticated


class IsAdminOrReadOnly(BasePermission):
    """
    Authenticated users can view data.
    Only administrators can create, update or delete data.
    """

    message = "Only administrators can modify this resource."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # GET, HEAD, OPTIONS
        if request.method in SAFE_METHODS:
            return True

        # POST, PUT, PATCH, DELETE
        return request.user.is_staff


class IsAdminOrOwnStudent(BasePermission):
    """
    Admin:
        Full access to all student records.

    Student:
        Can view and update only their own student record.
        Cannot create or delete students.
    """

    message = "You do not have permission to access this student."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Admin has full access
        if request.user.is_staff:
            return True

        # Students cannot create student records
        if request.method == "POST":
            return False

        # Students cannot delete student records
        if request.method == "DELETE":
            return False

        # Students can GET / PUT / PATCH
        return True

    def has_object_permission(self, request, view, obj):
        # Admin can access any student
        if request.user.is_staff:
            return True

        # Student can access only their own record
        return obj.user == request.user


class IsBookingOwnerOrAdmin(BasePermission):
    """
    Admin:
        Can access all bookings.

    Student:
        Can access only their own bookings.
    """

    message = "You do not have permission to access this booking."

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin can access any booking
        if request.user.is_staff:
            return True

        # Student can access only their own booking
        return obj.student.user == request.user