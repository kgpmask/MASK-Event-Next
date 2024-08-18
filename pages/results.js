import Head from "next/head";
import styles from "@/styles/Results.module.css";
import TextArea from "@/components/Base/TextArea";
import MessageCard from "@/components/Quiz/MessageCard";
import { useState } from "react";
import { useMemo } from "react";

// const resultsJSON=[
//     {
//         name: "D. Manideep",
//         username: "DMan",
//         points: 2000,
//         rank: null
//     },
//     {
//         name:"Sora",
//         username:"AkaChan",
//         points: 5000,
//         rank: null
//     },
//     {
//         name:"Sakura Miko",
//         username:"Mikochi",
//         points: 3535,
//         rank: null
//     },
//     {
//         name:"Suisei Hoshimachi",
//         username:"Sui-chan",
//         points: 5000,
//         rank: null
//     },
//     {
//         name:"Hakos Baelz",
//         username:"PPTaro",
//         points: 7770,
//         rank: null
//     },
//     {
//         name:"Oozora Subaru",
//         username:"ThaSun",
//         points: 4000,
//         rank: null
//     },
//     {
//         name:"Ceres Fauna",
//         username:"KonFaunaa",
//         points: 7770,
//         rank: null
//     },
// ];

const assignRank1= (resultsJSON)=>{
    //Ranks will look like 1,1,2,3,4
    resultsJSON.sort((a,b)=> b.points-a.points);
    resultsJSON[0].rank=1;
    for (let i = 1; i < resultsJSON.length; ++i) {
        if (resultsJSON[i-1].points>resultsJSON[i].points){
            resultsJSON[i].rank=resultsJSON[i-1].rank+1;
        } else{
            resultsJSON[i].rank=resultsJSON[i-1].rank;
        }
    }
}

const assignRank2= (resultsJSON)=>{
    //Ranks will look like 1,1,3,4,5
    resultsJSON.sort((a,b)=> b.points-a.points);
    resultsJSON[0].rank=1;
    for (let i = 1; i < resultsJSON.length; ++i) {
        if (resultsJSON[i-1].points>resultsJSON[i].points){
            resultsJSON[i].rank=i+1;
        } else{
            resultsJSON[i].rank=resultsJSON[i-1].rank;
        }
    }
}


export default function Results(){
    const [results, setResults] = useState(null);

    const fetchResults = async () => {
        try {
            const adminResponse = await fetch('/api/check-admin');
            const isAdmin = (await adminResponse.json()).isAdmin;
            if(isAdmin) await fetch('/api/live/evaluate-answer');
            const response = await fetch('/api/live/get-results');
            const data = await response.json();
            // console.log(data)
            setResults(data);
        } catch (e) {
            console.log(e);
        }
    }

    useMemo(() => {
        if(!results) fetchResults();
    }, [results]);

    if (!results || !results.length) return <MessageCard message={'Results are yet to be evaluated. Try again later.'} />;

    assignRank1(results);
    return (
        <div>
            <TextArea title="Results">
            <h4>Real results were the friends we made along the way. jk.</h4>

                <table className={styles['content-table']}>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            results.map((elem)=>{
                                return (
                                    <tr key={elem.username}>
                                        <td>{elem.rank}</td>
                                        <td>{elem.name}</td>    
                                        <td>{elem.username}</td>
                                        <td>{elem.points}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </TextArea>
        </div>
    )
}