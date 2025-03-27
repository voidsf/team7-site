"use server"

import { getLeaderboardData } from "@/database/database";

export async function getLeaderboardDataF() {
    const data = await getLeaderboardData();
    if (!data.result) {
        return [];
    }

    console.log(data);

    const names = data.result.map((row: any) => row.name);
    const unique_names = Array.from(new Set(names));

    let leaderboardData = unique_names.map((name: any) => {
        const rows = data.result.filter((row: any) => row.name === name);
        const score = rows.reduce((acc: number, row: any) =>
            { 
                console.log(`acc: ${acc}`);
                console.log(`row score: ${row.score}`);
                // unary plus operator my beloved
                return acc + +row.score
            }, 0) / rows.length; 
        console.log(score);
        return { name:name, score:score };
    })

    leaderboardData.sort((a: any, b: any) => b.score - a.score);
    console.log(leaderboardData);
    return leaderboardData;
}