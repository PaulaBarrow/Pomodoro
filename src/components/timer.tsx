import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const notificationSound = new Audio('https://assets.coderrocketfuel.com/pomodoro-times-up.mp3');
Modal.setAppElement('#root'); 

const Timer: React.FC = () => {
    // default times 
    const [focusTime, setFocusTime] = useState<number>(25);
    const [breakTime, setBreakTime] = useState<number>(5);
    const [penaltyTime, setPenaltyTime] = useState<number>(1);
    
    // timer 
    const [time, setTime] = useState<number>(focusTime * 60);

    // logic states based on timer
    const [isActive, setIsActive] = useState<boolean>(false); // timer is running
    const [isFocus, setIsFocus] = useState<boolean>(true); // focus time
    const [isBreak, setIsBreak] = useState<boolean>(false); // break time
    const [isPaused, setIsPaused] = useState<boolean>(false); // timer is paused

    // prompts
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);

    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);
    

    // controls timer
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && time > 0) {
            interval = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    handleTimeEnd();
                    return 0;
                }
                return prevTime - 1;
                });
            }, 1000);
            } 
            else if (!isActive) {
                clearInterval(interval!);
            }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, time]);

    // timer reaches zero
    const handleTimeEnd = () => {
        notificationSound.play();

        if (Notification.permission === 'granted') {
            new Notification('Time’s Up!', {
                body: isFocus ? 'Focus Time Completed! Time for a break.' : 'Break Time Completed! Time to focus again.',
                icon: 'https://assets.coderrocketfuel.com/pomodoro-times-up.png', // Optional: path to an icon
            });
        }

        // if focus time ends --> start break
        if (isFocus) {
            setIsActive(false);
            setIsFocus(false);
            setIsBreak(true);
            setShowPrompt(true);
        } 

        // if break time end --> wait for user 
        else if (isBreak) {
            notificationSound.play();
            setIsFocus(true);
            setIsBreak(false);
            setTime(focusTime * 60);
            setIsActive(false);
            setShowPrompt(false);
        }
    };

    // start or pause timer
    const handleStartPause = () => {
        // pause timer
        if (isActive) {
            setIsActive(false);
            setIsPaused(true);
        } 
        else {
            //resume timer
            setIsActive(true);
            setIsPaused(false);
            if (isFocus && isPaused) {
                setTime((prevTime) => prevTime + penaltyTime * 60);
            }
        }
    };

    // reset timer
    const handleReset = () => {
        setIsActive(false);
        setIsPaused(false);
        setShowPrompt(false);
        setTime(focusTime * 60);
        setIsFocus(true);
        setIsBreak(false);
    };

    // after setting are set --> start timer
    const handleStartTimer = () => {

        setShowSettings(false);
        setTime(focusTime * 60);
        setIsActive(true);
        setIsPaused(false);
        setIsFocus(true);
        setIsBreak(false);
    };

    // edit settings
    const handleEditSettings = () => {
        setShowSettings(true);
        setIsActive(false);
    };

    // start break time
    const handleStartBreak = () => {
        setShowPrompt(false);
        setTime(breakTime * 60);
        setIsActive(true);
        setIsFocus(false);
        setIsBreak(true);
    };

    // format time
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // progress bar
    const getProgressPercentage = () => {
        const totalDuration = isFocus ? focusTime * 60 : breakTime * 60;
        return ((totalDuration - time) / totalDuration) * 100;
    };

  return (
    <div className="flex flex-col items-center ">

        <div className="flex flex-col items-center w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <div className="text-5xl font-semibold mb-4 text-gray-800">
                    {isFocus ? "Focus Time" : isBreak ? "Break Time" : ""}
                </div>

                <h1 className="text-5xl font-bold mb-6 text-purple-700">{formatTime(time)}</h1>

                <div className="relative w-full h-4 bg-gray-200 rounded-lg mb-4">
                    <div className="absolute top-0 left-0 h-full bg-green-500 rounded-lg" style={{ width: `${getProgressPercentage()}%` }}/>
                </div>

                <div className="flex justify-center space-x-4 mb-4">
                    <button className={`px-2 py-1 rounded-lg ${isActive ? "bg-red-500" : "bg-green-500"} text-white`} onClick={handleStartPause} >
                    {isActive ? "Pause" : "Start"}
                    </button>

                    <button className="px-2 py-2 rounded-lg bg-blue-500 text-white" onClick={handleReset} >
                    Reset
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-gray-500 text-white" onClick={handleEditSettings}>
                    Edit Settings
                    </button>
                </div>
                {showPrompt && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 text-center">
                            <h2 className="text-axl font-bold mb-4">Focus Time Completed!</h2>
                            <p className="mb-4">It's time for a break. Click below to start the break timer.</p>
                            <button
                            className="px-4 py-2 rounded-lg bg-green-500 text-white" onClick={handleStartBreak}> Start Break
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <Modal
                isOpen={showSettings}
                onRequestClose={() => setShowSettings(false)}
                contentLabel="Timer Settings"
                className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
            <h1 className="text-3xl font-bold mb-6 text-purple-700"> Set Timer</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Focus Time (minutes)</label>
                    <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    value={focusTime}
                    onChange={(e) => setFocusTime(Number(e.target.value))}
                    min="1"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Break Time (minutes)</label>
                    < input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    value={breakTime}
                    onChange={(e) => setBreakTime(Number(e.target.value))}
                    min="1"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Penalty Time (minutes)</label>
                    <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    value={penaltyTime}
                    onChange={(e) => setPenaltyTime(Number(e.target.value))}
                    min="0"
                    />
                </div>
                <button className="w-full px-4 py-2 rounded-lg bg-green-500 text-white mt-4" onClick={handleStartTimer} >
                    Start Timer
                </button>
            </div>
        </Modal>
    </div>
  );
};

export default Timer;
