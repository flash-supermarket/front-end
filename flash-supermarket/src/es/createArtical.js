import axios from 'axios';

export async function getArticalNum() {
    try {
        const countResponse = await axios.get(`http://8.210.10.16:9200/artical/_count`);
        return countResponse.data.count;
    } catch (error) {
        console.error('Error inserting Artical:', error.response?.data || error.message);
    }
}

export async function insertArtical(articalBody) {
    try {
        await axios.post(
            'http://8.210.10.16:9200/artical/_doc', // 索引名 + _doc + 文档ID（可省略）
            articalBody
        );
        return true;
    } catch (error) {
        console.error('Error inserting Artical:', error.response?.data || error.message);
        return false;
    }
}

export async function alterArticle(articalBody){
    try {
        articalBody = json2string(articalBody);
        const deleteUrl = 'http://8.210.10.16:9200/artical/_delete_by_query';

        const deleteBody = {
            query: {
                "term": {
                    "id": articalBody['id']
                }
            }
        };

        await axios.post(deleteUrl, deleteBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        await axios.post(
            'http://8.210.10.16:9200/artical/_doc', // 索引名 + _doc + 文档ID（可省略）
            articalBody
        );

        return true;
    } catch (error) {
        console.error('Error editting Artical:', error.response?.data || error.message);
        return false;
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

export async function searchArticalIdsFromName(userName) {
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
        return parseJson(response.data.hits.hits);
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

export async function searchArticalIdsByQuery(query) {
    const url = 'http://8.210.10.16:9200/artical/_search';
    const requestBody = {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: query,
                  fields: ['title', 'description'],
                  fuzziness: 'AUTO' // 允许拼写错误模糊匹配
                }
              }
            ]
          }
        },
        size: 9
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

function json2string(json) {
    for (const k in json) {
        json[k] = JSON.stringify(json[k]);
    }
    return json;
}