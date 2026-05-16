import http from 'https';
http.get('https://images.unsplash.com/photo-1516214349341-a1e1d0cb0ebf', (res) => {
  console.log(res.statusCode);
});
