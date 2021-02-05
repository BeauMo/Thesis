// / <reference path="Component.ts"/>
namespace FudgeCore {
  export enum FIELD_OF_VIEW {
    HORIZONTAL, VERTICAL, DIAGONAL
  }
  /**
   * Defines identifiers for the various projections a camera can provide.  
   * TODO: change back to number enum if strings not needed
   */
  export enum PROJECTION {
    CENTRAL = "central",
    ORTHOGRAPHIC = "orthographic",
    DIMETRIC = "dimetric",
    STEREO = "stereo"
  }
  /**
   * The camera component holds the projection-matrix and other data needed to render a scene from the perspective of the node it is attached to.
   * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
   */
  export class ComponentCamera extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentCamera);
    public pivot: Matrix4x4 = Matrix4x4.IDENTITY();
    public backgroundColor: Color = new Color(0, 0, 0, 1); // The color of the background the camera will render.
    //private orthographic: boolean = false; // Determines whether the image will be rendered with perspective or orthographic projection.
    private projection: PROJECTION = PROJECTION.CENTRAL;
    private transform: Matrix4x4 = new Matrix4x4; // The matrix to multiply each scene objects transformation by, to determine where it will be drawn.
    private fieldOfView: number = 45; // The camera's sensorangle.
    private aspectRatio: number = 1.0;
    private direction: FIELD_OF_VIEW = FIELD_OF_VIEW.DIAGONAL;
    private near: number = 1;
    private far: number = 2000;
    private backgroundEnabled: boolean = true; // Determines whether or not the background of this camera will be rendered.
    // TODO: examine, if background should be an attribute of Camera or Viewport

    /**
     * Returns the multiplikation of the worldtransformation of the camera container with the projection matrix
     * @returns the world-projection-matrix
     */
    public get ViewProjectionMatrix(): Matrix4x4 {
      //TODO: optimize, no need to recalculate if neither mtxWorld nor pivot have changed
      let mtxCamera: Matrix4x4 = this.pivot;
      try {
        mtxCamera = Matrix4x4.MULTIPLICATION(this.getContainer().mtxWorld, this.pivot);
      } catch (_error) {
        // no container node or no world transformation found -> continue with pivot only
      }
      let mtxWorldProjection: Matrix4x4 = Matrix4x4.INVERSION(mtxCamera);
      mtxWorldProjection = Matrix4x4.MULTIPLICATION(this.transform, mtxWorldProjection);
      return mtxWorldProjection;
    }

    public getProjection(): PROJECTION {
      return this.projection;
    }

    public getBackgroundEnabled(): boolean {
      return this.backgroundEnabled;
    }

    public getAspect(): number {
      return this.aspectRatio;
    }

    public getFieldOfView(): number {
      return this.fieldOfView;
    }

    public getDirection(): FIELD_OF_VIEW {
      return this.direction;
    }

    public getNear(): number  {
      return this.near;
    }
    public getFar(): number  {
      return this.far;
    }

    /**
     * Set the camera to perspective projection. The world origin is in the center of the canvaselement.
     * @param _aspect The aspect ratio between width and height of projectionspace.(Default = canvas.clientWidth / canvas.ClientHeight)
     * @param _fieldOfView The field of view in Degrees. (Default = 45)
     * @param _direction The plane on which the fieldOfView-Angle is given 
     */
    public projectCentral(_aspect: number = this.aspectRatio, _fieldOfView: number = this.fieldOfView, _direction: FIELD_OF_VIEW = this.direction, _near: number = 1, _far: number = 2000): void {
      this.aspectRatio = _aspect;
      this.fieldOfView = _fieldOfView;
      this.direction = _direction;
      this.projection = PROJECTION.CENTRAL;
      this.near = _near;
      this.far = _far;
      this.transform = Matrix4x4.PROJECTION_CENTRAL(_aspect, this.fieldOfView, _near, _far, this.direction); // TODO: remove magic numbers
    }
    /**
     * Set the camera to orthographic projection. The origin is in the top left corner of the canvas.
     * @param _left The positionvalue of the projectionspace's left border. (Default = 0)
     * @param _right The positionvalue of the projectionspace's right border. (Default = canvas.clientWidth)
     * @param _bottom The positionvalue of the projectionspace's bottom border.(Default = canvas.clientHeight)
     * @param _top The positionvalue of the projectionspace's top border.(Default = 0)
     */
    public projectOrthographic(_left: number = 0, _right: number = Render.getCanvas().clientWidth, _bottom: number = Render.getCanvas().clientHeight, _top: number = 0): void {
      this.projection = PROJECTION.ORTHOGRAPHIC;
      this.transform = Matrix4x4.PROJECTION_ORTHOGRAPHIC(_left, _right, _bottom, _top, 400, -400); // TODO: examine magic numbers!
    }

    /**
     * Return the calculated normed dimension of the projection surface, that is in the hypothetical distance of 1 to the camera
     */
    public getProjectionRectangle(): Rectangle {
      let tanFov: number = Math.tan(Math.PI * this.fieldOfView / 360); // Half of the angle, to calculate dimension from the center -> right angle
      let tanHorizontal: number = 0;
      let tanVertical: number = 0;

      if (this.direction == FIELD_OF_VIEW.DIAGONAL) {
        let aspect: number = Math.sqrt(this.aspectRatio);
        tanHorizontal = tanFov * aspect;
        tanVertical = tanFov / aspect;
      }
      else if (this.direction == FIELD_OF_VIEW.VERTICAL) {
        tanVertical = tanFov;
        tanHorizontal = tanVertical * this.aspectRatio;
      }
      else {//FOV_DIRECTION.HORIZONTAL
        tanHorizontal = tanFov;
        tanVertical = tanHorizontal / this.aspectRatio;
      }

      return Rectangle.GET(0, 0, tanHorizontal * 2, tanVertical * 2);
    }

    public project(_pointInWorldSpace: Vector3): Vector3 {
      let result: Vector3;
      result = Vector3.TRANSFORMATION(_pointInWorldSpace, this.ViewProjectionMatrix);
      let m: Float32Array = this.ViewProjectionMatrix.get();
      let w: number = m[3] * _pointInWorldSpace.x + m[7] * _pointInWorldSpace.y + m[11] * _pointInWorldSpace.z + m[15];
      result.scale(1 / w);
      return result;
    }

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = {
        backgroundColor: this.backgroundColor,
        backgroundEnabled: this.backgroundEnabled,
        projection: this.projection,
        fieldOfView: this.fieldOfView,
        direction: this.direction,
        aspect: this.aspectRatio,
        pivot: this.pivot.serialize(),
        [super.constructor.name]: super.serialize()
      };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      this.backgroundColor = _serialization.backgroundColor;
      this.backgroundEnabled = _serialization.backgroundEnabled;
      this.projection = _serialization.projection;
      this.fieldOfView = _serialization.fieldOfView;
      this.aspectRatio = _serialization.aspect;
      this.direction = _serialization.direction;
      this.pivot.deserialize(_serialization.pivot);
      super.deserialize(_serialization[super.constructor.name]);
      switch (this.projection) {
        case PROJECTION.ORTHOGRAPHIC:
          this.projectOrthographic(); // TODO: serialize and deserialize parameters
          break;
        case PROJECTION.CENTRAL:
          this.projectCentral();
          break;
      }
      return this;
    }

    public getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes {
      let types: MutatorAttributeTypes = super.getMutatorAttributeTypes(_mutator);
      if (types.direction)
        types.direction = FIELD_OF_VIEW;
      if (types.projection)
        types.projection = PROJECTION;
      return types;
    }

    public async mutate(_mutator: Mutator): Promise<void> {
      super.mutate(_mutator);

      switch (this.projection) {
        case PROJECTION.CENTRAL:
          this.projectCentral(this.aspectRatio, this.fieldOfView, this.direction);
          break;
      }
    }

    protected reduceMutator(_mutator: Mutator): void {
      delete _mutator.transform;
      super.reduceMutator(_mutator);
    }
    //#endregion
  }
}