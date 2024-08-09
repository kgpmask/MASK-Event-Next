const resultsJSON=[
    {
        name: "D. Manideep",
        username: "DMan",
        points: 2000
    },
    {
        name:"Sora",
        username:"AkaChan",
        points: 5000
    },
    {
        name:"Sakura Miko",
        username:"Mikochi",
        points: 3535
    },
    {
        name:"Suisei Hoshimachi",
        username:"Sui-chan",
        points: 5000
    },
    {
        name:"Hakos Baelz",
        username:"PPTaro",
        points: 7770
    },
    {
        name:"Oozora Subaru",
        username:"Taiyo",
        points: 4000
    },
    {
        name:"Ceres Fauna",
        username:"KonFaunaa",
        points: 7770
    }
];

resultsJSON.sort((a,b)=> a[points]>b[points]);

console.log(resultsJSON);