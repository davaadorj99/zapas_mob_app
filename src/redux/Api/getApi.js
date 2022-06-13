


import { ACCESS_TOKEN, API_URL } from "@common/config";
import * as RootNavigation from '../../AppNavigator';

var authHeader = new Headers();
authHeader.append("accept", "application/json");
authHeader.append("Content-Type", "multipart/form-data");
authHeader.append("token", ACCESS_TOKEN);

const getDataService = {
   

    getData: function (url) {
        return new Promise((resolve, reject) => {
            console.log('URL--------------', API_URL+url)
           
            fetch(API_URL + url,)
            .then(response =>{
               
                console.log('URL--------data oldloo------', API_URL+url)
              
                return response.json();


            }) 
            
        
            .then((json) => {
                console.log('json.status ---------------', json.status )
                console.log(json.data)
                resolve(json)
                // if (json.status == 0 && json.message == 'unauthorize') {
                //     RootNavigation.navigate('UnauthorizeScreen', {});
                // }
                // else {
                  
                //     resolve(json)
                // }
            })
            
        
                .catch(error => {
                    console.log('URL--------data oldoogui------', API_URL+url)
                    console.error(error);
                });

               
         
        });
    },

    postData: function (url, data = null) {




        return fetch(API_URL + url, {
            method: "POST",
            headers: authHeader,
    
            body: data,

        })
            .then(response => response.json())
            .then(responseJson => {
                // if (responseJson.status == 0 && responseJson.message == 'unauthorize') {
                //     RootNavigation.navigate('UnauthorizeScreen', {});
                // }
                // else {
                //     return responseJson
                // }
            })
            .catch(error => {
                console.error(error);
            });
    },

    jsonpostData: async function (url, data = null, token = null, cartToken) {

        return fetch(API_URL + url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
       
                'Content-Type': 'application/vnd.api+json',
                //  'Commerce-Cart-Token': cartToken,
                Authorization: "Bearer " + token,
            },
  
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(async responseJson => {
                return responseJson;
            })
            .catch(error => {
                
                console.error(error);
            });
    }
};
export default getDataService;
