"use strict";
var HeightMap;
(function (HeightMap) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Controlled extends ƒAid.Node {
        constructor() {
            super(...arguments);
            this.axisSpeed = new ƒ.Axis("Speed", 1, 0 /* PROPORTIONAL */);
            this.axisRotation = new ƒ.Axis("Rotation", 1, 0 /* PROPORTIONAL */);
            this.maxSpeed = 5; // units per second
            this.maxRotSpeed = 180; // degrees per second
        }
        setUpAxis() {
            this.axisSpeed.setDelay(500);
            this.axisRotation.setDelay(200);
        }
        update(_timeFrame) {
            let distance = this.axisSpeed.getOutput() * this.maxSpeed * _timeFrame;
            let angle = this.axisRotation.getOutput() * this.maxRotSpeed * _timeFrame;
            this.mtxLocal.translateZ(distance);
            this.mtxLocal.translation = new ƒ.Vector3(this.mtxLocal.translation.x, this.height, this.mtxLocal.translation.z);
            this.mtxLocal.rotateY(angle);
        }
    }
    HeightMap.Controlled = Controlled;
})(HeightMap || (HeightMap = {}));
