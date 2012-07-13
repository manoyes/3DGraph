var mouseOverColor = Color.blue;
private var originalColor : Color;
private var isInside : boolean;
private var windowRect : Rect;
private var descriptionRect : Rect;

function Start () {
	originalColor = renderer.sharedMaterial.color;
	isInside = false;
	windowRect = Rect(0, Screen.height * 3 / 4, Screen.width, Screen.height / 4);
	descriptionRect = Rect(25, Screen.height * 3 / 4, Screen.width, Screen.height / 4);
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

function OnMouseDown () {
	var screenSpace = Camera.main.WorldToScreenPoint(transform.position);
	var offset = transform.position - Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, screenSpace.z));
	while (Input.GetMouseButton(0))
	{
		var curScreenSpace = Vector3(Input.mousePosition.x, Input.mousePosition.y, screenSpace.z);
		var curPosition = Camera.main.ScreenToWorldPoint(curScreenSpace) + offset;
		transform.position = curPosition;
		yield;
	}
}