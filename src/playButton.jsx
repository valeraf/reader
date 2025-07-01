import React, { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { AudioPlayer } from 'react-audio-play';

const TextSelectionPlayer = ({ children }) => {
  const [selection, setSelection] = useState(null);
  const [playButtonPosition, setPlayButtonPosition] = useState({ x: 0, y: 0 });
  const textContainerRef = useRef(null);
  const playerRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString().trim();

        // Check if selection is within our text container
        const containerElement = textContainerRef.current;
        if (
          containerElement &&
          containerElement.contains(range.commonAncestorContainer)
        ) {
          if (selectedText.length > 0) {
            const rect = range.getBoundingClientRect();
            const containerRect = containerElement.getBoundingClientRect();

            // Position the play button at the end of the selection
            setPlayButtonPosition({
              x: rect.right - containerRect.left + 10,
              y: rect.bottom - containerRect.top - 20,
            });

            setSelection({
              text: selectedText,
              range: range,
            });
            return;
          }
        }
      }

      // Clear selection if no valid text is selected
    //   setSelection(null);
    };

    const handleClickOutside = (event) => {
      // Clear selection when clicking outside
      if (
        textContainerRef.current &&
        !textContainerRef.current.contains(event.target)
      ) {
        setSelection(null);
        window.getSelection().removeAllRanges();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handlePlayClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!selection) return;

    if (selection.text.length > 200) {
        console.error("Selected text is too long. Please select less than 200 characters.");
        alert("Выбранный текст слишком длинный. Пожалуйста, выберите менее 200 символов.");
        return;
    }

    try {
      // Make API call here - replace with your actual API endpoint
      const text = selection.text.trim();
      if (!text) {
        console.error("No text selected for API call.");
        return;
      }
      setSelection(null);
      const response = await fetch("https://api.soundoftext.com/sounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine: "Google",
          data: {
            text,
            voice: "cs-CZ",
          },
        }),
      })

      if (response.ok) {
        const result = await response.json();
        if (result.id) {
            const audio = await fetch(`https://api.soundoftext.com/sounds/${result.id}`, {
                method: "GET",
            }).then(res => res.json()).then(resJson => {
                if (resJson.status === 'Pending') {
                    return new Promise((resolve) => {
                        const interval = setInterval(async () => {
                            const innerRes = await fetch(`https://api.soundoftext.com/sounds/${result.id}`, {
                                method: "GET",
                            })
                            const innerResJson = await innerRes.json();
                            if (innerResJson.status === 'Done') {
                                clearInterval(interval);
                                resolve(innerResJson);
                            }
                        }, 200);
                    })
                }
                return resJson
            })
            if (audio.location) {
                // const audioJson = await audio.json();
                const audioUrl = audio.location;
                
                setTimeout(() => {
                    setAudioUrl(audioUrl);
                }, 100)
            } else {
                console.error("Failed to fetch audio:", audio.statusText);
            }
        }
        console.log("API call successful:", result);
        // Handle successful API response here
      } else {
        console.error("API call failed:", response.statusText);
      }
    } catch (error) {
      console.error("API call error:", error);
      // For demo purposes, just log the selected text
      console.log("Selected text for API call:", selection.text);
    }

    // Clear selection after API call
    setSelection(null);
    window.getSelection().removeAllRanges();
  };

  return (
    <div className="">
        {audioUrl && 
            <div className="fixed bottom-0 left-0 justify-content-center w-full bg-white p-3 right-0 d-flex z-50">
                <AudioPlayer style={{width: '400px'}} src={audioUrl} autoPlay={true} ref={(element) => { 
                  playerRef.current = element;
                }}  />
            </div>
        }
      <div
        ref={textContainerRef}
        className="relative"
        style={{ userSelect: "text" }}
      >
        {children}

        {selection && (
          <button
            onClick={(event) => {
                return handlePlayClick(event)
            }}
            className="absolute bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200 z-10 flex items-center justify-center"
            style={{
              left: `${playButtonPosition.x}px`,
              top: `${playButtonPosition.y}px`,
              width: "32px",
              height: "32px",
            }}
          >
            Play
          </button>
        )}
      </div>
      {selection && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Selected Text:</h3>
          <p className="text-blue-700 italic">"{selection.text}"</p>
        </div>
      )}
    </div>
  );
};

export default TextSelectionPlayer;
