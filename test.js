const NodeGeocoder = require('node-geocoder');

// Создаем экземпляр класса NodeGeocoder
const geocoder = NodeGeocoder({
  provider: 'openstreetmap'
});

// Задаем координаты для поиска города
const coordinates = {
  lat: 53.90043,
  lon: 27.555744
};

// { latitude: 55.782698, longitude: 37.484573 }

// Вызываем функцию для поиска города по заданным координатам
geocoder.reverse(coordinates)
  .then(res => {
    // Выводим имя найденного города
    console.log(res[0]);
  })
  .catch(err => {
    // В случае ошибки выводим сообщение
    console.log(err);
  });


  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  
  const distanceMOWBKK = getDistanceFromLatLonInKm(
    55.45, 37.36, 43.5992, 39.7257
  )
  
  console.log(distanceMOWBKK);
  


