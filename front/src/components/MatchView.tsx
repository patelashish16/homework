import React, { useState, useEffect } from "react";

interface MatchViewProps {
    ws: WebSocket | null;
    subscribedProducts: string[];
}

interface MatchData {
    time: string;
    product: string;
    size: string;
    price: string;
    side: string;
}

const MatchView: React.FC<MatchViewProps> = ({ ws, subscribedProducts }) => {
    const [matches, setMatches] = useState<MatchData[]>([]);

    useEffect(() => {
        if (ws) {
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('data::: ', data);
                if (data.type === "match" && subscribedProducts.includes(data.product_id)) {
                    setMatches((prevMatches) => [
                        {
                            time: data.time,
                            product: data.product_id,
                            size: data.size,
                            price: data.price,
                            side: data.side,
                        },
                        ...prevMatches.slice(0, 9),
                    ]);
                }
            };
        }
    }, [ws, subscribedProducts]);

    return (
        <div className="match-view">
            <h2>Match View</h2>
            <ul>
                {matches.map((match, index) => (
                    <li key={index} className={match.side === "buy" ? "buy" : "sell"}>
                        {match.product}: {match.size} @ {match.price} ({match.side}) at {match.time}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchView;
