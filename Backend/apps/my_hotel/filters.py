import django_filters as filters
from django.db.models import Q
from .models import Customer, Hall, Booking, ActivityLog


class CustomerFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = Customer
        fields = ['created_at']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name_en__icontains=value) |
            Q(name_ar__icontains=value) |
            Q(mobile__icontains=value) |
            Q(email__icontains=value)
        )


class HallFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    occupied = filters.BooleanFilter(field_name='occupied')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = Hall
        fields = ['occupied', 'created_at']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name_en__icontains=value) |
            Q(name_ar__icontains=value) |
            Q(code_name__icontains=value) |
            Q(badge__icontains=value)
        )


class BookingFilter(filters.FilterSet):
    search    = filters.CharFilter(method='filter_search')
    status    = filters.CharFilter(field_name='status',    lookup_expr='iexact')
    time_slot = filters.CharFilter(field_name='time_slot', lookup_expr='iexact')  # ← NEW
    hall      = filters.NumberFilter(field_name='hall_id')
    customer  = filters.NumberFilter(field_name='customer_id')
    date_to   = filters.DateFilter(field_name='date', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='date', lookup_expr='gte')

    class Meta:
        model  = Booking
        fields = ['status', 'time_slot', 'hall', 'customer', 'date']  # ← NEW

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(booking_code__icontains=value)     |
            Q(event_type_en__icontains=value)    |
            Q(event_type_ar__icontains=value)    |
            Q(hall__name_en__icontains=value)    |
            Q(customer__name_en__icontains=value)
        )

class ActivityLogFilter(filters.FilterSet):
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = ActivityLog
        fields = ['created_at']