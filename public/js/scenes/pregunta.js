export class Pregunta extends Phaser.Scene {
    constructor() {
        super({ key: "Pregunta" });
    }

    preload() {
        this.load.video("background", "mp4/fondoFix.mp4", false, true);
        this.load.image("logo", fotoPerfil);
        this.load.image("botonEmpezar", "img/botonEmpezar.png");
        this.load.image("preguntaTemplate", "img/pregunta.png");
        this.load.image("respuestaTemplate", "img/preguntaTemplate.png");
        this.load.image("respuestaTension", "img/respuestaCor.png");
        this.load.image("respuestaCorrecta", "img/respuestaCorBien.png");
        this.load.image("respuestaIncorrecta", "img/respuestaCorMal.png");
        this.load.image("comodin5050", "img/botonComodin50.png");
        this.load.image("comodinTiempo", "img/botonComodinReloj.png");
        this.load.image("comodinSalto", "img/botonComodinPregunta.png");
    }

    create() {
        if(game.registry.get("saltoPregunta") == true){
            this.preguntaJSON = preguntaSalto;
            game.registry.set("saltoPregunta", false); 
        }else{
            this.preguntaJSON = preguntaQuery;
        }
        this.preguntas = [];
        this.initialTime = 120 / this.game.registry.get("dificultad");
        this.evento = this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop: true,
        });
        this.fondoFix = this.add.video(600, 350, "background");
        this.fondoFix.play(true);
        this.cuenta = this.add.text(32, 32, this.formatTime(this.initialTime), {
            fontFamily: "Helvetica",
            fontSize: "48px",
            color: "#fff",
            fontStyle: "normal",
            strokeThickness: 2,
        });

        if (game.registry.get("comodin5050") != false) {
            this.comodin5050 = this.add.image(1300, 60, "comodin5050");
            this.comodin5050.setScale(0.35);

            this.comodin5050.setInteractive();

            this.comodin5050.on(
                "pointerdown",
                function (event) {
                    this.usarComodin5050();
                },
                this
            );
        }

        if (game.registry.get("comodinTiempo") != false) {
            this.comodinTiempo = this.add.image(1400, 60, "comodinTiempo");
            this.comodinTiempo.setScale(0.35);

            this.comodinTiempo.setInteractive();

            this.comodinTiempo.on(
                "pointerdown",
                function (event) {
                    this.usarComodinTiempo();
                },
                this
            );
        }
        if (game.registry.get("comodinSalto") != false) {
            this.comodinSalto = this.add.image(1500, 60, "comodinSalto");
            this.comodinSalto.setScale(0.35);
            this.comodinSalto.setInteractive();

            this.comodinSalto.on(
                "pointerdown",
                function (event) {
                    this.usarComodinSalto();
                    this.usarComodinSalto();
                },
                this
            );
        }

        this.preguntaTemplate = this.add.image(0, 0, "preguntaTemplate");
        this.respuestaTemplate1 = this.add.image(0, 0, "preguntaTemplate");
        this.respuestaTemplate1.setScale(0.45);
        this.respuestaTemplate2 = this.add.image(0, 0, "preguntaTemplate");
        this.respuestaTemplate2.setScale(0.45);
        this.respuestaTemplate3 = this.add.image(0, 0, "preguntaTemplate");
        this.respuestaTemplate3.setScale(0.45);
        this.respuestaTemplate4 = this.add.image(0, 0, "preguntaTemplate");
        this.respuestaTemplate4.setScale(0.45);
        this.pregunta = this.add.text(
            0,
            0,
            this.convertUnicode(this.preguntaJSON.pregunta),
            {
                fontFamily: "Helvetica",
                fontSize: "42px",
                color: "#fff",
                fontStyle: "normal",
                align: "center",
                wordWrap: {
                    width: this.preguntaTemplate.displayWidth * 0.75,
                },
                strokeThickness: 2,
            }
        );
        this.preguntaContainer = this.add.container(785, 210, [
            this.preguntaTemplate,
            this.pregunta.setOrigin(0.5),
        ]);
        this.añadirTexto(this);
    }

    añadirTexto(scene) {
        var datos = this.preguntaJSON.respuestas_incorrectas;
        var respuestas = datos.split('","');
        respuestas[0] = respuestas[0].substr(2);
        respuestas[2] = respuestas[2].substring(0, respuestas[2].length - 2);
        respuestas[3] = this.preguntaJSON.respuesta_correcta;
        var respuestaA = Math.floor(Math.random() * respuestas.length);
        this.preguntas.push(
            this.addAnswer(
                scene,
                385,
                510,
                this.respuestaTemplate1,
                respuestas[respuestaA],
                "A"
            )
        );
        respuestas.splice(respuestaA, 1);

        var respuestaB = Math.floor(Math.random() * respuestas.length);
        this.preguntas.push(
            this.addAnswer(
                scene,
                1185,
                510,
                this.respuestaTemplate2,
                respuestas[respuestaB],
                "B"
            )
        );
        respuestas.splice(respuestaB, 1);

        var respuestaC = Math.floor(Math.random() * respuestas.length);
        this.preguntas.push(
            this.addAnswer(
                scene,
                385,
                610,
                this.respuestaTemplate3,
                respuestas[respuestaC],
                "C"
            )
        );
        respuestas.splice(respuestaC, 1);

        this.preguntas.push(
            this.addAnswer(
                scene,
                1185,
                610,
                this.respuestaTemplate4,
                respuestas[0],
                "D"
            )
        );
    }

    resolverPregunta(scene, pregunta) {
        this.puntuaciones = [
            50, 250, 500, 750, 1000, 1500, 2000, 5000, 10000, 25000, 50000,
            100000, 250000, 500000, 1000000,
        ];

        this.preguntas.forEach(function (contenedor) {
            contenedor.disableInteractive();
        });

        pregunta.list[0].setTexture("respuestaTension");

        if (
            pregunta.list[1].text.substring(3) ==
            this.preguntaJSON.respuesta_correcta
        ) {
            this.evento.paused = true;
            this.time.delayedCall(
                1000,
                () => {
                    return pregunta.list[0].setTexture("respuestaCorrecta");
                },
                [],
                this
            );

            if (game.registry.get("pregunta") < 14) {
                game.registry.set(
                    "pregunta",
                    game.registry.get("pregunta") + 1
                );

                var base = 120 / this.game.registry.get("dificultad");
                game.registry.set(
                    "tiempo",
                    parseInt(game.registry.get("tiempo")) +
                        parseInt((this.initialTime - base) * -1)
                );

                game.registry.set(
                    "puntuacion",
                    parseInt(game.registry.get("puntuacion")) +
                        parseInt(
                            this.puntuaciones[game.registry.get("pregunta")]
                        ) +
                        parseInt(base - this.initialTime)
                );

                console.log(game.registry.get("puntuacion"));

                this.time.delayedCall(
                    1000,
                    () => {
                        return this.time.delayedCall(
                            1000,
                            () => {
                                return this.siguientePregunta();
                            },
                            [],
                            this
                        );
                    },
                    [],
                    this
                );
            } else {
                this.enviarDatos();
            }
        } else {
            setTimeout(
                pregunta.list[0].setTexture("respuestaIncorrecta"),
                5000
            );
            this.scene.start("menuInicio");
        }
    }

    siguientePregunta() {
        this.scene.start("InicioPartida");
    }

    formatTime(seconds) {
        // Minutes
        var minutes = Math.floor(seconds / 60);
        // Seconds
        var partInSeconds = seconds % 60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2, "0");
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }

    onEvent() {
        if (this.initialTime == 0) {
            this.scene.start("menuInicio");
        } else {
            this.initialTime -= 1; // One second
            this.cuenta.setText(this.formatTime(this.initialTime));
        }
    }

    enviarDatos() {
        var puntuacion = {
            user_id: usuarioID,
            tiempo: game.registry.get("tiempo"),
            puntuacion: game.registry.get("puntuacion"),
            dificultad: game.registry.get("dificultad"),
        };
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            type: "POST",
            url: "/juego-subir",
            data: puntuacion,
            success: function (data) {
                if (data == "success") {
                    this.scene.start("menuInicio");
                } else if (data == "error") {
                    this.scene.start("opciones");
                }
            },
        });
    }

    convertUnicode(input) {
        // Expresión regular que busca códigos Unicode en el formato \u####
        let regex = /\\u([\d\w]{4})/gi;

        // Usamos replace con una función de callback que convierte los códigos Unicode en caracteres
        let output = input.replace(regex, function (match, grp) {
            return String.fromCharCode(parseInt(grp, 16));
        });

        // Des-escapamos los caracteres de escape adicionales
        output = decodeURIComponent(output);

        return output;
    }

    addAnswer(scene, posX, posY, template, text, letter) {
        let answerText = letter + ": " + this.convertUnicode(text);

        let tempText = this.add
            .text(0, 0, answerText, {
                fontFamily: "Helvetica",
                fontSize: "35px",
                color: "#fff",
                fontStyle: "normal",
                align: "center",
                strokeThickness: 1,
            })
            .setVisible(false); // Create an invisible version of the text to measure its size

        let textWidth = tempText.width;
        let textHeight = tempText.height;

        let containerWidth = template.displayWidth;
        let containerHeight = template.displayHeight;

        // Check if text exceeds the container size
        if (textWidth > containerWidth || textHeight > containerHeight) {
            // Calculate the scale factor
            let scaleX = containerWidth / textWidth;
            let scaleY = containerHeight / textHeight;
            let scale = Math.min(scaleX, scaleY); // We use the smaller scale to make sure both dimensions fit the container

            // Create the actual text
            let actualText = this.add
                .text(0, 0, answerText, {
                    fontFamily: "Helvetica",
                    fontSize: "35px",
                    color: "#fff",
                    fontStyle: "normal",
                    align: "center",
                    strokeThickness: 1,
                })
                .setScale(scale) // Scale the text
                .setOrigin(0.5);

            let preguntaContainer = this.add.container(posX, posY, [
                template,
                actualText,
            ]);

            preguntaContainer.setSize(
                preguntaContainer.list[0].displayWidth,
                preguntaContainer.list[0].displayHeight
            );
            preguntaContainer.setInteractive();

            preguntaContainer.on(
                "pointerdown",
                function (event) {
                    this.resolverPregunta(scene, preguntaContainer);
                },
                this
            );

            return preguntaContainer;
        } else {
            // If the text does not exceed the container size, we just create it without scaling
            let actualText = this.add
                .text(0, 0, answerText, {
                    fontFamily: "Helvetica",
                    fontSize: "35px",
                    color: "#fff",
                    fontStyle: "normal",
                    align: "center",
                    strokeThickness: 1,
                })
                .setOrigin(0.5);

            let preguntaContainer = this.add.container(posX, posY, [
                template,
                actualText,
            ]);

            preguntaContainer.setSize(
                preguntaContainer.list[0].displayWidth,
                preguntaContainer.list[0].displayHeight
            );
            preguntaContainer.setInteractive();

            preguntaContainer.on(
                "pointerdown",
                function (event) {
                    this.resolverPregunta(scene, preguntaContainer);
                },
                this
            );

            return preguntaContainer;
        }

        // Destroy the temporary text
        tempText.destroy();
    }

    usarComodin5050() {
        let datos50 = this.preguntaJSON.respuestas_incorrectas;
        let respuestas50 = datos50.split('","');
        var respuestaA50 = Math.floor(Math.random() * respuestas50.length);
        let preguntaContador = 0;
        this.preguntas.forEach(function (pregunta) {
            if (
                pregunta.list[1].text.substring(3) ==
                    this.preguntaJSON.respuesta_correcta ||
                pregunta.list[1].text.substring(3) == respuestas50[respuestaA50]
            ) {
            } else {
                if (preguntaContador < 2) {
                    pregunta.setVisible(false);
                    pregunta.disableInteractive();
                    preguntaContador++;
                }
            }
        });
        this.comodin5050.destroy();
        game.registry.set("comodin5050", false);
    }

    usarComodinTiempo() {
        this.initialTime += 120 / this.game.registry.get("dificultad");

        this.comodinTiempo.destroy();
        game.registry.set("comodinTiempo", false);
    }

    usarComodinSalto() {
        this.comodinSalto.destroy();

        game.registry.set("comodinSalto", false);
        game.registry.set("saltoPregunta", true);
        
        this.siguientePregunta();
    }

}