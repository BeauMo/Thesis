var ScreenToRay;
(function (ScreenToRay) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", init);
    let uiMaps = {};
    let uiClient;
    let menu;
    let canvas;
    let viewport = new ƒ.Viewport();
    let cmpCamera;
    let uiCamera;
    let mouse = new ƒ.Vector2();
    let viewportRay = new ƒ.Viewport();
    let cameraRay;
    let canvasRay;
    let cursor = new ƒAid.Node("Cursor", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(0.1)), new ƒ.Material("Cursor", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("darkgray"))), new ƒ.MeshSphere("Cursor", 5, 5));
    function init() {
        // create asset
        let root = new ƒ.Node("Root");
        let cosys = new ƒAid.NodeCoordinateSystem("CoSys", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(100)));
        // graph.addComponent(new ƒ.ComponentTransform());
        cosys.getChildrenByName("ArrowBlue")[0].mtxLocal.rotateZ(45, true);
        cosys.getChildrenByName("ArrowBlue")[0].getChildrenByName("ArrowBlueShaft")[0].getComponent(ƒ.ComponentMaterial).clrPrimary.a = 0.5; // = ƒ.Color.CSS("white", 0.9);
        // root.appendChild(cosys);
        root.appendChild(cursor);
        let object = new ƒAid.Node("Object", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(2)), new ƒ.Material("Object", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("red"))), 
        // new ƒ.MeshCube("Object")
        new ƒ.MeshSphere("Object", 15, 15));
        root.appendChild(object);
        // initialize viewports
        canvas = document.querySelector("canvas#viewport");
        cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translation = new ƒ.Vector3(1, 2, 3);
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        viewport.initialize(canvas.id, root, cmpCamera, canvas);
        canvas.addEventListener("mousemove", setCursorPosition);
        canvasRay = document.querySelector("canvas#ray");
        cameraRay = new ƒ.ComponentCamera();
        cameraRay.pivot.translation = new ƒ.Vector3(1, 2, 3);
        cameraRay.projectCentral(1, 10);
        viewportRay.initialize("ray", root, cameraRay, canvasRay);
        viewportRay.adjustingFrames = true;
        menu = document.getElementsByTagName("div")[0];
        menu.innerHTML = "Test automatic rectangle transformation. Adjust CSS-Frame and framings";
        uiCamera = new UI.Camera();
        menu.appendChild(uiCamera);
        appendUIScale(menu, "DestinationToSource", viewport.frameDestinationToSource);
        appendUIComplex(menu, "CanvasToDestination", viewport.frameCanvasToDestination);
        appendUIScale(menu, "ClientToCanvas", viewport.frameClientToCanvas);
        uiClient = new UI.Rectangle("ClientRectangle");
        uiClient.addEventListener("input", hndChangeOnClient);
        menu.appendChild(uiClient);
        menu.appendChild(new UI.Point("Client"));
        menu.appendChild(new UI.Point("Canvas"));
        menu.appendChild(new UI.Point("Destination"));
        menu.appendChild(new UI.Point("Source"));
        menu.appendChild(new UI.Point("Render"));
        menu.appendChild(new UI.Point("Projection"));
        update();
        uiCamera.addEventListener("input", hndChangeOnCamera);
        setCamera();
        viewport.adjustingFrames = true;
        logMutatorInfo("Camera", cmpCamera);
        for (let name in uiMaps) {
            logMutatorInfo(name, uiMaps[name].framing);
        }
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, animate);
        ƒ.Loop.start();
        function animate(_event) {
            update();
            viewport.draw();
            adjustRayCamera();
            pick();
        }
    }
    function pick() {
        cursor.getComponent(ƒ.ComponentMesh).activate(false);
        let picks = ƒ.Picker.pickViewport(viewport, mouse);
        cursor.getComponent(ƒ.ComponentMesh).activate(true);
        picks.sort((a, b) => a.zBuffer < b.zBuffer ? -1 : 1);
        let output = document.querySelector("output");
        output.innerHTML = "";
        for (let pick of picks) {
            output.innerHTML += "Name: " + pick.node.name + ", z: " + pick.zBuffer.toFixed(2) + "<br/>";
            output.innerHTML += "luminance: " + pick.luminance.toFixed(2) + ", alpha: " + pick.alpha.toFixed(2) + "<br/>";
            output.innerHTML += "posWorld: " + pick.posWorld.toString() + "<br/>";
            output.innerHTML += "posMesh: " + pick.posMesh.toString() + "<br/>";
            output.innerHTML += "normal: " + pick.normal.toString() + "<br/>";
        }
        if (picks.length) {
            cursor.mtxLocal.translation = picks[0].posWorld;
        }
    }
    function adjustRayCamera() {
        let ray = computeRay();
        ray.direction.transform(cmpCamera.pivot);
        // console.log("Compute", ray.toString());
        cameraRay.pivot.lookAt(ray.direction);
        cameraRay.projectCentral(1, 5);
        viewportRay.draw();
        let crcRay = canvasRay.getContext("2d");
        crcRay.translate(crcRay.canvas.width / 2, crcRay.canvas.height / 2);
        crcRay.strokeStyle = "white";
        crcRay.strokeRect(-10, -10, 20, 20);
    }
    function computeRay() {
        // let posMouse: ƒ.Vector2 = ƒ.Vector2.DIFFERENCE(mouse, new ƒ.Vector2(rect.width / 2, rect.height / 2));
        // posMouse.y *= -1;
        let posMouse = mouse.copy;
        setUiPoint("Client", posMouse);
        let posRender = viewport.pointClientToRender(posMouse);
        setUiPoint("Render", posRender);
        let rect = viewport.getClientRectangle();
        let result;
        result = viewport.frameClientToCanvas.getPoint(posMouse, rect);
        setUiPoint("Canvas", result);
        rect = viewport.getCanvasRectangle();
        result = viewport.frameCanvasToDestination.getPoint(result, rect);
        setUiPoint("Destination", result);
        result = viewport.frameDestinationToSource.getPoint(result, viewport.rectSource);
        setUiPoint("Source", result);
        //TODO: when Source, Render and RenderViewport deviate, continue transformation 
        let posProjection = viewport.pointClientToProjection(posMouse);
        let rectProjection = cmpCamera.getProjectionRectangle();
        setUiPoint("Projection", posProjection);
        let ray = new ƒ.Ray(new ƒ.Vector3(-posProjection.x, posProjection.y, 1));
        // let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);
        return ray;
    }
    function setCursorPosition(_event) {
        mouse = new ƒ.Vector2(_event.clientX, _event.clientY);
    }
    function setUiPoint(_name, _point) {
        let uiPoint;
        uiPoint = menu.querySelector("fieldset[name=" + _name + "]");
        uiPoint.set(_point.getMutator());
    }
    function logMutatorInfo(_title, _mutable) {
        let mutator = _mutable.getMutator();
        let types = _mutable.getMutatorAttributeTypes(mutator);
        console.group(_title);
        console.log("Types: ", types);
        console.log("Mutator: ", mutator);
        console.groupEnd();
    }
    function appendUIComplex(_parent, _name, _framing) {
        let uiMap = new UI.FramingComplex(_name);
        uiMap.addEventListener("input", hndChangeOnComplex);
        _parent.appendChild(uiMap);
        uiMaps[_name] = { ui: uiMap, framing: _framing };
    }
    function appendUIScale(_parent, _name, _framing) {
        let uiMap = new UI.FramingScaled(_name);
        uiMap.addEventListener("input", hndChangeOnScale);
        _parent.appendChild(uiMap);
        uiMaps[_name] = { ui: uiMap, framing: _framing };
    }
    function hndChangeOnComplex(_event) {
        let target = _event.currentTarget;
        setRectComplex(target);
    }
    function hndChangeOnScale(_event) {
        let target = _event.currentTarget;
        setRectScale(target);
    }
    function hndChangeOnCamera(_event) {
        //let target: UI.Rectangle = <UI.Rectangle>_event.currentTarget;
        setCamera();
    }
    function hndChangeOnClient(_event) {
        let target = _event.currentTarget;
        setClient(target);
    }
    function setRectComplex(_uiMap) {
        let value = _uiMap.get();
        let framing = uiMaps[_uiMap.name].framing;
        for (let key in value) {
            switch (key) {
                case "Margin":
                    framing.margin = value[key];
                    break;
                case "Padding":
                    framing.padding = value[key];
                    break;
                case "Result":
                    break;
                default:
                    throw (new Error("Invalid name: " + key));
            }
        }
    }
    function setRectScale(_uiMap) {
        let value = _uiMap.get();
        let framing = uiMaps[_uiMap.name].framing;
        framing.setScale(value.normWidth, value.normHeight);
    }
    function setCamera() {
        let params = uiCamera.get();
        cmpCamera.projectCentral(params.aspect, params.fieldOfView); //, ƒ.FIELD_OF_VIEW.HORIZONTAL);
    }
    function setClient(_uiRectangle) {
        let rect = _uiRectangle.get();
        canvas.style.left = rect.x + "px";
        canvas.style.top = rect.y + "px";
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
    }
    function update() {
        for (let name in uiMaps) {
            // uiMap.ui.set({ Margin: uiMap.map.margin, Padding: uiMap.map.padding });
            switch (name) {
                case "ClientToCanvas": {
                    let uiMap = uiMaps[name];
                    uiMap.ui.set(uiMap.framing);
                    uiMap.ui.set({ Result: viewport.getCanvasRectangle() });
                    break;
                }
                case "CanvasToDestination": {
                    let uiMap = uiMaps[name];
                    uiMap.ui.set({ Margin: uiMap.framing.margin, Padding: uiMap.framing.padding });
                    uiMap.ui.set({ Result: viewport.rectDestination });
                    break;
                }
                case "DestinationToSource": {
                    let uiMap = uiMaps[name];
                    uiMap.ui.set(uiMap.framing);
                    uiMap.ui.set({ Result: viewport.rectSource });
                    break;
                }
            }
        }
        let clientRect = canvas.getBoundingClientRect();
        uiClient.set(ƒ.Rectangle.GET(clientRect.left, clientRect.top, clientRect.width, clientRect.height));
        uiCamera.set({ aspect: cmpCamera.getAspect(), fieldOfView: cmpCamera.getFieldOfView() });
    }
})(ScreenToRay || (ScreenToRay = {}));
//# sourceMappingURL=ScreenToRay.js.map