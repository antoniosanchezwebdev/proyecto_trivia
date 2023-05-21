export class menuInicio extends Phaser.Scene {
    constructor() {
        super({ key: "menuInicio" });
    }

    preload() {
        this.load.video("background", "mp4/fondo.mp4", true);
        this.load.image("gameover", "img/logo.png");
        this.load.image("botonInicio", "img/botonInicio.png");
        this.load.image("botonOpciones", "img/botonOpciones.png");
        if (typeof game.registry.get("dificultad") == "undefined") {
            this.dificultad = 2;
            game.registry.set("dificultad", this.dificultad);
            game.registry.set("pregunta", 1);
        } else {
            this.dificultad = game.registry.get("dificultad");
            game.registry.set("pregunta", 1);
        }
    }

    create() {
        this.fondo = this.add.video(600, 350, "background");
        this.fondo.play(true);
        this.gameoverImage = this.add.image(750, 100, "gameover");
        this.gameoverImage.setScale(0.25);
        this.botonInicio = this.add.image(750, 300, "botonInicio");
        this.botonInicio.setScale(0.5);
        this.botonOpciones = this.add.image(750, 500, "botonOpciones");
        this.botonOpciones.setScale(0.5);
        this.botonInicio.setInteractive();
        this.botonInicio.on(
          "pointerdown",
          function (event) {
              // ...
              this.scene.start("InicioPartida");
          },
          this
      );

        this.botonOpciones.setInteractive();
        this.botonOpciones.on(
            "pointerdown",
            function (event) {
                // ...
                this.scene.start("Opciones");
            },
            this
        );
    }
}
