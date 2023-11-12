# Generated by Django 4.2.6 on 2023-11-09 13:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_book_issued'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.book'),
        ),
        migrations.AlterField(
            model_name='tag',
            name='issued_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.adminuser'),
        ),
        migrations.AlterField(
            model_name='tag',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.student'),
        ),
    ]
