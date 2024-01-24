const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3010;

var userIds = null;

// middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "mysecret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 300000, // 5 minutos en milisegundos
        },
    })
);
app.use(function (req, res, next) {
    if (req.session && req.session.userId) {
        req.session.touch(); // Restablecer el tiempo de expiración de la sesión
    }
    next();
});

//Crear conexión a la base de datos

const connection = mysql.createConnection({
    host: "db4free.net",
    user: "root06",
    password: "12345678",
    database: "bank_4",
});

// Conexión a la base de datos MySQL
connection.connect((err) => {
    if (err) {
        console.error(
            "Error al conectar a la base de datos:",
            err
        );
        return;
    }
    console.log("Conexión exitosa a la base de datos");
    // Resto del código de tu aplicación
});

// Rutas
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

app.get("/index", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

app.get("/profile", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "profile.html")
    );
});

app.get("/login-signup", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "login-signup.html.html"
        )
    );
});

// Manejar solicitud de inicio de sesión
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    connection.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        function (error, results, fields) {
            if (results.length > 0) {
                res.send({
                    success: true,
                    userId: results[0].id,
                });
                userIds = results[0].id;
                console.log(
                    results[0].id + " has iniciado sesión"
                );
            } else {
                console.log("error en el inicio de sesión");
                res.send({ success: false });
            }
        }
    );
});

// Manejar solicitud de registro
app.post("/signup", function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    connection.query(
        "INSERT INTO users (username, email, password, balance) VALUES (?, ?, ?, 0)",
        [username, email, password, 0],
        function (error, results, fields) {
            if (error) {
                res.send({ success: false });
            } else {
                res.send({ success: true });
            }
        }
    );
});

// Manejar solicitud para obtener información de usuario
app.get("/api/user-info", (req, res) => {
    const userId = userIds;

    // Obtener el nombre de usuario y el balance desde la tabla "users"
    const userQuery =
        "SELECT username, FORMAT(balance, 2) AS formatted_balance FROM users WHERE id = ?";
    connection.query(
        userQuery,
        [userId],
        (err, results) => {
            if (err) {
                // Manejar error
                res.status(500).json({
                    success: false,
                    message: "Error en el servidor",
                });
            } else {
                const username = results[0].username;
                const balance =
                    results[0].formatted_balance;

                // Obtener las últimas 10 transacciones desde la tabla "transactions"
                const transactionsQuery =
                    "SELECT description, FORMAT(amount, 2) AS amount, transaction_date FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC LIMIT 10";
                connection.query(
                    transactionsQuery,
                    [userId],
                    (err, results) => {
                        if (err) {
                            // Manejar error
                            res.status(500).json({
                                success: false,
                                message:
                                    "Error en el servidor",
                            });
                        } else {
                            const transactions = results;
                            res.status(200).json({
                                success: true,
                                username,
                                balance,
                                transactions,
                            });
                        }
                    }
                );
            }
        }
    );
});

// Ruta para manejar solicitudes de depósito
app.post("/api/deposit", (req, res) => {
    const userId = userIds;
    const { amount, description } = req.body;

    // Actualizar el balance del usuario en la tabla "users"
    const updateBalanceQuery =
        "UPDATE users SET balance = balance + ? WHERE id = ?";
    connection.query(
        updateBalanceQuery,
        [amount, userId],
        (err, result) => {
            if (err) {
                // Manejar error
                res.status(500).json({
                    success: false,
                    message: "Error en el servidor",
                });
            } else {
                // Insertar nueva transacción en la tabla "transactions"
                const insertTransactionQuery =
                    "INSERT INTO transactions (user_id, description, amount) VALUES (?, ?, ?)";
                connection.query(
                    insertTransactionQuery,
                    [userId, description, amount],
                    (err, result) => {
                        if (err) {
                            // Manejar error
                            res.status(500).json({
                                success: false,
                                message:
                                    "Error en el servidor",
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: "Depósito exitoso",
                            });
                        }
                    }
                );
            }
        }
    );
});

// Ruta para manejar solicitudes de retiro
app.post("/api/withdraw", (req, res) => {
    const userId = userIds;
    const { amount, description } = req.body;

    // Verificar si el usuario tiene suficiente balance para realizar el retiro
    const checkBalanceQuery =
        "SELECT balance FROM users WHERE id = ?";
    connection.query(
        checkBalanceQuery,
        [userId],
        (err, results) => {
            if (err) {
                // Manejar error
                res.status(500).json({
                    success: false,
                    message: "Error en el servidor",
                });
            } else {
                const currentBalance = results[0].balance;
                if (currentBalance < amount) {
                    res.status(400).json({
                        success: false,
                        message: "Fondos insuficientes",
                    });
                } else {
                    // Actualizar el balance del usuario en la tabla "users"
                    const updateBalanceQuery =
                        "UPDATE users SET balance = balance - ? WHERE id = ?";
                    connection.query(
                        updateBalanceQuery,
                        [amount, userId],
                        (err, result) => {
                            if (err) {
                                // Manejar error
                                res.status(500).json({
                                    success: false,
                                    message:
                                        "Error en el servidor",
                                });
                            } else {
                                // Insertar nueva transacción en la tabla "transactions"
                                const insertTransactionQuery =
                                    "INSERT INTO transactions (user_id, description, amount) VALUES (?, ?, ?)";
                                connection.query(
                                    insertTransactionQuery,
                                    [
                                        userId,
                                        description,
                                        -amount,
                                    ],
                                    (err, result) => {
                                        if (err) {
                                            // Manejar error
                                            res.status(
                                                500
                                            ).json({
                                                success: false,
                                                message:
                                                    "Error en el servidor",
                                            });
                                        } else {
                                            res.status(
                                                200
                                            ).json({
                                                success: true,
                                                message:
                                                    "Retiro exitoso",
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        }
    );
});

// Manejar solicitud de cierre de sesión
app.post("/logout", function (req, res) {
    req.session.destroy();
    res.send({ success: true });
    userIds = null;
});

// Iniciar el servidor
app.listen(port, "0.0.0.0", () => {
    console.log("Servidor iniciado en el puerto " + port);
});
