const http = require('http');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./cities.json').toString());

console.log(data[0])

function geocode(name) {
    let data = '';
    return new Promise((resolve, reject) => {
        http.get('http://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(name) + '&format=json', (res) => {
            if(res.statusCode !== 200) {
                reject('STATUS CODE ' + res.statusCode + ' for ' + name)
            }
            
            res.on('data', (d) => {
                data +=d;
            });
    
            res.on('end', () => {
                resolve(data);
            })
            
        }).on('error', (e) => {
            reject(e);
        });
    })

}

Promise.all(data
    // .filter((city, index) => index < 1)
    .map(city => {
        // страна область город
        return geocode('россия ' + city[2] + ' ' + city[1])
            .then(function(data) {
                let json;

                try {
                    json = JSON.parse(data);
                } catch(e) {
                    console.log(e)
                }
                return [
                    parseInt(city[0]),
                    city[1],
                    city[2],
                    city[3],
                    parseInt(city[4]),
                    parseInt(city[5]),
                    parseFloat(json[0].lat),
                    parseFloat(json[0].lon),
                    parseInt(json[0].place_id),
                    parseInt(json[0].osm_id)
                ]
            })
            .catch(err => {
                console.log(err);
            });
})).then(res => {
    console.log(res)
    fs.writeFileSync('./coords.json', JSON.stringify(res, null, '\t'));
})
