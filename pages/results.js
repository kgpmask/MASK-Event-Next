const resultsJSON=[
    {
        name: "D. Manideep",
        username: "DMan",
        points: 2000,
        rank: null
    },
    {
        name:"Sora",
        username:"AkaChan",
        points: 5000,
        rank: null
    },
    {
        name:"Sakura Miko",
        username:"Mikochi",
        points: 3535,
        rank: null
    },
    {
        name:"Suisei Hoshimachi",
        username:"Sui-chan",
        points: 5000,
        rank: null
    },
    {
        name:"Hakos Baelz",
        username:"PPTaro",
        points: 7770,
        rank: null
    },
    {
        name:"Oozora Subaru",
        username:"ThaSun",
        points: 4000,
        rank: null
    },
    {
        name:"Ceres Fauna",
        username:"KonFaunaa",
        points: 7770,
        rank: null
    }
];

resultsJSON.sort((a,b)=> b.points-a.points);

const assignRank1= (resultsJSON)=>{
    //Ranks will look like 1,1,2,3,4

    resultsJSON[0].rank=1;
    for (let i = 1; i < resultsJSON.length; ++i) {
        if (resultsJSON[i-1]>resultsJSON[i]){
            resultsJSON[i].rank=resultsJSON[i-1].rank+1;
        } else{
            resultsJSON[i].rank=resultsJSON[i-1].rank;
        }
    }
}

const assignRank2= (resultsJSON)=>{
    //Ranks will look like 1,1,3,4,5
    resultsJSON[0].rank=1;
    for (let i = 1; i < resultsJSON.length; ++i) {
        if (resultsJSON[i-1]>resultsJSON[i]){
            resultsJSON[i].rank=i+1;
        } else{
            resultsJSON[i].rank=resultsJSON[i-1].rank;
        }
    }
}

assignRank1(resultsJSON);
console.log(resultsJSON);