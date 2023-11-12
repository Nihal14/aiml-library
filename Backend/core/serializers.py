from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email']


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    sem_display = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = '__all__'

    def get_sem_display(self, obj):
        return dict(SEM_CHOICES)[obj.sem]


class AdminUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = AdminUser
        fields = ['id', 'user', 'fine_collected', 'book_issued']


class TagSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    class Meta:
        model = Tag
        fields ='__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
