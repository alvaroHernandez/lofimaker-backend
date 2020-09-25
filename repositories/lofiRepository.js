const {client, q } = require('../config/db');

const collectionName = 'lofi';

const createCollection = () =>{
  client.query(q.Exists(q.Collection(collectionName)))
    .then((ret) => {
      if(!ret){
        console.info(`collection ${collectionName} does't exist, creating it...`);
        client.query(q.CreateCollection({ name: collectionName }))
          .then(() => console.info(`collection ${collectionName} successfully created`))
          .catch((e) => { console.error(e); process.exit(1);})
      }else{
        console.info(`collection ${collectionName} already exist`);
      }
    })
};

const createIndex = () =>{
  client.query(q.Exists(q.Index(collectionName)))
    .then((ret) => {
      if(!ret){
        console.info(`index ${collectionName} does't exist, creating it...`);
        client.query(q.CreateIndex({
          name: "lofi",
          votes: 0,
          source: q.Collection("lofi"),
          values: [
            { field: ["ts"], reverse: true },
            { field: ["ref"] }],
        }))
          .then(() => console.info(`index ${collectionName} successfully created`))
          .catch((e) => { console.error(e); process.exit(1);})
      }else{
        console.info(`index ${collectionName} already exist`);
      }
    })
};

const createLoFi = loFi => client.query(
  q.Create(
    q.Collection('lofi'),
    {
      data: {
        votes: 0,
        ...loFi
      },
    },
  )
);


const getAll = () => client.query(
  q.Map(
    q.Paginate(q.Match(q.Index('lofi'))),
    q.Lambda((ts,ref) => q.Get(ref))
  )
)
  .then(result => {
    return result;
  }).catch((e) => console.log(e));

const getLoFi = (id) => client.query(
  q.Get(q.Ref(q.Collection("lofi"), id))
)
  .then(result => {
    return result;
  });


const voteLoFi = (id) => client.query(
  q.Update(
    q.Ref(
      q.Collection('lofi'),
      id
    ),
    {
      data: {
        votes: q.Add(
          q.Select(
            ['data','votes'],
            q.Get(
              q.Ref(
                q.Collection('lofi'),
                id
              )
            )
          ),
          1
        )
      }
    }
  )
)
  .then(result => {
    return result;
  });


module.exports.createLoFi = createLoFi;
module.exports.createIndex = createIndex;
module.exports.createCollection = createCollection;
module.exports.getLoFi = getLoFi;
module.exports.getAll = getAll;
module.exports.voteLoFi = voteLoFi;
