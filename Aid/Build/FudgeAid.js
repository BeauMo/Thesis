"use strict";
/// <reference path="../../../Core/Build/FudgeCore.d.ts"/>
var FudgeAid;
/// <reference path="../../../Core/Build/FudgeCore.d.ts"/>
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class CameraOrbit extends ƒ.Node {
        constructor(_cmpCamera, _maxRotX = 75, _minDistance = 10, _maxDistance = 100) {
            super("CameraOrbit");
            this.maxRotX = Math.min(_maxRotX, 89);
            this.minDistance = _minDistance;
            this.maxDistance = _maxDistance;
            let cmpTransform = new ƒ.ComponentTransform();
            this.addComponent(cmpTransform);
            let rotatorX = new ƒ.Node("CameraRotX");
            rotatorX.addComponent(new ƒ.ComponentTransform());
            this.appendChild(rotatorX);
            rotatorX.addComponent(_cmpCamera);
            this.distance = 20;
        }
        get cmpCamera() {
            return this.rotatorX.getComponent(ƒ.ComponentCamera);
        }
        get rotatorX() {
            return this.getChildrenByName("CameraRotX")[0];
        }
        set distance(_distance) {
            let newDistance = Math.min(this.maxDistance, Math.max(this.minDistance, _distance));
            this.cmpCamera.pivot.translation = ƒ.Vector3.Z(newDistance);
        }
        get distance() {
            return this.cmpCamera.pivot.translation.z;
        }
        set rotationY(_angle) {
            this.cmpTransform.local.rotation = ƒ.Vector3.Y(_angle);
        }
        get rotationY() {
            return this.cmpTransform.local.rotation.y;
        }
        set rotationX(_angle) {
            _angle = Math.min(Math.max(-this.maxRotX, _angle), this.maxRotX);
            this.rotatorX.cmpTransform.local.rotation = ƒ.Vector3.X(_angle);
        }
        get rotationX() {
            return this.rotatorX.cmpTransform.local.rotation.x;
        }
        rotateY(_delta) {
            this.cmpTransform.local.rotateY(_delta);
        }
        rotateX(_delta) {
            this.rotationX = this.rotatorX.cmpTransform.local.rotation.x + _delta;
        }
    }
    FudgeAid.CameraOrbit = CameraOrbit;
})(FudgeAid || (FudgeAid = {}));
/// <reference path="../../../Core/Build/FudgeCore.d.ts"/>
var FudgeAid;
/// <reference path="../../../Core/Build/FudgeCore.d.ts"/>
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class NodeArrow extends ƒ.Node {
        constructor(_name, _color) {
            super(_name);
            let coat = new ƒ.CoatColored(_color);
            let material = new ƒ.Material("Arrow", ƒ.ShaderUniColor, coat);
            let meshCube = new ƒ.MeshCube();
            let meshPyramid = new ƒ.MeshPyramid();
            let shaft = new FudgeAid.NodeGeometry("Shaft", material, meshCube);
            let head = new FudgeAid.NodeGeometry("Head", material, meshPyramid);
            let mtxShaft = shaft.cmpTransform.local;
            let mtxHead = head.cmpTransform.local;
            mtxShaft.scale(new ƒ.Vector3(0.01, 1, 0.01));
            mtxHead.translateY(0.5);
            mtxHead.scale(new ƒ.Vector3(0.05, 0.1, 0.05));
            this.appendChild(shaft);
            this.appendChild(head);
            this.addComponent(new ƒ.ComponentTransform());
        }
    }
    FudgeAid.NodeArrow = NodeArrow;
})(FudgeAid || (FudgeAid = {}));
/// <reference path="../../../Core/Build/FudgeCore.d.ts"/>
var FudgeAid;
/// <reference path="../../../Core/Build/FudgeCore.d.ts"/>
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class NodeCoordinateSystem extends ƒ.Node {
        constructor() {
            super("CoordinateSystem");
            let arrowRed = new FudgeAid.NodeArrow("ArrowRed", new ƒ.Color(1, 0, 0, 1));
            let arrowGreen = new FudgeAid.NodeArrow("ArrowGreen", new ƒ.Color(0, 1, 0, 1));
            let arrowBlue = new FudgeAid.NodeArrow("ArrowBlue", new ƒ.Color(0, 0, 1, 1));
            arrowRed.cmpTransform.local.rotateZ(-90);
            arrowBlue.cmpTransform.local.rotateX(90);
            this.appendChild(arrowRed);
            this.appendChild(arrowGreen);
            this.appendChild(arrowBlue);
        }
    }
    FudgeAid.NodeCoordinateSystem = NodeCoordinateSystem;
})(FudgeAid || (FudgeAid = {}));
/// <reference path="../../../Core/Build/FudgeCore.d.ts"/>
var FudgeAid;
/// <reference path="../../../Core/Build/FudgeCore.d.ts"/>
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class NodeGeometry extends ƒ.Node {
        constructor(_name, _material, _mesh) {
            super(_name);
            this.addComponent(new ƒ.ComponentMesh(_mesh));
            this.addComponent(new ƒ.ComponentMaterial(_material));
            this.addComponent(new ƒ.ComponentTransform());
        }
    }
    FudgeAid.NodeGeometry = NodeGeometry;
})(FudgeAid || (FudgeAid = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VBaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9Tb3VyY2UvQ2FtZXJhL0NhbWVyYU9yYml0LnRzIiwiLi4vU291cmNlL0dlb21ldHJ5L05vZGVBcnJvdy50cyIsIi4uL1NvdXJjZS9HZW9tZXRyeS9Ob2RlQ29vcmRpbmF0ZVN5c3RlbS50cyIsIi4uL1NvdXJjZS9HZW9tZXRyeS9Ob2RlR2VvbWV0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDtBQUUxRCxJQUFVLFFBQVEsQ0FvRWpCO0FBdEVELDBEQUEwRDtBQUUxRCxXQUFVLFFBQVE7SUFDaEIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXJCLE1BQWEsV0FBWSxTQUFRLENBQUMsQ0FBQyxJQUFJO1FBS3JDLFlBQW1CLFVBQTZCLEVBQUUsV0FBbUIsRUFBRSxFQUFFLGVBQXVCLEVBQUUsRUFBRSxlQUF1QixHQUFHO1lBQzVILEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO1lBRWhDLElBQUksWUFBWSxHQUF5QixJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3BFLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFaEMsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFM0IsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLENB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RSxTQUFxQixFQUFFLEtBQWE7WUFDN0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLFlBQVksQ0FBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsWUFBWSxDQUFFLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUNGO0lBUFkscUJBQVksZUFPeEIsQ0FBQTtBQUNILENBQUMsRUFYUyxRQUFRLEtBQVIsUUFBUSxRQVdqQiIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9Db3JlL0J1aWxkL0Z1ZGdlQ29yZS5kLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDYW1lcmFPcmJpdCBleHRlbmRzIMaSLk5vZGUge1xyXG4gICAgcHJpdmF0ZSBtYXhSb3RYOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIG1pbkRpc3RhbmNlOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIG1heERpc3RhbmNlOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSwgX21heFJvdFg6IG51bWJlciA9IDc1LCBfbWluRGlzdGFuY2U6IG51bWJlciA9IDEwLCBfbWF4RGlzdGFuY2U6IG51bWJlciA9IDEwMCkge1xyXG4gICAgICBzdXBlcihcIkNhbWVyYU9yYml0XCIpO1xyXG5cclxuICAgICAgdGhpcy5tYXhSb3RYID0gTWF0aC5taW4oX21heFJvdFgsIDg5KTtcclxuICAgICAgdGhpcy5taW5EaXN0YW5jZSA9IF9taW5EaXN0YW5jZTtcclxuICAgICAgdGhpcy5tYXhEaXN0YW5jZSA9IF9tYXhEaXN0YW5jZTtcclxuXHJcbiAgICAgIGxldCBjbXBUcmFuc2Zvcm06IMaSLkNvbXBvbmVudFRyYW5zZm9ybSA9IG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oKTtcclxuICAgICAgdGhpcy5hZGRDb21wb25lbnQoY21wVHJhbnNmb3JtKTtcclxuXHJcbiAgICAgIGxldCByb3RhdG9yWDogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiQ2FtZXJhUm90WFwiKTtcclxuICAgICAgcm90YXRvclguYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocm90YXRvclgpO1xyXG5cclxuICAgICAgcm90YXRvclguYWRkQ29tcG9uZW50KF9jbXBDYW1lcmEpO1xyXG4gICAgICB0aGlzLmRpc3RhbmNlID0gMjA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjbXBDYW1lcmEoKTogxpIuQ29tcG9uZW50Q2FtZXJhIHtcclxuICAgICAgcmV0dXJuIHRoaXMucm90YXRvclguZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudENhbWVyYSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByb3RhdG9yWCgpOiDGki5Ob2RlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW5CeU5hbWUoXCJDYW1lcmFSb3RYXCIpWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZGlzdGFuY2UoX2Rpc3RhbmNlOiBudW1iZXIpIHtcclxuICAgICAgbGV0IG5ld0Rpc3RhbmNlOiBudW1iZXIgPSBNYXRoLm1pbih0aGlzLm1heERpc3RhbmNlLCBNYXRoLm1heCh0aGlzLm1pbkRpc3RhbmNlLCBfZGlzdGFuY2UpKTtcclxuICAgICAgdGhpcy5jbXBDYW1lcmEucGl2b3QudHJhbnNsYXRpb24gPSDGki5WZWN0b3IzLloobmV3RGlzdGFuY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZGlzdGFuY2UoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY21wQ2FtZXJhLnBpdm90LnRyYW5zbGF0aW9uLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCByb3RhdGlvblkoX2FuZ2xlOiBudW1iZXIpIHtcclxuICAgICAgdGhpcy5jbXBUcmFuc2Zvcm0ubG9jYWwucm90YXRpb24gPSDGki5WZWN0b3IzLlkoX2FuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uWSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5jbXBUcmFuc2Zvcm0ubG9jYWwucm90YXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHJvdGF0aW9uWChfYW5nbGU6IG51bWJlcikge1xyXG4gICAgICBfYW5nbGUgPSBNYXRoLm1pbihNYXRoLm1heCgtdGhpcy5tYXhSb3RYLCBfYW5nbGUpLCB0aGlzLm1heFJvdFgpO1xyXG4gICAgICB0aGlzLnJvdGF0b3JYLmNtcFRyYW5zZm9ybS5sb2NhbC5yb3RhdGlvbiA9IMaSLlZlY3RvcjMuWChfYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcm90YXRpb25YKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvdGF0b3JYLmNtcFRyYW5zZm9ybS5sb2NhbC5yb3RhdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVZKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY21wVHJhbnNmb3JtLmxvY2FsLnJvdGF0ZVkoX2RlbHRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlWChfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJvdGF0aW9uWCA9IHRoaXMucm90YXRvclguY21wVHJhbnNmb3JtLmxvY2FsLnJvdGF0aW9uLnggKyBfZGVsdGE7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL0NvcmUvQnVpbGQvRnVkZ2VDb3JlLmQudHNcIi8+XHJcblxyXG5uYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIE5vZGVBcnJvdyBleHRlbmRzIMaSLk5vZGUge1xyXG4gICAgY29uc3RydWN0b3IoX25hbWU6IHN0cmluZywgX2NvbG9yOiDGki5Db2xvcikge1xyXG4gICAgICBzdXBlcihfbmFtZSk7XHJcbiAgICAgIGxldCBjb2F0OiDGki5Db2F0Q29sb3JlZCA9IG5ldyDGki5Db2F0Q29sb3JlZChfY29sb3IpO1xyXG4gICAgICBsZXQgbWF0ZXJpYWw6IMaSLk1hdGVyaWFsID0gbmV3IMaSLk1hdGVyaWFsKFwiQXJyb3dcIiwgxpIuU2hhZGVyVW5pQ29sb3IsIGNvYXQpO1xyXG5cclxuICAgICAgbGV0IG1lc2hDdWJlOiDGki5NZXNoQ3ViZSA9IG5ldyDGki5NZXNoQ3ViZSgpO1xyXG4gICAgICBsZXQgbWVzaFB5cmFtaWQ6IMaSLk1lc2hQeXJhbWlkID0gbmV3IMaSLk1lc2hQeXJhbWlkKCk7XHJcbiAgICAgIGxldCBzaGFmdDogxpIuTm9kZSA9IG5ldyBOb2RlR2VvbWV0cnkoXCJTaGFmdFwiLCBtYXRlcmlhbCwgbWVzaEN1YmUpO1xyXG4gICAgICBsZXQgaGVhZDogxpIuTm9kZSA9IG5ldyBOb2RlR2VvbWV0cnkoXCJIZWFkXCIsIG1hdGVyaWFsLCBtZXNoUHlyYW1pZCk7XHJcbiAgICAgIGxldCBtdHhTaGFmdDogxpIuTWF0cml4NHg0ID0gc2hhZnQuY21wVHJhbnNmb3JtLmxvY2FsO1xyXG4gICAgICBsZXQgbXR4SGVhZDogxpIuTWF0cml4NHg0ID0gaGVhZC5jbXBUcmFuc2Zvcm0ubG9jYWw7XHJcbiAgICAgIG10eFNoYWZ0LnNjYWxlKG5ldyDGki5WZWN0b3IzKDAuMDEsIDEsIDAuMDEpKTtcclxuICAgICAgbXR4SGVhZC50cmFuc2xhdGVZKDAuNSk7XHJcbiAgICAgIG10eEhlYWQuc2NhbGUobmV3IMaSLlZlY3RvcjMoMC4wNSwgMC4xLCAwLjA1KSk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNoYWZ0KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChoZWFkKTtcclxuICAgICAgdGhpcy5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudFRyYW5zZm9ybSgpKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vQ29yZS9CdWlsZC9GdWRnZUNvcmUuZC50c1wiLz5cclxuXHJcbm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgTm9kZUNvb3JkaW5hdGVTeXN0ZW0gZXh0ZW5kcyDGki5Ob2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcihcIkNvb3JkaW5hdGVTeXN0ZW1cIik7XHJcbiAgICAgIGxldCBhcnJvd1JlZDogxpIuTm9kZSA9IG5ldyBOb2RlQXJyb3coXCJBcnJvd1JlZFwiLCBuZXcgxpIuQ29sb3IoMSwgMCwgMCwgMSkpO1xyXG4gICAgICBsZXQgYXJyb3dHcmVlbjogxpIuTm9kZSA9IG5ldyBOb2RlQXJyb3coXCJBcnJvd0dyZWVuXCIsIG5ldyDGki5Db2xvcigwLCAxLCAwLCAxKSk7XHJcbiAgICAgIGxldCBhcnJvd0JsdWU6IMaSLk5vZGUgPSBuZXcgTm9kZUFycm93KFwiQXJyb3dCbHVlXCIsIG5ldyDGki5Db2xvcigwLCAwLCAxLCAxKSk7XHJcblxyXG4gICAgICBhcnJvd1JlZC5jbXBUcmFuc2Zvcm0ubG9jYWwucm90YXRlWigtOTApO1xyXG4gICAgICBhcnJvd0JsdWUuY21wVHJhbnNmb3JtLmxvY2FsLnJvdGF0ZVgoOTApO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChhcnJvd1JlZCk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoYXJyb3dHcmVlbik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoYXJyb3dCbHVlKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vQ29yZS9CdWlsZC9GdWRnZUNvcmUuZC50c1wiLz5cclxuXHJcbm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgTm9kZUdlb21ldHJ5IGV4dGVuZHMgxpIuTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nLCBfbWF0ZXJpYWw6IMaSLk1hdGVyaWFsLCBfbWVzaDogxpIuTWVzaCkge1xyXG4gICAgICBzdXBlcihfbmFtZSk7XHJcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCBuZXcgxpIuQ29tcG9uZW50TWVzaChfbWVzaCkpO1xyXG4gICAgICB0aGlzLmFkZENvbXBvbmVudCggbmV3IMaSLkNvbXBvbmVudE1hdGVyaWFsKF9tYXRlcmlhbCkpO1xyXG4gICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50VHJhbnNmb3JtKCkpO1xyXG4gICAgfVxyXG4gIH1cclxufSJdfQ==