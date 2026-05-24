1) Interfaz adaptada:
```typescript
interface CoherenceMetric {
  id: string;
  nombre: string;
  porcentajeCoherencia: number;
  puntaje: number;
}
```

2) Objeto JSON de ejemplo:
```json
{
  "id": "metric-001",
  "nombre": "Métrica de Coherencia (RF-04/05)",
  "porcentajeCoherencia": 85,
  "puntaje": 8.5
}
```