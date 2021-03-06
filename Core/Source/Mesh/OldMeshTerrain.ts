namespace FudgeCore {

  /** This function type takes x and z as Parameters and returns a number - to be used as a heightmap. 
   * x and z are mapped from 0 to 1 when used to generate a Heightmap Mesh
   * x * z * 2 represent the amout of faces whiche are created. As a result you get 1 Vertice more in each direction (x and z achsis)
   * For Example: x = 4, z = 4, 16 squares (32 Faces), 25 vertices 
   * @authors Simon Storl-Schulke, HFU, 2020*/
  export type OldHeightMapFunction = (x: number, z: number) => number;

  /**
   * Generates a planar Grid and applies a Heightmap-Function to it.
   * @authors Jirka Dell'Oro-Friedl, Simon Storl-Schulke, HFU, 2020
   */
  export class OldMeshTerrain extends Mesh {
    public static readonly iSubclass: number = Mesh.registerSubclass(MeshTerrain);

    public resolutionX: number;
    public resolutionZ: number;
    public imgScale: number = 800;
    public node: Node;
    private heightMapFunction: HeightMapFunction;
    private image: TextureImage;
    
    public constructor(_name: string = "MeshHeightMap", source?: HeightMapFunction | TextureImage, _resolutionX: number = 16, _resolutionZ: number = 16) {
      super(_name);
      this.resolutionX = _resolutionX;
      this.resolutionZ = _resolutionZ;

      if (_resolutionZ || _resolutionX <= 0) {
        Debug.warn("HeightMap Mesh cannot have resolution values < 1. ");
        this.resolutionX = Math.max(1, this.resolutionX);
        this.resolutionZ = Math.max(1, this.resolutionZ);
      }

      if (! (source instanceof TextureImage)) {
        this.heightMapFunction = source;
        this.image = null;
      }
      else this.heightMapFunction = null;

      if (source instanceof TextureImage){
        this.image = source;
        this.resolutionX = source.image.width - 1;
        this.resolutionZ = source.image.height - 1;
      }
      else this.image = null;

      this.create();
    }
    
    

    protected createVertices(): Float32Array {
      let vertices: Float32Array = new Float32Array((this.resolutionX + 1) * (this.resolutionZ + 1) * 3);

      if(this.heightMapFunction != null){
        //Iterate over each cell to generate grid of vertices
        for (let i: number = 0, z: number = 0; z <= this.resolutionZ; z++) {
          for (let x: number = 0; x <= this.resolutionX; x++) {
            // X
            vertices[i] = x / this.resolutionX - 0.5;
            // Apply heightmap to y coordinate
            vertices[i + 1] = this.heightMapFunction(x / this.resolutionX, z / this.resolutionZ);
            // Z
            vertices[i + 2] = z / this.resolutionZ - 0.5;
            i += 3;
          }
        }
        return vertices;
      }
      else if( this.image != null){
        let imgArray = this.imageToClampedArray(this.image);
        // console.log(imgArray);
        let px = 0;

        for (let i: number = 0, z: number = 0; z <= this.resolutionZ; z++) {
          for (let x: number = 0; x <= this.resolutionX; x++) {
            // X
            vertices[i] = x / this.resolutionX - 0.5;
            // Apply heightmap to y coordinate
            vertices[i + 1] = imgArray[px*4] / this.imgScale;
            // Z
            vertices[i + 2] = z / this.resolutionZ - 0.5;
            i += 3;
            px++;
          }
        }
        // console.log("resx: " + this.resolutionX + " resz: " + this.resolutionZ);

        return vertices;

      }
      else {
        throw new Error("No Source for Vertices is given, must be function or image"); 
      }
    }

    protected createIndices(): Uint16Array {
      let vert: number = 0;
      let tris: number = 0;

      let indices = new Uint16Array(this.resolutionX * this.resolutionZ * 6);

      let switchOrientation: Boolean = false;

      for (let z: number = 0; z < this.resolutionZ; z++) {
        for (let x: number = 0; x < this.resolutionX; x++) {

          if (!switchOrientation){
            // First triangle of each uneven grid-cell
            indices[tris + 0] = vert + 0;
            indices[tris + 1] = vert + this.resolutionX + 1;
            indices[tris + 2] = vert + 1;

            // Second triangle of each uneven grid-cell
            indices[tris + 3] = vert + 1;
            indices[tris + 4] = vert + this.resolutionX + 1;
            indices[tris + 5] = vert + this.resolutionX + 2;
          }
          else {
            // First triangle of each even grid-cell
            indices[tris + 0] = vert + 0;
            indices[tris + 1] = vert + this.resolutionX + 1;
            indices[tris + 2] = vert + this.resolutionX + 2;

            // Second triangle of each even grid-cell
            indices[tris + 3] = vert + 0;
            indices[tris + 4] = vert + this.resolutionX + 2;
            indices[tris + 5] = vert + 1;
          }

          switchOrientation = !switchOrientation;
          vert++;
          tris += 6;
        }
        if(this.resolutionX % 2 == 0)
          switchOrientation = !switchOrientation;
        vert++;
      }
      return indices;
    }

    protected createTextureUVs(): Float32Array {
      let textureUVs: Float32Array = new Float32Array(this.indices.length * 2);

      for (let i: number = 0, z: number = 0; z <= this.resolutionZ; z++) {
        for (let x: number = 0; x <= this.resolutionX; x++) {
          textureUVs[i] = x / this.resolutionX;
          textureUVs[i + 1] = z / this.resolutionZ;
          i += 2;
        }
      }
      return textureUVs;
    }

    protected createFaceNormals(): Float32Array {
      return this.calculateFaceNormals();
    }

    protected imageToClampedArray(image: TextureImage): Uint8ClampedArray{
      let trImport: Uint8ClampedArray;
    
      let canvasImage: HTMLCanvasElement = document.createElement("canvas");
      canvasImage.width = image.image.width;
      canvasImage.height = image.image.height;

      let crcTransition: CanvasRenderingContext2D = canvasImage.getContext("2d");
      crcTransition.imageSmoothingEnabled = false;
      crcTransition.drawImage(image.image, 0, 0);

      trImport = crcTransition.getImageData(0, 0, image.image.width, image.image.height).data;

      return trImport;
    }

    public getPositionOnTerrain(object: Node): Ray{
      
      let relPosObject = Vector3.DIFFERENCE(object.mtxWorld.translation, this.node.mtxWorld.translation);
      
      relPosObject = Vector3.TRANSFORMATION(relPosObject, this.node.mtxWorldInverse, false);

      let nearestFace: distanceToFaceVertices = this.findNearestFace(relPosObject);
      let ray = new Ray;

      let origin = new Vector3( object.mtxWorld.translation.x, this.calculateHeight(nearestFace, relPosObject), object.mtxWorld.translation.z);
      origin = Vector3.TRANSFORMATION(origin, this.node.mtxWorld, false);

      let direction = nearestFace.faceNormal;
      direction = Vector3.TRANSFORMATION(direction, this.node.mtxWorld, false);
  
      ray.origin = origin
      ray.direction = nearestFace.faceNormal;
  
      return ray;
    }
  
    private calculateHeight (face: distanceToFaceVertices, relativePosObject: Vector3): number{

      // m1.mtxLocal.translation = face.vertexONE;
      // m2.mtxLocal.translation = face.vertexTWO;
      // m3.mtxLocal.translation = face.vertexTHREE;
  
      let ray = new Ray(new Vector3(0,1,0), relativePosObject);
      
      let intersection = ray.intersectPlane(face.vertexONE, face.faceNormal);
  
      return intersection.y;
    }
  
    private findNearestFace(relativPosObject: Vector3): distanceToFaceVertices{
      let vertices = this.vertices;
      let indices = this.indices;
  
      let nearestFaces: Array<distanceToFaceVertices> = new Array;
  
      for(let i = 0; i < indices.length; i = i+3){
        let vertexONE = new Vector3(vertices[indices[i]*3], vertices[indices[i]*3+1],vertices[indices[i]*3+2]);
        let vertexTWO = new Vector3(vertices[indices[i+1]*3], vertices[indices[i+1]*3+1],vertices[indices[i+1]*3+2]);
        let vertexTHREE = new Vector3(vertices[indices[i+2]*3], vertices[indices[i+2]*3+1],vertices[indices[i+2]*3+2]);
        
        let face = new distanceToFaceVertices(vertexONE, vertexTWO, vertexTHREE, relativPosObject);
        
        nearestFaces.push(face);
      }
  
      nearestFaces.sort((n1,n2) => {
        return n1.distance - n2.distance;
      });
  
      return nearestFaces[0];
  
    }
  }
  
  class distanceToFaceVertices {
    public vertexONE: Vector3;
    public vertexTWO: Vector3;
    public vertexTHREE: Vector3;

    public distanceONE: number;
    public distanceTWO: number;
    public distanceTHREE: number;

    public distance: number;

    public faceNormal: Vector3;

    public constructor(vertexONE: Vector3, vertexTWO: Vector3, vertexTHREE: Vector3, relativPosObject: Vector3){
      this.vertexONE = vertexONE;
      this.vertexTWO = vertexTWO;
      this.vertexTHREE = vertexTHREE;
      
      this.distanceONE = new Vector2(vertexONE.x - relativPosObject.x, vertexONE.z - relativPosObject.z).magnitude;
      this.distanceTWO = new Vector2(vertexTWO.x - relativPosObject.x, vertexTWO.z - relativPosObject.z).magnitude;
      this.distanceTHREE = new Vector2(vertexTHREE.x - relativPosObject.x, vertexTHREE.z - relativPosObject.z).magnitude;

      this.distance = this.distanceONE + this.distanceTWO + this.distanceTHREE; 

      this.calculateFaceNormal();

    }

    public calculateFaceNormal(){
      let v1 = Vector3.DIFFERENCE(this.vertexTWO, this.vertexONE);
      let v2 = Vector3.DIFFERENCE(this.vertexTHREE, this.vertexONE);

      this.faceNormal = Vector3.CROSS(v1, v2);
    }
  }
}