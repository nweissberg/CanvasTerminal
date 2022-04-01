export class obj3D{
	constructor(attr = {}){
		this.attr 	= attr
		this.name 	= ( this.attr["name"] ) ? this.attr["name"] : "obj3D_" + uid();
		this.pos 	= ( this.attr["pos"] ) 	? (( this.attr["pos"].clone ) ? this.attr["pos"].clone() : new THREE.Vector3(this.attr["pos"].x,this.attr["pos"].y,this.attr["pos"].z) ) : new THREE.Vector3(0,0,0);
		this.scn 	= ( this.attr["scn"] ) 	? this.attr["scn"] : MCM.values().next().value;
		MOM.set(this.name, this)
	}
}
export function rotateAroundPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}