import random
from django.db import models
from django.contrib.auth.models import User
SEM_CHOICES=(
    (1,'1st sem'),
    (2,'2nd sem'),
    (3,'3rd sem'),
    (4,'4th sem'),
    (5,'5th sem'),
    (6,'6th sem'),
    (7,'7th sem'),
    (8,'8th sem'),
)
def generate_unique_code():
    while True:
        code = "AI-" + str(random.randint(1000, 9999))
        if not Book.objects.filter(code=code).exists():
            return code

class Book(models.Model):
    name = models.CharField(max_length=200)
    issued = models.BooleanField(default=False)
    code = models.CharField(max_length=15, primary_key=True, unique=True, editable=False,default=generate_unique_code)
    
    def __str__(self) -> str:
        return self.name

class Tag(models.Model):
    is_active = models.BooleanField(default=True)
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    issued_by = models.ForeignKey('AdminUser', on_delete=models.CASCADE)
    book = models.ForeignKey('Book', on_delete=models.CASCADE)
    issued_on = models.DateField(auto_now=True)
    due_date = models.DateField(blank=True)
    fine=models.IntegerField(default=0)
    def __str__(self) -> str:
        return f"{self.book.name}() {str(self.due_date)}() {str(self.student)}"

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    sem = models.SmallIntegerField(choices=SEM_CHOICES,blank=True)
    
    def usn(self):
        return self.user.username

    def name(self):
        return self.user.first_name

    def __str__(self) -> str:
        return self.usn()+'()'+str(self.sem)


class AdminUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fine_collected = models.IntegerField(default=0)
    book_issued = models.IntegerField(default=0)

    def books_issued(self):
        return Tag.objects.filter(issued_by=self).filter(is_active=True).count()