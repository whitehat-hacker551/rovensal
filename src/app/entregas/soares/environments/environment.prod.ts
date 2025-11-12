// ENVIRONMENT - Configuración de api externa para Soares
export const environment = {
  production: true,
  apiUrl: 'https://api.balldontlie.io/v1',
  apiKey: '', // Aquie añadimos la API KEY, pero como estará expuesta públicamente, la dejo vacía
  apiTimeout: 15000,
  useMockFallback: true
};
