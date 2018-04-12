var model = {
    locations: [{
            name: 'Bilaspur',
            lat: 31.3384899,
            long: 76.7483213
        },
        {
            name: 'Sarkaghat',
            lat: 31.6998552,
            long: 76.7266248,
        },
        {
            name: 'Bir Billing',
            lat: 32.0420768,
            long: 76.7133451
        },
        {
            name: 'Sanakdeit jot',
            lat: 32.186626,
            long: 76.7607416
        },
        {
            name: 'Parvati Parvat',
            lat: 31.8320373,
            long: 76.6460718
        }
    ],
    selectedLocations: []
};

var controller = {
    init: function () {
        model.selectedLocations = model.locations;
        mapView.init();
        listView.init();
        searchView.init();
    },
    setLocations: function (filterData) {
        if (filterData) {
            model.selectedLocations = model.locations.filter(function (location) {
                return location.name.toLowerCase().indexOf(filterData.toLowerCase()) != -1;
            });

        } else {
            model.selectedLocations = model.locations;
        }

    },
    getSelectedLocations: function () {
        return model.selectedLocations;
    }
}

var mapView = {
    init: function () {

        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: new google.maps.LatLng(31.1048, 77.1734),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.markers = [];
        this.render();
    },
    render: function () {
        this.locations = controller.getSelectedLocations();
        this.deleteMarkers();
        var infowindow = new google.maps.InfoWindow();
        var marker, i;

        // this.marker ? console.dir(this.marker) : console.log('new markers');
        for (i = 0; i < this.locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.locations[i].lat, this.locations[i].long),
                map: this.map
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i, location) {
                return function () {
                    // console.log(location);
                    infowindow.setContent(location.name);
                    infowindow.open(this.map, marker);
                }
            })(marker, i, this.locations[i]));
            this.markers.push(marker);
        }

    },
    deleteMarkers: function () {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }
}

var listView = {
    init: function () {

        this.render();
    },
    render: function () {
        this.locations = controller.getSelectedLocations();
        var elemContainer = document.getElementById('list');
        elemContainer.innerHTML = '';
        var list = document.createElement('ul');

        this.locations.map(function (location, key) {
            var listItem = document.createElement('li');
            var textnode = document.createTextNode(location.name);
            listItem.appendChild(textnode);
            list.appendChild(listItem);
        });
        elemContainer.appendChild(list);
    }
}

var searchView = {
    init: function () {
        var el = document.getElementById('search');
        el.onkeyup = function () {
            // console.log("keyup: " + el.value);
            controller.setLocations(el.value);
            listView.render();
            mapView.render();
        };
    }
}

function initMap() {
    controller.init();
}