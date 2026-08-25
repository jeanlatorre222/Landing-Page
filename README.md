# Proyecto Django: Hotel Genérico

Instrucciones para ejecutar el proyecto localmente.

1. Crear y activar un entorno virtual:

```bash
python -m venv venv
venv\Scripts\activate
```

2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Migrar y ejecutar el servidor:

```bash
python manage.py migrate
python manage.py runserver
```

La landing estará disponible en http://127.0.0.1:8000/
