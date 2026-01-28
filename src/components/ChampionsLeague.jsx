import { useState, useEffect } from 'react';
import './ChampionsLeague.css';
import championsLogo from '../assets/uefa-champions-league-1.svg';

const ChampionsLeague = () => {
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeTab, setActiveTab] = useState('standings'); // 'standings' o 'matches'

  useEffect(() => {
    fetchData();
    // Actualizar cada 30 segundos cuando hay partidos, para mantener clasificación y marcadores actualizados
    const interval = setInterval(() => {
      console.log('🔄 Actualización automática:', new Date().toLocaleTimeString());
      fetchData();
    }, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchStandings(), fetchMatches()]);
  };

  const fetchMatches = async () => {
    try {
      // En desarrollo usa el proxy de Vite, en producción usa Netlify Functions
      const isDev = import.meta.env.DEV;
      const url = isDev 
        ? '/api/v4/competitions/CL/matches?status=LIVE,SCHEDULED'
        : '/.netlify/functions/matches?status=LIVE,SCHEDULED';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const liveMatches = data.matches || [];
        console.log('⚽ Partidos:', liveMatches.length, 'total,', 
                    liveMatches.filter(m => m.status === 'IN_PLAY').length, 'en vivo');
        setMatches(liveMatches);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  const fetchStandings = async () => {
    try {
      setLoading(true);
      
      // En desarrollo usa el proxy de Vite, en producción usa Netlify Functions
      const isDev = import.meta.env.DEV;
      const url = isDev 
        ? '/api/v4/competitions/CL/standings'
        : '/.netlify/functions/standings';
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      const data = await response.json();
      
      console.log('API Response:', data); // Debug
      
      // Procesar datos de la API
      const processedStandings = data.standings[0].table.map((team, index) => ({
        pos: index + 1,
        team: team.team.name,
        crest: team.team.crest,
        played: team.playedGames,
        won: team.won,
        drawn: team.draw,
        lost: team.lost,
        gf: team.goalsFor,
        ga: team.goalsAgainst,
        gd: team.goalDifference,
        points: team.points
      }));

      console.log('✅ Clasificación actualizada:', processedStandings.length, 'equipos'); // Debug
      
      setStandings(processedStandings);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching standings:', err);
      setError('No se pudo conectar con la API. Mostrando datos de ejemplo.');
      
      // Datos de respaldo en caso de error
      setStandings([
        { pos: 1, team: 'Liverpool', crest: 'https://crests.football-data.org/64.png', played: 7, won: 7, drawn: 0, lost: 0, gf: 15, ga: 2, gd: 13, points: 21 },
        { pos: 2, team: 'Barcelona', crest: 'https://crests.football-data.org/81.png', played: 7, won: 6, drawn: 0, lost: 1, gf: 26, ga: 11, gd: 15, points: 18 },
        { pos: 3, team: 'Arsenal', crest: 'https://crests.football-data.org/57.png', played: 7, won: 5, drawn: 1, lost: 1, gf: 14, ga: 6, gd: 8, points: 16 },
        { pos: 4, team: 'Inter', crest: 'https://crests.football-data.org/108.png', played: 7, won: 5, drawn: 1, lost: 1, gf: 7, ga: 1, gd: 6, points: 16 },
        { pos: 5, team: 'Atlético Madrid', crest: 'https://crests.football-data.org/78.png', played: 7, won: 5, drawn: 1, lost: 1, gf: 14, ga: 10, gd: 4, points: 16 },
        { pos: 6, team: 'Bayer Leverkusen', crest: 'https://crests.football-data.org/3.png', played: 7, won: 5, drawn: 1, lost: 1, gf: 13, ga: 7, gd: 6, points: 16 },
        { pos: 7, team: 'Lille', crest: 'https://crests.football-data.org/521.png', played: 7, won: 5, drawn: 1, lost: 1, gf: 11, ga: 7, gd: 4, points: 16 },
        { pos: 8, team: 'Aston Villa', crest: 'https://crests.football-data.org/58.png', played: 7, won: 5, drawn: 0, lost: 2, gf: 9, ga: 4, gd: 5, points: 15 },
        { pos: 9, team: 'Atalanta', crest: 'https://crests.football-data.org/102.png', played: 7, won: 4, drawn: 2, lost: 1, gf: 17, ga: 4, gd: 13, points: 14 },
        { pos: 10, team: 'Monaco', crest: 'https://crests.football-data.org/548.png', played: 7, won: 4, drawn: 2, lost: 1, gf: 13, ga: 7, gd: 6, points: 14 },
        { pos: 11, team: 'Feyenoord', crest: 'https://crests.football-data.org/6806.png', played: 7, won: 4, drawn: 1, lost: 2, gf: 16, ga: 12, gd: 4, points: 13 },
        { pos: 12, team: 'Bayern Munich', crest: 'https://crests.football-data.org/5.png', played: 7, won: 4, drawn: 1, lost: 2, gf: 17, ga: 8, gd: 9, points: 13 },
        { pos: 13, team: 'Borussia Dortmund', crest: 'https://crests.football-data.org/4.png', played: 7, won: 4, drawn: 1, lost: 2, gf: 19, ga: 10, gd: 9, points: 13 },
        { pos: 14, team: 'Juventus', crest: 'https://crests.football-data.org/109.png', played: 7, won: 4, drawn: 1, lost: 2, gf: 9, ga: 7, gd: 2, points: 13 },
        { pos: 15, team: 'AC Milan', crest: 'https://crests.football-data.org/98.png', played: 7, won: 4, drawn: 1, lost: 2, gf: 13, ga: 9, gd: 4, points: 13 },
        { pos: 16, team: 'PSV Eindhoven', crest: 'https://crests.football-data.org/674.png', played: 7, won: 3, drawn: 3, lost: 1, gf: 13, ga: 10, gd: 3, points: 12 },
        { pos: 17, team: 'PSG', crest: 'https://crests.football-data.org/524.png', played: 7, won: 3, drawn: 2, lost: 2, gf: 10, ga: 6, gd: 4, points: 11 },
        { pos: 18, team: 'Benfica', crest: 'https://crests.football-data.org/1903.png', played: 7, won: 3, drawn: 1, lost: 3, gf: 14, ga: 12, gd: 2, points: 10 },
        { pos: 19, team: 'Sporting CP', crest: 'https://crests.football-data.org/498.png', played: 7, won: 3, drawn: 1, lost: 3, gf: 11, ga: 9, gd: 2, points: 10 },
        { pos: 20, team: 'Club Brugge', crest: 'https://crests.football-data.org/5315.png', played: 7, won: 3, drawn: 1, lost: 3, gf: 7, ga: 9, gd: -2, points: 10 },
        { pos: 21, team: 'Real Madrid', crest: 'https://crests.football-data.org/86.png', played: 7, won: 3, drawn: 0, lost: 4, gf: 16, ga: 12, gd: 4, points: 9 },
        { pos: 22, team: 'Celtic', crest: 'https://crests.football-data.org/732.png', played: 7, won: 2, drawn: 3, lost: 2, gf: 12, ga: 12, gd: 0, points: 9 },
        { pos: 23, team: 'Man City', crest: 'https://crests.football-data.org/65.png', played: 7, won: 2, drawn: 2, lost: 3, gf: 15, ga: 14, gd: 1, points: 8 },
        { pos: 24, team: 'Dinamo Zagreb', crest: 'https://crests.football-data.org/1759.png', played: 7, won: 2, drawn: 2, lost: 3, gf: 10, ga: 18, gd: -8, points: 8 },
        { pos: 25, team: 'Shakhtar Donetsk', crest: 'https://crests.football-data.org/1874.png', played: 7, won: 1, drawn: 1, lost: 5, gf: 7, ga: 13, gd: -6, points: 4 },
        { pos: 26, team: 'Sparta Prague', crest: 'https://crests.football-data.org/7885.png', played: 7, won: 1, drawn: 1, lost: 5, gf: 7, ga: 18, gd: -11, points: 4 },
        { pos: 27, team: 'Stuttgart', crest: 'https://crests.football-data.org/10.png', played: 7, won: 1, drawn: 1, lost: 5, gf: 9, ga: 16, gd: -7, points: 4 },
        { pos: 28, team: 'Sturm Graz', crest: 'https://crests.football-data.org/1957.png', played: 7, won: 1, drawn: 0, lost: 6, gf: 4, ga: 14, gd: -10, points: 3 },
        { pos: 29, team: 'Girona', crest: 'https://crests.football-data.org/7874.png', played: 7, won: 1, drawn: 0, lost: 6, gf: 5, ga: 16, gd: -11, points: 3 },
        { pos: 30, team: 'Red Star Belgrade', crest: 'https://crests.football-data.org/7283.png', played: 7, won: 1, drawn: 0, lost: 6, gf: 10, ga: 21, gd: -11, points: 3 },
        { pos: 31, team: 'RB Salzburg', crest: 'https://crests.football-data.org/758.png', played: 7, won: 1, drawn: 0, lost: 6, gf: 3, ga: 21, gd: -18, points: 3 },
        { pos: 32, team: 'Bologna', crest: 'https://crests.football-data.org/103.png', played: 7, won: 0, drawn: 2, lost: 5, gf: 3, ga: 8, gd: -5, points: 2 },
        { pos: 33, team: 'RB Leipzig', crest: 'https://crests.football-data.org/721.png', played: 7, won: 0, drawn: 0, lost: 7, gf: 6, ga: 14, gd: -8, points: 0 },
        { pos: 34, team: 'Slovan Bratislava', crest: 'https://crests.football-data.org/7897.png', played: 7, won: 0, drawn: 0, lost: 7, gf: 5, ga: 24, gd: -19, points: 0 },
        { pos: 35, team: 'Young Boys', crest: 'https://crests.football-data.org/384.png', played: 7, won: 0, drawn: 0, lost: 7, gf: 3, ga: 22, gd: -19, points: 0 },
        { pos: 36, team: 'SK Sturm', crest: 'https://crests.football-data.org/1957.png', played: 7, won: 0, drawn: 0, lost: 7, gf: 1, ga: 17, gd: -16, points: 0 }
      ]);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getRowClass = (position) => {
    if (position <= 8) return 'direct-qualification';
    if (position <= 24) return 'playoff-qualification';
    return 'elimination';
  };

  if (loading && standings.length === 0) {
    return (
      <div className="champions-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando clasificación en vivo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="champions-container">
      <div className="header-container">
        <div className="header-title-section">
          <img src={championsLogo} alt="UEFA Champions League" className="champions-logo" />
          <div>
            <h1 className="title">UEFA Champions League 2024-25</h1>
            <p className="subtitle">Fase de Liga - Clasificación en Vivo</p>
          </div>
        </div>
        {lastUpdate && (
          <div className="update-info">
            <span className="live-indicator">🔴 EN VIVO</span>
            <p className="last-update">
              Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
            </p>
            <button onClick={fetchData} className="refresh-btn" disabled={loading}>
              {loading ? '⏳' : '🔄'} Actualizar
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <p className="api-instruction">
            Verifica tu conexión a internet y que la API esté funcionando correctamente.
          </p>
        </div>
      )}

      {/* Tabs para cambiar entre clasificación y partidos */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          📊 Clasificación ({standings.length})
        </button>
        <button 
          className={`tab ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          ⚽ Partidos {matches.filter(m => m.status === 'IN_PLAY').length > 0 && 
            `(${matches.filter(m => m.status === 'IN_PLAY').length} en vivo)`}
        </button>
      </div>

      {activeTab === 'standings' ? (
        <>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-box direct"></span>
              <span>Clasificación directa a Octavos (1-8)</span>
            </div>
            <div className="legend-item">
              <span className="legend-box playoff"></span>
              <span>Playoff (9-24)</span>
            </div>
            <div className="legend-item">
              <span className="legend-box eliminated"></span>
              <span>Eliminado (25-36)</span>
            </div>
          </div>

          <div className="table-container">
            <table className="standings-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th className="team-column">Equipo</th>
                  <th>PJ</th>
                  <th>G</th>
                  <th>E</th>
                  <th>P</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                  <th className="points-column">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => (
                  <tr key={team.pos} className={getRowClass(team.pos)}>
                    <td className="position">{team.pos}</td>
                    <td className="team-name">
                      <div className="team-info">
                        <img src={team.crest} alt={team.team} className="team-crest" />
                        <span>{team.team}</span>
                      </div>
                    </td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.drawn}</td>
                    <td>{team.lost}</td>
                    <td>{team.gf}</td>
                    <td>{team.ga}</td>
                    <td className={team.gd > 0 ? 'positive' : team.gd < 0 ? 'negative' : ''}>
                      {team.gd > 0 ? '+' : ''}{team.gd}
                    </td>
                    <td className="points"><strong>{team.points}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="matches-container">
          {matches.length === 0 ? (
            <div className="no-matches">
              <p>📅 No hay partidos programados o en vivo en este momento</p>
            </div>
          ) : (
            <div className="matches-grid">
              {matches.map((match, index) => (
                <div key={index} className={`match-card ${match.status === 'IN_PLAY' ? 'live' : ''}`}>
                  {match.status === 'IN_PLAY' && (
                    <div className="live-badge">🔴 EN VIVO</div>
                  )}
                  <div className="match-date">
                    {new Date(match.utcDate).toLocaleDateString('es-ES', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="match-teams">
                    <div className="match-team">
                      <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="match-crest" />
                      <span className="match-team-name">{match.homeTeam.name}</span>
                      {match.status === 'IN_PLAY' || match.status === 'FINISHED' ? (
                        <span className="match-score">{match.score.fullTime.home ?? match.score.halfTime.home ?? 0}</span>
                      ) : (
                        <span className="match-score">-</span>
                      )}
                    </div>
                    <div className="match-vs">VS</div>
                    <div className="match-team">
                      {match.status === 'IN_PLAY' || match.status === 'FINISHED' ? (
                        <span className="match-score">{match.score.fullTime.away ?? match.score.halfTime.away ?? 0}</span>
                      ) : (
                        <span className="match-score">-</span>
                      )}
                      <span className="match-team-name">{match.awayTeam.name}</span>
                      <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="match-crest" />
                    </div>
                  </div>
                  {match.status === 'IN_PLAY' && match.minute && (
                    <div className="match-minute">{match.minute}'</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChampionsLeague;
