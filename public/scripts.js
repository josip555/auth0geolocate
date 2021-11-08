let mapOptions = {
    center: [45.80101, 15.97157],
    zoom: 10
}

let map = new L.map('map', mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

let marker = new L.Marker([45.80101, 15.97157]);

if ('geolocation' in navigator) {

    navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const ts = position.timestamp;

        const data = {
            lat,
            lng,
            ts
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const res = await fetch('/locate', options);
        const json = await res.json();
        console.log(json);
        const response = JSON.parse(JSON.stringify(json));

        let latLng = [lat, lng];
        document.getElementById('sidebar_title').textContent = `Na karti je označena vaša lokacija`;
        document.getElementById('sidebar_comment').textContent = `Vaše koordinate: ${latLng}`;

        if (response.userLocations == null) {
            marker.setLatLng(latLng);
            marker.addTo(map);
            map.panTo(latLng);
        } else {
            document.getElementById('sidebar_title').textContent = `Dobrodošli ${response.nickname}!`;
            document.getElementById('sidebar_comment').textContent = `Vaše koordinate: ${latLng}`;
            document.getElementById('sidebar_comment2').textContent = `Na karti su također označene lokacije do 5 zadnjih korisnika(uključujući vas) i vrijeme kad su bili prijavljeni. Stisnite na pokazivač kako bi vidjeli detalje korisnika(username, koordinate, datum i vrijeme prijave).`
			document.getElementById('link').textContent = "Odjavi se";
            document.getElementById('link').setAttribute("href", "logout");

            let mArray = [];
            for (const e of response.userLocations) {
                let uMarker = new L.Marker([e.user_lat, e.user_lng]);
                var date = new Date(e.user_ts);
                uMarker.addTo(map);
                uMarker.bindPopup(`${`<p>${e.user_nick}</br>` + e.user_lat},${e.user_lng}</br>` + date.toLocaleDateString('hr-HR') + " " + date.toLocaleTimeString('hr-HR'));
                mArray.push(uMarker);
            }
            var group = new L.featureGroup(mArray);
            map.fitBounds(group.getBounds().pad(0.2));
        }

    });

} else {

    console.log('geolocation not available');

}