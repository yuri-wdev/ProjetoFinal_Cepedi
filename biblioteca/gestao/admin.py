from django.contrib import admin
from .models import Livro, Emprestimo, ItemEmprestimo, Movimentacao

#administração dos modelos para o painel de controle do django
@admin.register(Livro)
class LivroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'quantidade')
    search_fields = ('titulo', 'autor')

#admin.register(Emprestimo)
@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = ('livro', 'tipo', 'quantidade', 'data')
    list_filter = ('tipo', 'data')

#admin.register(ItemEmprestimo)
@admin.register(Emprestimo)
class EmprestimoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'data_emprestimo')
    list_filter = ('data_emprestimo',)

#admin.register(ItemEmprestimo)
@admin.register(ItemEmprestimo)
class ItemEmprestimoAdmin(admin.ModelAdmin):
    list_display = ('emprestimo', 'livro', 'quantidade')
    list_filter = ('emprestimo', 'livro')