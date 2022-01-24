/**
 * ALGO: ceci est une classe...
 * Vous verrez ça plus tard en détail avec Rémi, pour l'instant on n'a pas trop besoin de savoir à quoi ça sert.
 */
class Tableau1 extends Phaser.Scene{
    /**
     * Précharge les assets
     */
    preload(){
        this.load.image('wpp','assets/carte.png');
        this.load.image('ball','assets/gourde.png');
        this.load.image('asterix','assets/asterix.png');
        this.load.image('cesar','assets/cesar.png');
        this.load.image('mur','assets/palissade.png');
        this.load.image('square','assets/carre.png');
        this.load.audio('theme','assets/theme.MP3');
    }

    create(){
        this.hauteur = 500
        this.largeur = 1000

        //Fond d'ecran
        this.wpp=this.add.image(-50,-200,'wpp').setOrigin(0,0);
        this.wpp.setScale(0.55);


        //Mur Haut
        this.haut=this.physics.add.image(0,0,'square').setOrigin(0,0);
        this.haut.setDisplaySize(this.largeur,20);
        this.haut.body.setAllowGravity(false);
        this.haut.setImmovable(true);

        this.paliHaut=this.add.tileSprite(0,0,this.largeur,40,'mur').setOrigin(0,0);
        this.paliHaut.flipY = true;

        //Mur Bas
        this.bas=this.physics.add.image(0,this.hauteur-20,'square').setOrigin(0,0);
        this.bas.setDisplaySize(this.largeur,20);
        this.bas.body.setAllowGravity(false);
        this.bas.setImmovable(true);

        this.paliHaut=this.add.tileSprite(0,this.hauteur-40,this.largeur,40,'mur').setOrigin(0,0);

        //Balle
        this.balle = this.physics.add.image(this.largeur/2,this.hauteur/2,'ball').setOrigin(0,0);
        this.balle.setDisplaySize(50,50);
        this.balle.body.setBounce(1.2,1.2);
        this.balle.body.setVelocityX(Phaser.Math.Between(-200,200));
        this.balle.body.setVelocityY(Phaser.Math.Between(-50,50));
        this.balle.body.setMaxVelocity(1000,1000);

        //Raquette Gauche
        this.gauche=this.physics.add.image(10,this.hauteur/2,'asterix').setOrigin(0,0);
        this.gauche.setScale(0.2);
        //this.gauche.setDisplaySize(50,100);
        this.gauche.body.setAllowGravity(false);
        this.gauche.setImmovable(true);
        this.gauche.body.setVelocityY(0);

        //Raquette Droite
        this.droite=this.physics.add.image(this.largeur-80,this.hauteur/2,'cesar').setOrigin(0,0);
        this.droite.setScale(0.4);
        this.droite.flipX = true;
        //this.droite.setDisplaySize(20,100);
        this.droite.body.setAllowGravity(false);
        this.droite.setImmovable(true);
        this.droite.body.setVelocityY(0);

        let me = this;

        //Rebonds
        this.physics.add.collider(this.balle,this.bas);
        this.physics.add.collider(this.balle,this.haut);
        this.physics.add.collider(this.balle,this.gauche, function() {
            console.log('touche gauche');
            me.rebond(me.gauche)
        });
        this.physics.add.collider(this.balle,this.droite, function() {
            console.log('touche droite');
            me.rebond(me.droite)
        });


        /**On compte les points sinon on s'emmerde**/

        this.jGauche = new Joueur('Asterix','jGauche');
        this.jDroite = new Joueur('Cesar','jDroite');

        this.theme = this.sound.add('theme');

        alert('Cliquez pour commencer');

        this.theme.play();

        this.initkeyboard()
    }

    convert(num) {
        if(num < 1){ return "";}
        if(num >= 40){ return "XL" + convert(num - 40);}
        if(num >= 10){ return "X" + convert(num - 10);}
        if(num >= 9){ return "IX" + convert(num - 9);}
        if(num >= 5){ return "V" + convert(num - 5);}
        if(num >= 4){ return "IV" + convert(num - 4);}
        if(num >= 1){ return "I" + convert(num - 1);}
    }

    rebond(player){

        let hauteurPlayer = player.displayHeight;

        let positionRelativePlayer = (this.balle.y - player.y);

        positionRelativePlayer = (positionRelativePlayer / hauteurPlayer);
        positionRelativePlayer = positionRelativePlayer*2-1;

        this.balle.setVelocityY(this.balle.body.velocity.y + positionRelativePlayer*50);

    }

    win(joueur){
        joueur.score ++;
    }

    initkeyboard(){
        let me=this;
        this.input.keyboard.on('keydown', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.A:
                    me.gauche.body.setVelocityY(-500);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.gauche.body.setVelocityY(500);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.P:
                    me.droite.body.setVelocityY(-500);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.M:
                    me.droite.body.setVelocityY(500);
                    break;
            }
        });
        this.input.keyboard.on('keyup', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.A:
                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.gauche.body.setVelocityY(0);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.P:
                case Phaser.Input.Keyboard.KeyCodes.M:
                    me.droite.body.setVelocityY(0);
                    break;
            }
        });
    }


    update(){

        /**Pour la boucle de jeu**/
        if(this.balle.x > this.largeur){
            this.win(this.jGauche);
            this.balle.x = this.largeur/2;
            this.balle.y = this.hauteur/2;
            this.balle.body.setVelocityX(Phaser.Math.Between(50,200));
            this.balle.body.setVelocityY(Phaser.Math.Between(0,0));
        }
        if(this.balle.x < 0){
            this.win(this.jDroite);
            this.balle.x = this.largeur/2;
            this.balle.y = this.hauteur/2;
            this.balle.body.setVelocityX(Phaser.Math.Between(-200,-50));
            this.balle.body.setVelocityY(Phaser.Math.Between(0,0));
        }

        //Debug balle
        if(this.balle.y < 0){
            this.balle.y = 0
        }
        if(this.balle.y > this.hauteur){
            this.balle.y = this.hauteur
        }

        //Debug Raquette
        if(this.gauche.y < 20){
            this.gauche.y = 20
        }
        if(this.gauche.y > this.hauteur-170){
            this.gauche.y = this.hauteur-170
        }
        if(this.droite.y < 20){
            this.droite.y = 20
        }
        if(this.droite.y > this.hauteur-200){
            this.droite.y = this.hauteur-200
        }
    }
}
