1) Interfaz adaptada:
```typescript
interface CoherenceHistoryItem {
  id: string;
  propuestaLey: string;
  votoReal: string;
  resultado: string;
  estaCoherente: boolean;
  analisis: string;
}

interface CoherenceHistory {
  id: string;
  titulo: string;
  items: CoherenceHistoryItem[];
}
```

2) Objeto JSON de ejemplo:
```json
{
  "id": "hist-001",
  "titulo": "Historial de Coherencia (Promesas vs Votos)",
  "items": [
    {
      "id": "item-1",
      "propuestaLey": "Reducción de Impuestos",
      "votoReal": "A FAVOR",
      "resultado": "Coherente",
      "estaCoherente": true,
      "analisis": "Cumple promesa de campaña 2023"
    },
    {
      "id": "item-2",
      "propuestaLey": "Protección de Páramos",
      "votoReal": "ABSTENCION",
      "resultado": "Incoherente",
      "estaCoherente": false,
      "analisis": "Voto no alineado a propuesta ambiental"
    },
    {
      "id": "item-3",
      "propuestaLey": "Reforma Educativa",
      "votoReal": "A FAVOR",
      "resultado": "Coherente",
      "estaCoherente": true,
      "analisis": "Alineado con plan de gobierno"
    }
  ]
}
```