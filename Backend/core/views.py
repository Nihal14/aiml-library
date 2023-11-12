from rest_framework.views import Response, APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from datetime import timedelta
from django.utils import timezone
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.conf import settings


class StudentAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, request):
        return get_object_or_404(Student, user=request.user)


    def get(self, request):
        student = self.get_object(request)
        serializer = StudentSerializer(student)
        
        books = Tag.objects.filter(student=student)
        book_serializer = TagSerializer(books, many=True)

        data = {'user': serializer.data, 'book_issued':[boo for boo in book_serializer.data if  boo['is_active']],'book_history':[boo for boo in book_serializer.data if not boo['is_active']]}
        return Response(data)


class AdminAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
        
    def get_object(self, request):
        return get_object_or_404(AdminUser, user=request.user)

    def get_book_object(self, request):
        return Book.objects.filter(code=request.data['bid']).first()

    def get_reissue_details(self,request):
        try:
            book = self.get_book_object(request)
            if not book.issued:
                return Response({'message': 'Book was not issued', 'color': 'yellow'})

            tag = Tag.objects.filter(book=book.code, is_active=True).first()
            if tag is None:
                return Response({'message': 'No Book found', 'color': 'yellow'})

            serializer = TagSerializer(tag)
            return Response({'data': serializer.data, 'color': 'green'})

        except NotFound as e:
            return Response({'message': str(e), 'color': 'red'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e), 'color': 'red'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def issue_book(self, book, admin, student_username):
        if book.issued:
            raise ValidationError('Book Already Issued')

        student = Student.objects.get(user__username=student_username)
        
        book.issued = True
        book.save()

        admin.book_issued += 1
        admin.save()

        due_date = timezone.now() + timedelta(days=settings.DAYS)
        tag = Tag(student=student, issued_by=admin, book=book, due_date=due_date)
        tag.save()

    def reissue_book(self, book, admin, fine):
        if not book.issued:
            raise ValidationError('Book was not issued')

        tag = Tag.objects.filter(book=book, is_active=True).first()

        if not tag:
            raise NotFound('No Book found')

        tag.due_date += timedelta(days=settings.DAYS)
        tag.save()

        admin.book_issued += 1
        admin.fine_collected += fine
        admin.save()

    def return_book(self, book, admin, fine):
        if not book.issued:
            raise ValidationError('Book was not issued')

        tag = Tag.objects.filter(book=book, is_active=True).first()
        if not tag:
            raise NotFound('No Book found')

        book.issued = False
        book.save()

        tag.is_active = False
        tag.fine=fine
        tag.save()

        admin.fine_collected += fine
        admin.save()

# actual methods

    def get(self, request):
        try:
            admin = self.get_object(request)
            print(request.data)
            if request.data.get('type', '0') == '1':  # reissue details
                print('ji')
                return self.get_reissue_details(request)

            serializer = AdminUserSerializer(admin)
            books = Tag.objects.filter(issued_by=admin)
            book_serializer = TagSerializer(books, many=True)
            data = {'user': serializer.data, 'books': book_serializer.data}
            return Response(data)

        except AdminUser.DoesNotExist:
            return Response(data={'message': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e), 'color': 'red'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def post(self, request):
        try:
            book = self.get_book_object(request)
            admin = AdminUser.objects.get(user=request.user)

            if request.data['type'] == '1':  # issue book
                self.issue_book(book, admin, request.data['sid'])
                return Response({'message': 'Book Issued successfully', 'color': 'green'})

            elif request.data['type'] == '2':  # reissue book
                self.reissue_book(book, admin, int(request.data.get('fine', 0)))
                return Response({'message': 'Book reissued successfully', 'color': 'green'})

            elif request.data['type'] == '3':  # return book
                self.return_book(book, admin, int(request.data.get('fine', 0)))
                return Response({'message': 'Book returned successfully', 'color': 'green'})
            elif request.data['type'] == '0':
                return self.get_reissue_details(request)

            else:
                return Response({'message': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)

        except (NotFound, ValidationError) as e:
            return Response({'message': str(e), 'color': 'red'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e), 'color': 'red'}, status=status.HTTP_303_SEE_OTHER)
