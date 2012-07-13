var target : Transform;
var edgeWeight : float = 5.0;
var mouseOverColor = Color.blue;
private var originalColor : Color;
private var isInside : boolean;
var windowRect : Rect;
var descriptionRect : Rect;

function Start () {
	originalColor = renderer.sharedMaterial.color;
	isInside = false;
	windowRect = Rect(0, Screen.height * 3 / 4, Screen.width, Screen.height / 4);
	descriptionRect = Rect(25, Screen.height * 3 / 4, Screen.width, Screen.height / 4);
	line = GetComponent(LineRenderer);
}

function OnGUI() {
	if (isInside) {
		GUI.Box(windowRect, gameObject.name);
		GUI.Label(descriptionRect, "This is the description for " + gameObject.name);
	}
}

function OnMouseEnter () {
	renderer.material.color = mouseOverColor;
	isInside = true;
}

function OnMouseExit () {
	renderer.material.color = originalColor;
	isInside = false;
}

private var line : LineRenderer;

function Awake() {
	useGUILayout = false;
}

function Update() {

	line.enabled = target.gameObject.active;	
	
	if (line.enabled) {
		line.SetPosition(0, transform.position);
		line.SetPosition(1, target.position);
		line.SetWidth(edgeWeight / 20, edgeWeight / 20);		
	}	
}