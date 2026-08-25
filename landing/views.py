
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
import json
from .models import Review


def index(request):
    return render(request, 'landing/index.html')


@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'success': False, 'error': 'JSON inválido'}, status=400)

    username = payload.get('username')
    password = payload.get('password')
    if not username or not password:
        return JsonResponse({'success': False, 'error': 'Faltan credenciales'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'success': True, 'username': user.username})
    else:
        return JsonResponse({'success': False, 'error': 'Usuario o contraseña incorrectos'}, status=401)


@csrf_exempt
def api_select_room(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'success': False, 'error': 'JSON inválido'}, status=400)

    room_type = payload.get('room_type')
    if not room_type:
        return JsonResponse({'success': False, 'error': 'Tipo de habitación requerido'}, status=400)

    # Guardar selección en la sesión
    request.session['selected_room'] = room_type
    user = request.user.username if request.user.is_authenticated else None
    return JsonResponse({'success': True, 'room_type': room_type, 'user': user})


def reserve_login(request):
    """Render a standalone reservation login page."""
    return render(request, 'landing/reserve_login.html')


@login_required
def reserve_dashboard(request):
    """Simple reservation dashboard that shows user and selected room."""
    selected = request.session.get('selected_room')
    return render(request, 'landing/reserve_dashboard.html', {
        'user': request.user,
        'selected_room': selected,
    })


@csrf_exempt
@login_required
def api_add_review(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'success': False, 'error': 'JSON inválido'}, status=400)

    text = payload.get('text')
    room_type = payload.get('room_type')
    if not text:
        return JsonResponse({'success': False, 'error': 'Texto de opinión requerido'}, status=400)

    review = Review.objects.create(
        user=request.user,
        name=request.user.username if request.user.is_authenticated else payload.get('name', 'Anon'),
        room_type=room_type or '',
        text=text,
    )
    return JsonResponse({'success': True, 'id': review.id})
