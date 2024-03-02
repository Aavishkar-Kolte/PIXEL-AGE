export const configureRoutes = (app) => {
    app.get('/', (req, res) => {
        res.sendFile("index.html");
    })

    app.get('/*', (req, res) => {
        res.redirect('/');
    })
};
