// Promise.all([
//   dn_name.map( d =>  {
//     const uid = d.split(".")[1];
//     fetch("https://suttacentral.net/api/suttaplex/" + uid, {
//       method: "GET",
//       headers: {
//         "Content-type": "application/json;charset=UTF-8"
//       }
//     })
//       .then((response) => response.json())
//     // names[uid] = dn_name[index];
//   })]
// ).then((result) => console.log(result); );

// Object.entries(dn_name).forEach(([index, value]) => console.log(index.split(".")[1]));

var fs = require("fs");

// fs.writeFile('Output.txt', data, (err) => {
//
//     // In case of a error throw err.
//     if (err) throw err;
// })

const write = (text) => fs.appendFile("mymn_name.txt", text,function(err){
if(err) throw err;
});



write("test")

const data = require("./fetchData");

function chunk (arr, len) {

  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

const getUid = str => {
  var index = str.indexOf(".");  // Gets the first index where a . occours
  var id = str.substr(0, index); // Gets the first part
  var text = str.substr(index + 1);  // Gets the text part

  return text
}

const sutta = "an_name"
const keys = Object.keys(data[sutta]);
// console.log(keys.length);
const urlsAll = keys.map(d=>"https://suttacentral.net/api/suttaplex/" + getUid(d));

const urls = urlsAll;

// const urlsChunks = chunk(urlsAll,500);
// const urls = urlsChunks[0];

console.log(urls.length);

// fetch(urlsChunks[0][3]).then(res => res.json()).then(result => console.log(result[0].translated_title.trim()))
// let i=0;
// urlsChunks.forEach(urls => {
//   // const result = []
//
//   Promise.all(urls.map(u=>fetch(u))).then(responses =>
//       Promise.all(responses.map(res => res.text()))
//   ).then(json => {
//     console.log(i);
//     i++;
//     // console.log(json);
//     const push = {};
//     Object.values(json).forEach((value, i) => {
//       // push[keys[i]] = value[0].translated_title.trim()
//       push[keys[i]] = value
//     });
//     console.log(push);
//   }).catch((err) => {
//     console.log("Request Failed", err);
//   });
// })


Promise.all(urls.map(u=>fetch(u))).then(responses =>
    Promise.all(responses.map(res => res.json()))
).then(json => {
  const push = {};
  const fail = {};
  Object.values(json).forEach((value, i) => {
    // push[keys[i]] = value[0].translated_title.trim()
    let str = value[0].translated_title;
    // console.log(str);

    if (str?.length > 0) str = str.trim();
    if (str == null || str == "") fail[keys[i]] = str;
    push[keys[i]] = str;
  });
  // console.log(push);
  // write(JSON.stringify(push));
  fs.writeFileSync(sutta+'.json', JSON.stringify(push), (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
  });
  fs.writeFileSync(sutta+'-fail.json', JSON.stringify(fail), (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON fail is saved.");
  });
}).catch((err) => {
  console.log("Request Failed", err);
});

// async function fetchNames() {
//   const names = {};
//   for (const index in mn_name) {
//     const uid = index.split(".")[1];
//     fetch("https://suttacentral.net/api/suttaplex/" + uid, {
//       method: "GET",
//       headers: {
//         "Content-type": "application/json;charset=UTF-8"
//       }
//     })
//       .then((response) => response.text())
//       .then((json) => {
//         names[index]= JSON.parse(json)[0].translated_title.trim();
//         // names[index] = json[0].translated_title.trim();
//       })
//       .catch((err) => {
//         console.log("Request Failed", err);
//       }); // Catch errors
//     // names[uid] = dn_name[index];
//   }
// //   return names
// // }
// // fetchNames().then(names => console.log(JSON.stringify(names)))
//   console.log(names);

  // Object.keys(names)
  //     .sort()
  //     .forEach(function(v, i) {
  //         console.log(v, names[v]);
  //      });
  //
  //      const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
  //
  //      const myArray = [
  //        { name: 'Scene 1'},
  //        { name: 'Scene 21'},
  //        { name: 'Scene 10'},
  //        { name: 'Scene 2'}
  //      ]
  //
  //      const sorted = myArray.sort((a, b) => collator.compare(a.name, b.name))
  //
  //      console.log(sorted)
  //
  //      const unordered = {
  //        'b': 'foo',
  //        'c': 'bar',
  //        'a': 'baz'
  //      };
  //
  //      console.log(JSON.stringify(names));
  //      // → '{"b":"foo","c":"bar","a":"baz"}'
  //
  //      const ordered = Object.keys(unordered).sort().reduce(
  //        (obj, key) => {
  //          obj[key] = unordered[key];
  //          return obj;
  //        },
  //        {}
  //      );
  //
  //      console.log(JSON.stringify(ordered));
  //      // → '{"a":"baz","b":"foo","c":"bar"}'
