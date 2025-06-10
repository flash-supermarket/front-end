import axios from 'axios';

export async function insertArtical(articalBody) {
  try {
    await axios.post(
      'http://8.210.10.16:9200/artical/_doc', // 索引名 + _doc + 文档ID（可省略）
      articalBody
    );
  } catch (error) {
    console.error('Error inserting Artical:', error.response?.data || error.message);
  }
}

export async function search1Artical(id) {
    const url = 'http://8.210.10.16:9200/artical/_search';

    const requestBody = {
        query: {
            // "match_all": {}
            "term": {
                "id": id
            }
        }
    };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return parseJson(response.data.hits.hits)[0];
    } catch (error) {
        console.error('Error while searching artical:', error);
        return null;
    }
}

export async function searchArtical4Home(id) {
    const url = 'http://8.210.10.16:9200/artical/_search';

    const requestBody = {
        query: {
            "match": {
                "id": id
            }
        },
        size: 1,
    };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return change2home(parseJson(response.data.hits.hits))[0];
    } catch (error) {
        console.error('Error while searching artical:', error);
        return null;
    }
}

export async function searchArticalIds4Home() {
    const url = 'http://8.210.10.16:9200/artical/_search';

    const requestBody = {
        query: {
            "match_all": {}
        },
        size: 100,
    };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return getIds(parseJson(response.data.hits.hits));
    } catch (error) {
        console.error('Error while searching artical:', error);
        return null;
    }
}

export async function searchArticalIdsFromName4Home(userName) {
    const url = 'http://8.210.10.16:9200/artical/_search';

    const requestBody = {
        query: {
            "match": {
                "userName": userName
            }
        },
        size: 100,
    };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return getIds(parseJson(response.data.hits.hits));
    } catch (error) {
        console.error('Error while searching artical:', error);
        return null;
    }
}

function getIds(jsons) {
    let ids = [];
    for (let json_ of jsons) {
        ids.push(json_['_source']['id']);
        
    }
    return ids
}

function change2home(jsons) {
    let rets = []
    for (let json_ of jsons) {
        let json = json_['_source'];
        let images = []
        for (let body of json['body']) {
            images.push(body['image']);
        }
        let ret = {
            images: images,
            authorName: json['userName'],
            title: json['title'],
        }
        rets.push(ret);
    }
    return rets
}

function parseJson(jsons) {
    for (let json_ of jsons) {
        let json = json_['_source'];
        for (const k in json) {
            try {
                json[k] = JSON.parse(json[k]);
            }
            catch {
                json[k] = json[k];
            }
        }
    }
    return jsons;
}