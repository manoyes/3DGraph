//
//Filename: maxCamera.cs
//
// original: http://www.unifycommunity.com/wiki/index.php?title=MouseOrbitZoom
//
// --01-18-2010 - create temporary target, if none supplied at start

var target : Transform;
var targetOffset : Vector3;
var distance : float = 5.0f;
var maxDistance : float = 20;
var minDistance : float = .6f;
var xSpeed : float = 200.0f;
var ySpeed : float = 200.0f;
var yMinLimit : int = -80;
var yMaxLimit : int = 80;
var zoomRate : int = 40;
var panSpeed : float = 0.3f;
var zoomDampening : float = 5.0f;

private var xDeg : float = 0.0f;
private var yDeg : float = 0.0f;
private var currentDistance : float;
private var desiredDistance : float;
private var currentRotation : Quaternion;
private var desiredRotation : Quaternion;
private var rotation : Quaternion;
private var position : Vector3;

function Start() { 
	Init(); 
}

function OnEnable() { 
	Init(); 
}

function Init() {

	//If there is no target, create a temporary target at 'distance' from the cameras current viewpoint
	if (!target) {
		var go : GameObject = new GameObject("Cam Target");
		go.transform.position = transform.position + (transform.forward * distance);
		target = go.transform;
	}

	distance = Vector3.Distance(transform.position, target.position);
	currentDistance = distance;
	desiredDistance = distance;
			
	//be sure to grab the current rotations as starting points.
	position = transform.position;
	rotation = transform.rotation;
	currentRotation = transform.rotation;
	desiredRotation = transform.rotation;
	
	xDeg = Vector3.Angle(Vector3.right, transform.right );
	yDeg = Vector3.Angle(Vector3.up, transform.up );
}

/*
 * Camera logic on LateUpdate to only update after all character movement logic has been handled. 
 */
function LateUpdate()
{
	// If Control and Alt and Middle button? ZOOM!
	if (Input.GetMouseButton(2) && Input.GetKey(KeyCode.LeftAlt) && Input.GetKey(KeyCode.LeftControl)) {
		desiredDistance -= Input.GetAxis("Mouse Y") * Time.deltaTime * zoomRate*0.125f * Mathf.Abs(desiredDistance);
	}
	// If middle mouse and left alt are selected? ORBIT
	else if (Input.GetMouseButton(2)) {
		xDeg += Input.GetAxis("Mouse X") * xSpeed * 0.02f;
		yDeg -= Input.GetAxis("Mouse Y") * ySpeed * 0.02f;

		////////OrbitAngle

		//Clamp the vertical axis for the orbit
		yDeg = ClampAngle(yDeg, yMinLimit, yMaxLimit);
		// set camera rotation 
		desiredRotation = Quaternion.Euler(yDeg, xDeg, 0);
		currentRotation = transform.rotation;
		
		rotation = Quaternion.Lerp(currentRotation, desiredRotation, Time.deltaTime * zoomDampening);
		transform.rotation = rotation;
	}
	// otherwise if middle mouse is selected, we pan by way of transforming the target in screenspace
	else if (Input.GetMouseButton(2))
	{
		//grab the rotation of the camera so we can move in a psuedo local XY space
		target.rotation = transform.rotation;
		target.Translate(Vector3.right * -Input.GetAxis("Mouse X") * panSpeed);
		target.Translate(transform.up * -Input.GetAxis("Mouse Y") * panSpeed, Space.World);
	}

	////////Orbit Position

	// affect the desired Zoom distance if we roll the scrollwheel
	desiredDistance -= Input.GetAxis("Mouse ScrollWheel") * Time.deltaTime * zoomRate * Mathf.Abs(desiredDistance);
	//clamp the zoom min/max
	desiredDistance = Mathf.Clamp(desiredDistance, minDistance, maxDistance);
	// For smoothing of the zoom, lerp distance
	currentDistance = Mathf.Lerp(currentDistance, desiredDistance, Time.deltaTime * zoomDampening);

	// calculate position based on the new currentDistance 
	position = target.position - (rotation * Vector3.forward * currentDistance + targetOffset);
	transform.position = position;
}

private function ClampAngle(angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp(angle, min, max);
}