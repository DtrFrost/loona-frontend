import React, { useEffect, useState } from "react"
import "./back_ground.css"

export default function BackGround({children}) {
    const [balls, setBalls] = useState([]);

    const generateRandomBalls = () => {
        const newBalls = [];
        const ballCount = 15;
        
        for (let i = 0; i < ballCount; i++) {
            newBalls.push({
                id: i + 1,
                size: Math.floor(Math.random() * 150) + 50,
                top: Math.random() * 85 + 5,
                left: Math.random() * 85 + 5
            });
        }
        return newBalls;
    };

    useEffect(() => {
        setBalls(generateRandomBalls());
    }, []);

    useEffect(() => {
        if (balls.length === 0) return;

        const bg = document.querySelectorAll('.paralax_el');
        
        const handleMouseMove = (e) => {
            let x = e.clientX / window.innerWidth;
            let y = e.clientY / window.innerHeight;
            
            bg.forEach((element, index) => {
                const speed = (index + 1) * 20;
                element.style.transform = `translate(-${x * speed}px, -${y * speed}px)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [balls]);

    if (balls.length === 0) {
        return <div className="bg__paralax"></div>;
    }

    return (
        <>
            <div className="bg__container">
                <div className="bg__paralax">
                    {balls.map((ball) => (
                        <div 
                            key={ball.id}
                            className="paralax_el"
                            style={{
                                width: `${ball.size}px`,
                                height: `${ball.size}px`,
                                top: `${ball.top}%`,
                                left: `${ball.left}%`
                            }}
                        ></div>
                    ))}
                </div>
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
        </>
    );
};