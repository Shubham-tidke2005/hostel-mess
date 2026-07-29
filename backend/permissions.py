from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """
    Allows access only to admin (staff) users.
    """

    message = "Only administrators can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.is_staff
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

        # Allow GET, HEAD and OPTIONS requests
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        # Allow POST, PUT, PATCH and DELETE only for admins
        return (
            request.user.is_authenticated and
            request.user.is_staff
        )
