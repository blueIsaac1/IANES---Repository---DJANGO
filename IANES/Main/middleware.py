from django.shortcuts import render

class CustomErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Captura erros 404
        if response.status_code == 404 :
            return render(request, 'errors_template.html', {"error_message": "404 Url não encontrada / 404 Not found", "error_description": "A Url providenciada não está cadastrada no urls.py." }, status=404)

        # Captura erros 500
        if response.status_code == 500:
            return render(request, 'errors_template.html', {"error_message": "500 Erro Interno de Servidor / 500 Internal Server Error",  "error_description": "Ocorreu um erro interno no servidor. Estamos trabalhando para solucionar esse erro."}, status=500)

        return response