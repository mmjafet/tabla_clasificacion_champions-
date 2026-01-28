export default async (request, context) => {
  const API_KEY = '40840c28468840a2baa301eb82d871da';
  
  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/CL/standings', {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
