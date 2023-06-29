import React, { useEffect, useState } from 'react';

const Clock = () => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [digitalClock, setDigitalClock] = useState('00:00');
    const [isFocused, setFocused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const updateDigitalTime = (secs, mins) => {
        const newSecs = (secs%60).toString().padStart(2,0);
        const newMins = (mins%60).toString().padStart(2,0);
        setDigitalClock(`${newMins}:${newSecs}`);
    }

    const handleInputTime = (event) => {
        const inputTime = event.target.value;
        const [mins, secs] = inputTime.split(':').map(Number);
        if (!isNaN(mins) && !isNaN(secs)) {
            setSeconds(secs);
            setMinutes(mins);
            updateDigitalTime(secs, mins);
        }
    }

    const getPositionInDegrees = (event) => {
        const rect = event.target.getBoundingClientRect();
        const initialX = rect.left+rect.width/2;
        const initialY = rect.top+rect.height/2;
        const angle = Math.atan2(event.clientY-initialY, event.clientX-initialX);
        const newPosition = Math.round(((((angle * 90) / Math.PI)+180) % 360));
        console.log(newPosition);
        return newPosition;
    }

    const handleDragForSecondsHand = (event) => {
        setIsDragging(true);
        setSeconds(getPositionInDegrees(event));
    } 

    const handleDragForMinutesHand = (event) => {
        setIsDragging(true);
        setMinutes(getPositionInDegrees(event));
    } 

    useEffect(() => {
        const secondsInterval = setInterval(() => {
            setSeconds((prevSeconds) => {
                return ((prevSeconds+1));
            });
        }, 1000);

        const minutesInterval = setInterval(() => {
            setMinutes((prevMinutes) => {
                return ((prevMinutes+1));
            });
        }, 1000*60);

        if (isDragging || isFocused) {
            clearInterval(minutesInterval);
            clearInterval(secondsInterval);
        }

        return () => {
            clearInterval(minutesInterval);
            clearInterval(secondsInterval);
        }
    }, [isDragging, isFocused]);

    useEffect(() => {
        updateDigitalTime(seconds, minutes);
    }, [seconds, minutes]);

    return (
        <>
            <div className='clock'>
                <div
                    className='second-hand'
                    style={{ transform: `rotate(${Math.abs(seconds*6)}deg)` }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(e) => {handleDragForSecondsHand(e); setIsDragging(false); }}
                    draggable
                />
                <div
                    className='minute-hand'
                    style={{ transform: `rotate(${Math.abs(minutes*6)}deg)` }}
                    onDragStart={() =>  setIsDragging(true)}
                    onDragEnd={(e) => { handleDragForMinutesHand(e); setIsDragging(false);}}
                    draggable
                />
            </div>
            <input
                type="text"
                className='digital'
                value={digitalClock}
                onChange={handleInputTime}
                onBlur={() => setFocused(false)}
                onMouseEnter={() => setFocused(true)}
            />
        </>
    );
}

export default Clock;