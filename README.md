# Alexia Frontend

Frontend React + TypeScript + Vite da Alexia, plataforma de assessoria jurídica com IA.

## Instalação

```bash
npm install
```

## Desenvolvimento

O Vite sobe por padrão na porta `5173`.

```bash
npm run dev
```

## Desenvolvimento com mock

Para rodar sem backend, habilite a flag de mock:

```bash
VITE_USE_MOCK=true npm run dev
```

## Build de produção

```bash
npm run build
```

## Variáveis de ambiente

- `VITE_API_BASE_URL=http://localhost:8000`
- `VITE_USE_MOCK=false`

## CORS no backend FastAPI

Em desenvolvimento, permita a origem do Vite no backend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Se aparecer erro de CORS localmente, rode o backend com:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
