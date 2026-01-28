# Configuración de API para Datos en Vivo

Para obtener los resultados en vivo de la Champions League, necesitas una API key gratuita.

## Opción 1: Football-Data.org (Recomendada)

### Paso 1: Registro
1. Ve a: https://www.football-data.org/client/register
2. Crea una cuenta gratuita
3. Recibirás un email con tu API key

### Paso 2: Configuración
1. Abre el archivo `src/components/ChampionsLeague.jsx`
2. Encuentra la línea 18:
   ```javascript
   'X-Auth-Token': 'YOUR_API_KEY_HERE'
   ```
3. Reemplaza `YOUR_API_KEY_HERE` con tu API key real

### Limitaciones del Plan Gratuito
- 10 peticiones por minuto
- Perfectamente suficiente para esta aplicación

---

## Opción 2: API-Football (RapidAPI)

### Paso 1: Registro
1. Ve a: https://rapidapi.com/api-sports/api/api-football
2. Crea una cuenta y suscríbete al plan gratuito
3. Obtén tu API key de RapidAPI

### Paso 2: Modificar el código
Reemplaza la función `fetchStandings` en `ChampionsLeague.jsx`:

```javascript
const fetchStandings = async () => {
  try {
    setLoading(true);
    
    const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/standings?season=2024&league=2', {
      headers: {
        'X-RapidAPI-Key': 'TU_API_KEY_AQUI',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    const data = await response.json();
    const processedStandings = data.response[0].league.standings[0].map((team, index) => ({
      pos: index + 1,
      team: team.team.name,
      played: team.all.played,
      won: team.all.win,
      drawn: team.all.draw,
      lost: team.all.lose,
      gf: team.all.goals.for,
      ga: team.all.goals.against,
      gd: team.goalsDiff,
      points: team.points
    }));

    setStandings(processedStandings);
    setLastUpdate(new Date());
    setError(null);
  } catch (err) {
    // ... resto del código
  }
};
```

### Limitaciones del Plan Gratuito
- 100 peticiones por día
- Más que suficiente para uso personal

---

## Verificar que funciona

1. Después de configurar tu API key, guarda el archivo
2. La aplicación se recargará automáticamente
3. Deberías ver "🔴 EN VIVO" y la última actualización
4. Los datos se actualizarán cada 5 minutos automáticamente

## Solución de Problemas

### Error CORS
Si ves errores de CORS en la consola del navegador, algunas soluciones:

1. **Usar un proxy**: Agrega un proxy en `vite.config.js`:
   ```javascript
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: 'https://api.football-data.org',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, '')
         }
       }
     }
   })
   ```

2. **Extensión de navegador**: Instala "CORS Unblock" (solo para desarrollo)

### No se muestran datos
- Verifica que tu API key sea correcta
- Revisa la consola del navegador para ver errores
- Asegúrate de tener conexión a internet
- Verifica que no hayas excedido el límite de peticiones

## Alternativas Gratuitas

- **TheSportsDB**: https://www.thesportsdb.com/api.php
- **SportMonks**: https://www.sportmonks.com/
- **OpenLigaDB**: https://www.openligadb.de/ (solo ligas alemanas)

---

## Datos de Respaldo

Si prefieres no usar una API, la aplicación mostrará datos de ejemplo estáticos. Son datos reales de la temporada 2024-25 pero no se actualizarán automáticamente.
