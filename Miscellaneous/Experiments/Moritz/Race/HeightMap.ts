namespace HeightMap {
  import f = FudgeCore;
  import fAid = FudgeAid;

  window.addEventListener("load", init);

  export let graph: f.Node = new f.Node("Graph");
  export let viewport: f.Viewport;

  let cmpCamera: f.ComponentCamera;

  let startTime: number;
  let sunk: boolean = false;

  let gridMeshFlat: f.MeshTerrain;
  let gridFlat: f.Node;
  let water: f.Node;
  let finish: f.Node;

  let heightMap: f.TextureImage;

  let controlled: Controlled;
  let chassis: f.Node;

  let frontAxis: f.Node;
  let rearAxis: f.Node;

  let tyreFL: f.Node;
  let tyreFR: f.Node;
  let tyreBL: f.Node;
  let tyreBR: f.Node;

  let tyreRotationFL: f.Node;
  let tyreRotationFR: f.Node;
  let tyreRotationBR: f.Node;
  let tyreRotationBL: f.Node;

  let FL: f.Node;
  let FR: f.Node;
  let BL: f.Node;
  let BR: f.Node;

  let cntKeyHorizontal: f.Control = new f.Control("Keyboard", 1, f.CONTROL_TYPE.PROPORTIONAL, true);
  let cntKeyVertical: f.Control = new f.Control("Keyboard", 4, f.CONTROL_TYPE.PROPORTIONAL, true);

  async function init(_event: Event): Promise<void> {

    await setupScene();
    setupControls();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, hndLoop);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);

    // f.RenderManager.setupTransformAndLights(graph);

    startTime = Date.now();

    fAid.addStandardLightComponents(graph);
  }

  function hndLoop(_event: Event): void {
    hndKeyboardControls();

    let timeFrame: number = f.Loop.timeFrameGame / 1000;
    controlled.update(timeFrame);

    if (chequeredFlag()) {
      console.log("Finish");
      controlled.mtxLocal.translation = new f.Vector3(1.1824, 0.032500, 1.2376);
      controlled.mtxLocal.lookAt(f.Vector3.SUM(controlled.mtxLocal.translation, f.Vector3.Y(1)), new f.Vector3(0, 0, 1));
      startTime = Date.now();
    }

    if (!chequeredFlag()) {
      let time: number = Date.now() - startTime;
      let seconds = Math.floor(time / 1000);
      console.log(seconds + ":" + time % (seconds * 1000));
    }

    if (controlled.mtxWorld.translation.y < 0) sunk = true;

    if (sunk) {
      controlled.mtxLocal.translation = new f.Vector3(1.1824, 0.032500, 1.2376);
      controlled.mtxLocal.lookAt(f.Vector3.SUM(controlled.mtxLocal.translation, f.Vector3.Y(1)), new f.Vector3(0, 0, 1));
      sunk = false;
    }

    // let displayTime: string = timeMinutes;
    viewport.draw();
  }

  function chequeredFlag(): boolean {
    let position: f.Vector3 = controlled.mtxWorld.translation;

    if (position.x > -0.8 && position.x < -0.6 && position.z < 0.8 && position.z > 0.6)
      return true;

    return false;
  }

  async function setupScene(): Promise<void> {

    let coatTexturedMap: ƒ.CoatTextured = new ƒ.CoatTextured();
    let coatTexturedWater: ƒ.CoatTextured = new ƒ.CoatTextured();

    let coatTexturedStart: ƒ.CoatTextured = new ƒ.CoatTextured();
    let coatTexturedFinish: ƒ.CoatTextured = new ƒ.CoatTextured();

    let texMap = new f.TextureImage();
    let texWater = new f.TextureImage();

    let texFinish = new f.TextureImage();

    texMap.load("../Textures/maptex.png");
    coatTexturedMap.texture = texMap;

    texWater.load("../Textures/water.png");
    coatTexturedWater.texture = texWater;

    texFinish.load("../Textures/finish.png");
    coatTexturedFinish.texture = texFinish;

    let matTex: ƒ.Material = new ƒ.Material("Textured", ƒ.ShaderTexture, coatTexturedMap);
    let matWater: ƒ.Material = new ƒ.Material("Textured", ƒ.ShaderTexture, coatTexturedWater);
    let matFinish: ƒ.Material = new ƒ.Material("Textured", ƒ.ShaderTexture, coatTexturedFinish);

    let matFlat: f.Material = new f.Material("White", f.ShaderFlat, new f.CoatColored(f.Color.CSS("WHITE")));
    let matRed: f.Material = new f.Material("Red", f.ShaderFlat, new f.CoatColored(f.Color.CSS("RED")));
    let matGrey: f.Material = new f.Material("Red", f.ShaderFlat, new f.CoatColored(f.Color.CSS("GREY")));

    let meshCube = new f.MeshCube("CubeMesh");
    let meshSphere = new f.MeshSphere("Tyre", 10, 10);
    let meshPlane = new f.MeshQuad("Quad");

    controlled = new Controlled("Cube", f.Matrix4x4.IDENTITY()/*, matRed, meshCube*/);
    controlled.mtxLocal.translation = new f.Vector3(1.1824, 0.032500, 1.2376);
    controlled.mtxLocal.lookAt(f.Vector3.SUM(controlled.mtxLocal.translation, f.Vector3.Y(1)), new f.Vector3(0, 0, 1));

    chassis = Scenes.createCompleteMeshNode("Chassis", matRed, meshCube);
    chassis.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(1, 0.5, 0.3));
    chassis.getComponent(f.ComponentMesh).pivot.translateX(0.5)
    chassis.mtxLocal.scale(f.Vector3.ONE(0.1));
    chassis.mtxLocal.translateZ(0.2)

    frontAxis = Scenes.createCompleteMeshNode("Front Axis", matRed, meshCube);
    frontAxis.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(0.1, 0.8, 0.1));
    frontAxis.mtxLocal.translate(new f.Vector3(0.1, 0, 0));
    frontAxis.mtxLocal.scale(f.Vector3.ONE(0.1));

    rearAxis = Scenes.createCompleteMeshNode("Rear Axis", matGrey, meshCube);
    rearAxis.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(0.1, 0.8, 0.1));
    rearAxis.mtxLocal.scale(f.Vector3.ONE(0.1));


    tyreRotationFL = Scenes.createCompleteMeshNode("Tyre Rotation FL", matGrey, meshSphere);
    tyreRotationFL.getComponent(f.ComponentMesh).pivot.rotateX(-90);
    tyreRotationFL.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(1, 1, 0.3));

    tyreRotationFR = Scenes.createCompleteMeshNode("Tyre Rotation FR", matGrey, meshSphere);
    tyreRotationFR.getComponent(f.ComponentMesh).pivot.rotateX(-90);
    tyreRotationFR.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(1, 1, 0.3));

    tyreRotationBR = Scenes.createCompleteMeshNode("Tyre Rotation BR", matGrey, meshSphere);
    tyreRotationBR.getComponent(f.ComponentMesh).pivot.rotateX(-90);
    tyreRotationBR.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(1, 1, 0.3));

    tyreRotationBL = Scenes.createCompleteMeshNode("Tyre Rotation BL", matGrey, meshSphere);
    tyreRotationBL.getComponent(f.ComponentMesh).pivot.rotateX(-90);
    tyreRotationBL.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(1, 1, 0.3));


    tyreFL = new f.Node("Tyre FL");
    tyreFL.addComponent(new f.ComponentTransform);

    tyreFR = new f.Node("Tyre FR");
    tyreFR.addComponent(new f.ComponentTransform);

    tyreBR = new f.Node("Tyre BR");
    tyreBR.addComponent(new f.ComponentTransform);

    tyreBL = new f.Node("Tyre BL");
    tyreBL.addComponent(new f.ComponentTransform);


    tyreFL.mtxLocal.scale(f.Vector3.ONE(0.5));
    tyreFL.mtxLocal.translate(new f.Vector3(0, 0.6, 0));

    tyreFR.mtxLocal.scale(f.Vector3.ONE(0.5));
    tyreFR.mtxLocal.translate(new f.Vector3(0, -0.6, 0));

    tyreBR.mtxLocal.scale(f.Vector3.ONE(0.5));
    tyreBR.mtxLocal.translate(new f.Vector3(0, -0.6, 0));

    tyreBL.mtxLocal.scale(f.Vector3.ONE(0.5));
    tyreBL.mtxLocal.translate(new f.Vector3(0, 0.6, 0));

    FL = new f.Node("FL");
    FL.addComponent(new f.ComponentTransform());
    FR = new f.Node("FR");
    FR.addComponent(new f.ComponentTransform());
    BR = new f.Node("BR");
    BR.addComponent(new f.ComponentTransform());
    BL = new f.Node("BL");
    BL.addComponent(new f.ComponentTransform());

    controlled.setUpAxis();

    const myHeightMapFunction: f.HeightMapFunction = function (x: number, y: number): number {
      return Math.sin(x * y * Math.PI * 2) * 0.2;
    };

    viewport = new f.Viewport();
    // viewport.addEventListener(f.EVENT_KEYBOARD.DOWN, moreVertices);
    cmpCamera = Scenes.createCamera(new f.Vector3(0, 2, 3.5), new f.Vector3(0, 0, 0));

    heightMap = new ƒ.TextureImage();
    await heightMap.load("../Textures/map.png");

    gridMeshFlat = new f.MeshTerrain("HeightMap", heightMap);
    gridFlat = Scenes.createCompleteMeshNode("Grid", matTex, gridMeshFlat);
    gridMeshFlat.node = gridFlat;
    gridFlat.mtxLocal.translateY(-0.1)

    gridFlat.mtxLocal.scale(new f.Vector3(3, 0.7, 3))

    water = Scenes.createCompleteMeshNode("Water", matWater, meshPlane);
    water.mtxLocal.rotateX(-90);
    water.mtxLocal.scale(new f.Vector3(3, 3, 1));

    finish = Scenes.createCompleteMeshNode("Finish", matFinish, meshPlane);
    finish.mtxLocal.translation = new f.Vector3(-0.69969, 0.25512, 0.70381);
    finish.mtxLocal.rotateX(-90);
    finish.mtxLocal.scale(new f.Vector3(0.2, 0.2, 1));

    controlled.meshTerrain = gridMeshFlat;
    controlled.terrain = gridFlat;

    let front: f.Node = new fAid.NodeCoordinateSystem("Test2", f.Matrix4x4.IDENTITY());
    front.mtxLocal.scale(f.Vector3.ONE(2));
    let rear: f.Node = new fAid.NodeCoordinateSystem("Test2", f.Matrix4x4.IDENTITY());
    rear.mtxLocal.scale(f.Vector3.ONE(2));

    graph.addChild(gridFlat);
    graph.addChild(controlled);
    graph.addChild(water);
    graph.addChild(finish);
    controlled.addChild(frontAxis);
    controlled.addChild(rearAxis);
    controlled.addChild(chassis);

    rearAxis.addChild(rear)
    frontAxis.addChild(front)

    frontAxis.addChild(tyreFL);
    frontAxis.addChild(tyreFR);
    rearAxis.addChild(tyreBR);
    rearAxis.addChild(tyreBL);

    tyreFL.addChild(tyreRotationFL);
    tyreFR.addChild(tyreRotationFR);
    tyreBR.addChild(tyreRotationBR);
    tyreBL.addChild(tyreRotationBL);

    controlled.addChild(FL);
    controlled.addChild(FR);
    controlled.addChild(BR);
    controlled.addChild(BL);

    viewport.initialize("Viewport", graph, cmpCamera, document.querySelector("canvas"));
    viewport.setFocus(true);
    Scenes.dollyViewportCamera(viewport);

    viewport.draw();

    FL.mtxLocal.translation = f.Vector3.TRANSFORMATION(tyreFL.mtxWorld.translation, controlled.mtxWorldInverse);
    FR.mtxLocal.translation = f.Vector3.TRANSFORMATION(tyreFR.mtxWorld.translation, controlled.mtxWorldInverse);
    BR.mtxLocal.translation = f.Vector3.TRANSFORMATION(tyreBR.mtxWorld.translation, controlled.mtxWorldInverse);
    BL.mtxLocal.translation = f.Vector3.TRANSFORMATION(tyreBL.mtxWorld.translation, controlled.mtxWorldInverse);

    FL.mtxLocal.translateZ(-0.025)
    FR.mtxLocal.translateZ(-0.025)
    BR.mtxLocal.translateZ(-0.025)
    BL.mtxLocal.translateZ(-0.025)

    viewport.draw();
  }

  // function moreVertices(_event: KeyboardEvent): void {
  //   if (_event.code == f.KEYBOARD_CODE.M) {

  //     gridMeshFlat.resolutionX = gridMeshFlat.resolutionX + 1;
  //     gridMeshFlat.resolutionZ = gridMeshFlat.resolutionZ + 1;

  //     gridMeshFlat.create();
  //     gridMeshFlat.createRenderBuffers();

  //     console.log(gridMeshFlat.resolutionX);
  //   }

  //   if (_event.code == f.KEYBOARD_CODE.N) {

  //     gridMeshFlat.resolutionX = gridMeshFlat.resolutionX - 1;
  //     gridMeshFlat.resolutionZ = gridMeshFlat.resolutionZ - 1;

  //     gridMeshFlat.create();
  //     gridMeshFlat.createRenderBuffers();

  //     console.log(gridMeshFlat.resolutionX);
  //   }

  // }

  function setupControls(): void {
    controlled.axisSpeed.addControl(cntKeyVertical);
    controlled.axisRotation.addControl(cntKeyHorizontal);
  }

  function hndKeyboardControls(): void {

    cntKeyVertical.setInput(
      f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.W])
      + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.S])
    );
    cntKeyHorizontal.setInput(
      f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.A])
      + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.D])
    );
  }
}