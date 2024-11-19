from django.db import models

class Motorista(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255)
    telefone = models.CharField(max_length=15)
    cpf = models.CharField(max_length=14, unique=True)

    def __str__(self):
        return self.nome


class DonoDeEstacionamento(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255)
    telefone = models.CharField(max_length=15)
    cnpj = models.CharField(max_length=18, unique=True)

    def __str__(self):
        return self.nome


class Estacionamento(models.Model):
    nome = models.CharField(max_length=255)
    endereco = models.TextField()
    capacidade = models.IntegerField()
    dono = models.ForeignKey(DonoDeEstacionamento, on_delete=models.CASCADE, related_name='estacionamentos')

    def __str__(self):
        return self.nome


class Vaga(models.Model):
    STATUS_CHOICES = [
        ('disponivel', 'Disponível'),
        ('ocupada', 'Ocupada'),
        ('reservada', 'Reservada'),
    ]

    estacionamento = models.ForeignKey(Estacionamento, on_delete=models.CASCADE, related_name='vagas')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='disponivel')
    preco_por_hora = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Vaga {self.id} - {self.estacionamento.nome}"


class Reserva(models.Model):
    motorista = models.ForeignKey(Motorista, on_delete=models.CASCADE, related_name='reservas')
    vaga = models.ForeignKey(Vaga, on_delete=models.CASCADE, related_name='reservas')
    data_reserva = models.DateField()
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Reserva {self.id} - {self.motorista.nome}"
