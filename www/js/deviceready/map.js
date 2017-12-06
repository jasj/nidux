var map;
function onDeviceReady_mp(){
	 var div = document.getElementById("map_canvas");
	// Initialize the map view
	map = plugin.google.maps.Map.getMap(div);
  // Wait until the map is ready status.
  map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
}
