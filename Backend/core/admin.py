from django.contrib import admin
from .models import *


class StudentView(admin.ModelAdmin):
    list_display = ['usn', 'name']
    list_display_links = ['name']
    search_fields = ('user__username',)


class BookView(admin.ModelAdmin):
    list_display = ['name', 'code']


class AdminView(admin.ModelAdmin):
    list_display = ['name', 'fine_collected', 'books_issued', 'id']

    def name(self, obj):
        return obj.user.username


class TagAdmin(admin.ModelAdmin):
    list_display = ['id', 'is_active', 'student',
                    'issued_by', 'book', 'issued_on', 'due_date']


admin.site.register(AdminUser, AdminView)
admin.site.register(Student, StudentView)
admin.site.register(Book, BookView)
admin.site.register(Tag, TagAdmin)
