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

export async function search1Artical() {
    const url = 'http://8.210.10.16:9200/artical/_search';

    const requestBody = {
        query: {
            "match_all": {}
        },
        size: 1,
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