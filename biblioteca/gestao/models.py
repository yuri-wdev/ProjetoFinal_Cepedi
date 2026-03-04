from django.db import models
from django.contrib.auth.models import User


class Livro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=150)
    editora = models.CharField(max_length=150)
    ano_publicacao = models.IntegerField()
    quantidade = models.PositiveIntegerField()

    def __str__(self):
        return self.titulo



class Emprestimo(models.Model):
    STATUS_CHOICES = [
        ('A', 'Ativo'),
        ('F', 'Finalizado'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    data_emprestimo = models.DateTimeField(auto_now_add=True)
    data_devolucao = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='A')

    def __str__(self):
        return f"Emprestimo {self.id} - {self.usuario.username}"


class ItemEmprestimo(models.Model):
    emprestimo = models.ForeignKey(Emprestimo, on_delete=models.CASCADE)
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.livro.titulo} - {self.quantidade}"


class Movimentacao(models.Model):
    TIPO_CHOICES = [
        ('E', 'Entrada'),
        ('S', 'Saida'),
    ]

    livro = models.ForeignKey(Livro, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=1, choices=TIPO_CHOICES)
    quantidade = models.PositiveIntegerField()
    data = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.livro.titulo} - {self.get_tipo_display()}"