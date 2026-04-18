# Brightside Goldens

A starter web app for Brightside Goldens with:

- Angular standalone frontend
- Node/Express backend
- JSON file persistence in `server/data/site-data.json`

## Local development

- `npm install`
- `npm start`

The Angular app runs on port `4200` and the Node API runs on port `3000`.

## Combined deployment

This project is set up so the Node server can serve the built Angular app and
the API together from one service.

- `npm install`
- `npm run build`
- `npm run serve:prod`

In production, the Node server serves the Angular files from
`dist/brightside-goldens/browser` and keeps the API available under `/api`.
