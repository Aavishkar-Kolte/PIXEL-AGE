export const configureRoutes = (app) => {

    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    })

    app.get('/*', (req, res) => {
        res.redirect('/');
    })

};
