import axios from "axios";

export const EsInstance = axios.create({
    baseURL: 'http://8.210.10.16:9200/goods/_search',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    timeout: 20000,
});
export async function getRepoById(id){
    const requestBody = {
        "query": {
            "term": {
            "id": id
            }
  }
    };
    try{
        const res = await EsInstance.request({
        method: 'post',
        data: requestBody
        })
        return parseJsonConfigFileContent(res.data.hits.hits[0]);
        
    }catch(error){
        console.log("error while searching repo",error);
        return null;
    }
    
}