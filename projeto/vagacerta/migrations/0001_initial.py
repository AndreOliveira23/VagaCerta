# Generated by Django 5.1.3 on 2024-11-19 15:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DonoDeEstacionamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('senha', models.CharField(max_length=255)),
                ('telefone', models.CharField(max_length=15)),
                ('cnpj', models.CharField(max_length=18, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Motorista',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('senha', models.CharField(max_length=255)),
                ('telefone', models.CharField(max_length=15)),
                ('cpf', models.CharField(max_length=14, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Estacionamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('endereco', models.TextField()),
                ('capacidade', models.IntegerField()),
                ('dono', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='estacionamentos', to='vagacerta.donodeestacionamento')),
            ],
        ),
        migrations.CreateModel(
            name='Vaga',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('disponivel', 'Disponível'), ('ocupada', 'Ocupada'), ('reservada', 'Reservada')], default='disponivel', max_length=10)),
                ('preco_por_hora', models.DecimalField(decimal_places=2, max_digits=10)),
                ('estacionamento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vagas', to='vagacerta.estacionamento')),
            ],
        ),
        migrations.CreateModel(
            name='Reserva',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_reserva', models.DateField()),
                ('hora_inicio', models.TimeField()),
                ('hora_fim', models.TimeField()),
                ('valor_total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('motorista', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservas', to='vagacerta.motorista')),
                ('vaga', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservas', to='vagacerta.vaga')),
            ],
        ),
    ]