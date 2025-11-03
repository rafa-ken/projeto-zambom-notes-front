Notes Frontend (React + Vite + Auth0)

1) Copie .env.example para .env e preencha as variáveis:
   VITE_AUTH0_DOMAIN
   VITE_AUTH0_CLIENT_ID
   VITE_AUTH0_AUDIENCE
   VITE_API_URL

2) Instale dependências:
   npm install

3) Rodar em dev:
   npm run dev
   (aberto em http://localhost:5173)

4) Build:
   npm run build
   (usa Dockerfile para deploy caso queira)

Auth0 notes:
 - Permitir Callback/Logout/Web Origins para http://localhost:5173
 - A API deve ter scopes: create:notes update:notes delete:notes
 - O token deve conter esses scopes (configure permissions/roles em Auth0)
 - Se quiser refresh tokens no SPA, habilite Allow Offline Access na Application e mantenha offline_access no scope
