// Viz framework functionality */


class Framework extends BaseApp {
    constructor() {
        super();

        this.appRunning = false;
    }

    setContainer(container) {
        this.container = container;
    }

    init(container) {
        super.init(container);
    }

    createScene() {
        //Init base createsScene
        super.createScene();

        //Create root object.
        this.root = new THREE.Object3D();
        this.addToScene(this.root);

        //Add ground plane
        this.addGround();

        let blockGroup = new THREE.Group();
        blockGroup.name = "BarChart";
        this.root.add(blockGroup);
        let geom = new THREE.BoxBufferGeometry(30, 30, 30, 8, 8);
        let mat = new THREE.MeshLambertMaterial({color: 0xff0000});
        let mesh = new THREE.Mesh(geom, mat);
        blockGroup.add(mesh);
        blockGroup.visible = false;

        let pieBlock = new THREE.Group();
        pieBlock.name = "PieChart";
        this.root.add(pieBlock);
        let loader = new THREE.JSONLoader();
        loader.load("models/pieChart.json", (geometry, materials) => {
            let material = materials[0];
            let mesh = new THREE.Mesh(geometry, material);
            pieBlock.add(mesh);
        });

    }

    createGUI() {
        //Create GUI - controlKit
        window.addEventListener('load', () => {
            let appearanceConfig = {
                Back: '#5c5f64',
                Ground: '#0c245c',
                Block: '#fffb37'
            };

            let controlKit = new ControlKit();

            controlKit.addPanel({label: "Configuration", width: 200, enable: false})
                .addSubGroup({label: "Appearance", enable: false})
                .addColor(appearanceConfig, "Back", {
                    colorMode: "hex", onChange: () => {
                        this.onBackgroundColourChanged(appearanceConfig.Back);
                    }
                })
                .addColor(appearanceConfig, "Ground", {
                    colorMode: "hex", onChange: () => {
                        this.onGroundColourChanged(appearanceConfig.Ground);
                    }
                })
        });
    }

    onBackgroundColourChanged(colour) {
        this.renderer.setClearColor(colour, 1.0);
    }

    onGroundColourChanged(colour) {
        let ground = this.getObjectByName('Ground');
        if (ground) {
            ground.material.color.setStyle(colour);
        }
    }

    addGround() {
        //Ground plane
        const GROUND_WIDTH = 1000, GROUND_HEIGHT = 640, SEGMENTS = 16;
        let groundGeom = new THREE.PlaneBufferGeometry(GROUND_WIDTH, GROUND_HEIGHT, SEGMENTS, SEGMENTS);
        let groundMat = new THREE.MeshLambertMaterial({color: 0xcdcdcd});
        let ground = new THREE.Mesh(groundGeom, groundMat);
        ground.name = "Ground";
        ground.rotation.x = -Math.PI / 2;
        this.root.add(ground);
    }

    update() {
        super.update();
        let delta = this.clock.getDelta();
        this.elapsedTime += delta;
    }

    refresh() {
        if(!this.appRunning) {
            if(!this.container) {
                console.log("No container set!");
                return;
            }
            this.init(this.container);
            //app.createGUI();
            this.createScene();

            this.run();
            this.appRunning = true;
        }
    }
}

$(document).ready( () => {
    if(!Detector.webgl) {
        $('#notSupported').show();
        return;
    }

    let container = document.getElementById("WebGL-output");
    let app = new Framework();
    app.setContainer(container);

    let elems = $('[id^="fig"]');
    let pickedElem;
    elems.on("click", function() {
        pickedElem = this;
        $(this).addClass("animateDisappear");
    });

    elems.on("animationend", () => {
        $('#visualisations').addClass("d-none");
        $('#WebGL-output').removeClass("d-none");

        app.refresh();
    });

    $('#back').on("click", () => {
        $(pickedElem).removeClass("animateDisappear");
        $('#visualisations').removeClass("d-none");
        $('#WebGL-output').addClass("d-none");
    })
});

