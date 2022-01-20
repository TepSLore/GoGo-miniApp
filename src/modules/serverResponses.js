

class serverResponses{
url = "https://backendnew-timurmikolenko.vercel.app:443/"

getData(resp_target){
    const [data, setData] = useState([]);

    fetch(this.url + resp_target)
      .then((response) => response.json())
      .then(response => setData(response.posts_data))

    return data;
};

pushData(data, resp_target){
    try {
        const response = await fetch(this.url + resp_target, {
          method: 'POST', // или 'PUT'
          body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json();
        console.log('Успех:', JSON.stringify(json));
    } catch (error) {
        console.error('Ошибка:', error);
    };
};

};
